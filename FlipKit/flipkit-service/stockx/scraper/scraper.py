import asyncio
from playwright.async_api import async_playwright, Error as PlaywrightError #type: ignore
from bs4 import BeautifulSoup #type: ignore
import json
import importlib
import re

class StockXScraper:
    def __init__(self, headless=True, captcha_api_key=None, manual_captcha_timeout=180):
        self.headless = headless
        self.captcha_api_key = captcha_api_key
        self.manual_captcha_timeout = manual_captcha_timeout  # seconds

    async def _wait_for_next_data_or_timeout(self, page):
        """Poll for __NEXT_DATA__ while showing a countdown; exit if page closed."""
        step = 5  # seconds
        total = self.manual_captcha_timeout
        for remaining in range(total, -1, -step):
            if page.is_closed():
                raise RuntimeError("Browser/page was closed by user.")
            try:
                found = await page.evaluate("!!document.querySelector('script#__NEXT_DATA__')")
                if found:
                    print("✅ CAPTCHA cleared and data script found")
                    return
            except PlaywrightError:
                # Page may be navigating; ignore and keep waiting.
                pass
            if remaining > 0:
                print(f"⏳ Waiting for data... {remaining}s left")
                await page.wait_for_timeout(step * 1000)
        raise TimeoutError(f"Timed out after {total}s waiting for product data.")

    async def fetch_page(self, url: str):
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.headless,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            )
            
            context = await browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                viewport={'width': 1920, 'height': 1080},
                locale='en-US',
                timezone_id='America/New_York',
                extra_http_headers={
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                }
            )

            # Keep Playwright waits reasonable; the manual wait is handled by our loop.
            context.set_default_timeout(30000)
            context.set_default_navigation_timeout(60000)

            page = await context.new_page()
            print("🌐 Navigating to", url)
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=60000)
                print("✅ Page loaded (domcontentloaded)")
                await page.wait_for_timeout(3000)

                title = await page.title()
                print(f"📄 Page title: {title}")

                blocked = "access denied" in title.lower() or "captcha" in title.lower()
                if blocked:
                    if not self.headless:
                        print(f"⚠️ CAPTCHA/Block detected. Please solve it in the browser.")
                        print(f"⏳ You have up to {self.manual_captcha_timeout}s...")
                        await self._wait_for_next_data_or_timeout(page)
                    else:
                        await page.screenshot(path="blocked.png")
                        print("📸 Screenshot saved as blocked.png")
                        raise ValueError("StockX blocked the request (headless).")

                # If not blocked (or solved), ensure data exists (short extra wait)
                try:
                    await page.wait_for_selector('script#__NEXT_DATA__', timeout=15000)
                    print("✅ Found __NEXT_DATA__ script")
                except PlaywrightError:
                    print("⚠️ __NEXT_DATA__ not found yet, continuing...")

            except Exception as e:
                print(f"⚠️ Navigation error: {e}")
                try:
                    await page.screenshot(path="error_screenshot.png")
                    print("📸 Screenshot saved as error_screenshot.png")
                except PlaywrightError:
                    pass

            # If you closed the window, exit cleanly
            if page.is_closed():
                await context.close()
                await browser.close()
                raise RuntimeError("Browser/page was closed by user.")

            content = await page.content()

            with open("debug_page.html", "w", encoding="utf-8") as f:
                f.write(content)
            print("💾 Saved page HTML to debug_page.html")
            
            await context.close()
            await browser.close()
            return content

    async def extract_json(self, page_content: str):
        soup = BeautifulSoup(page_content, "html.parser")
        if "Access Denied" in page_content or "captcha" in page_content.lower():
            raise ValueError("StockX is blocking the request.")
        tag = soup.find("script", id="__NEXT_DATA__")
        if tag and tag.string and tag.string.strip():
            try:
                return json.loads(tag.string)
            except json.JSONDecodeError as e:
                print(f"⚠️ __NEXT_DATA__ JSON error: {e}")

        # Fallback: scan scripts for window.__NEXT_DATA__
        for script in soup.find_all("script"):
            if script.string and "window.__NEXT_DATA__" in script.string:
                match = re.search(r'window\.__NEXT_DATA__\s*=\s*(\{.*?\});', script.string, re.DOTALL)
                if match:
                    candidate = match.group(1)
                    try:
                        return json.loads(candidate)
                    except json.JSONDecodeError:
                        pass

        # Fallback: look for GetProduct JSON fragments (narrow, non-greedy)
        for script in soup.find_all("script"):
            if script.string and "GetProduct" in script.string:
                # Try to isolate outer JSON starting at first '{' up to last balanced '}'
                raw = script.string
                start = raw.find('{')
                if start != -1:
                    for end in range(len(raw), start, -1):
                        snippet = raw[start:end]
                        if snippet.count('{') == snippet.count('}'):
                            try:
                                return json.loads(snippet)
                            except json.JSONDecodeError:
                                continue

        raise ValueError("Could not extract product JSON.")

    def find_product_query(self, queries: list) -> dict:
        """Find the GetProduct query in the React Query cache"""
        for query in queries:
            if query.get("queryKey") and query["queryKey"][0] == "GetProduct":
                return query.get("state", {}).get("data", {}).get("product", {})
        raise ValueError("Product data not found in queries")

    async def parse_product(self, data: dict):
        try:
            queries = (data.get("props", {})
                           .get("pageProps", {})
                           .get("req", {})
                           .get("appContext", {})
                           .get("states", {})
                           .get("query", {})
                           .get("value", {})
                           .get("queries", []))
            product = self.find_product_query(queries)

            info = {
                "id": product.get("id"),
                "title": product.get("title"),
                "brand": product.get("brand"),
                "styleId": product.get("styleId"),
                "sizes": [
                    v.get("traits", {}).get("size")
                    for v in product.get("variants", [])
                    if not v.get("hidden")
                ],
                "image": product.get("media", {}).get("imageUrl"),
            }
            return info
        except Exception as e:
            raise ValueError(f"Failed to parse product data: {e}")

    async def scrape(self, url: str):
        """Main scraping method"""
        page_content = await self.fetch_page(url)
        data = await self.extract_json(page_content)
        product_info = await self.parse_product(data)
        return product_info


# --- USAGE ---
async def main():
    # Run with headless=False first to see what's happening
    scraper = StockXScraper(headless=False)
    url = "https://stockx.com/nike-x-skims-womens-matte-double-strap-scoop-bra-obsidian"
    
    try:
        product = await scraper.scrape(url)
        print("\n✅ SUCCESS! Product data:")
        print(json.dumps(product, indent=2))
        
        with open("product_data.json", "w", encoding="utf-8") as f:
            json.dump(product, f, indent=2)
        print("\n💾 Saved clean product data to product_data.json")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Debug files created:")
        print("   - debug_page.html (page HTML)")
        print("   - error_screenshot.png (what the page looked like)")
        print("   - blocked.png (if CAPTCHA detected)")

import asyncio
import json
import uuid
from bs4 import BeautifulSoup #type: ignore
from playwright.async_api import async_playwright, Error as PlaywrightError  # type: ignore

class StockXBrowseAPI:
    BASE_URL = "https://stockx.com/api/browse"

    def __init__(self, headless: bool = True, solve_timeout: int = 120):
        self.headless = headless
        self.solve_timeout = solve_timeout  # seconds for manual block solving

    async def _wait_if_blocked(self, page):
        title = await page.title()
        text = await page.content()
        blocked_signals = [
            "access denied",
            "captcha",
            "unusual traffic",
            "verify you are a human",
        ]
        lowered = title.lower() + " " + text.lower()
        if any(s in lowered for s in blocked_signals):
            if self.headless:
                return True  # indicate blocked in headless
            print("⚠️ Block/CAPTCHA detected. Solve manually if visible.")
            for remaining in range(self.solve_timeout, 0, -5):
                if page.is_closed():
                    raise RuntimeError("Page closed by user.")
                title = await page.title()
                text = await page.content()
                lowered = title.lower() + " " + text.lower()
                if not any(s in lowered for s in blocked_signals):
                    print("✅ Block cleared.")
                    return False
                print(f"⏳ Waiting... {remaining}s left")
                await page.wait_for_timeout(5000)
            raise RuntimeError("Timeout waiting for manual solve.")
        return False


# ...existing code above fetch_products...
    async def fetch_products(self, brand="Nike", limit=15) -> list[dict]:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=self.headless)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                viewport={"width": 1366, "height": 768},
                locale="en-US"
            )
            page = await context.new_page()
            print("🌐 Opening homepage...")
            await page.goto("https://stockx.com", wait_until="domcontentloaded")

            # PRIMARY (likely to 404 now)
            primary_params = {
                "productCategory": "all",
                "brand": brand,
                "page": "1",
                "limit": str(limit),
                "sort": "release_date",
                "order": "DESC",
            }
            primary_query = "&".join(f"{k}={v}" for k, v in primary_params.items())
            primary_url = f"{self.BASE_URL}?{primary_query}"
            print(f"🔎 Primary API fetch: {primary_url}")
            result = await page.evaluate("""async (u)=>{
                const r=await fetch(u,{credentials:'include'});return {status:r.status,text:await r.text()};
            }""", primary_url)

            status = result["status"]
            body = result["text"]

            if status == 404:
                print("⚠️ Primary 404. Using search page fallback.")
                search_url = f"https://stockx.com/search?s={brand}"
                await page.goto(search_url, wait_until="domcontentloaded")
                # Wait a bit for scripts
                await page.wait_for_timeout(3000)
                # Extract __NEXT_DATA__
                try:
                    next_data = await page.evaluate("""()=> {
                        const el = document.querySelector('#__NEXT_DATA__');
                        if(!el) return null;
                        return JSON.parse(el.textContent);
                    }""")
                except:
                    next_data = None
                if not next_data:
                    await context.close(); await browser.close()
                    raise RuntimeError("No __NEXT_DATA__ on search page.")
                # Path may vary; attempt common locations
                products = []
                # Newer StockX puts results under props.pageProps.results or searchResults
                props = next_data.get("props", {}).get("pageProps", {})
                candidates = props.get("searchResults") or props.get("results") or []
                for item in candidates:
                    if isinstance(item, dict):
                        url_key = item.get("urlKey") or item.get("slug")
                        if url_key:
                            products.append({"urlKey": url_key})
                            if len(products) >= limit:
                                break
                if not products:
                    # Fallback: scan anchors
                    html = await page.content()
                    products = [{"urlKey": u.split("/")[-1]} for u in self._extract_listing_urls(html)]
                    products = products[:limit]
                print(f"✅ Fallback collected {len(products)} products.")
                await context.close(); await browser.close()
                return products

            if status == 403:
                print("⚠️ 403 (blocked). Use headless=False or proxy.")
                await context.close(); await browser.close()
                raise RuntimeError("Blocked by anti-bot (403).")

            if status != 200:
                await context.close(); await browser.close()
                raise RuntimeError(f"API status {status}. Snippet: {body[:120]}")

            # Parse JSON if 200 (legacy structure)
            import json
            try:
                data = json.loads(body)
            except:
                await context.close(); await browser.close()
                raise RuntimeError("Failed to parse JSON body.")
            products = data.get("Products") or data.get("products") or []
            print(f"✅ Retrieved {len(products)} products.")
            await context.close(); await browser.close()
            return products
# ...existing code...
    def _extract_listing_urls(self, html: str) -> list[str]:
        soup = BeautifulSoup(html, "html.parser")
        anchors = soup.select('a[href^="/"]')
        urls = []
        for a in anchors:
            href = a.get("href")
            if href and href.count("-") >= 2 and not href.startswith("/news"):
                urls.append("https://stockx.com" + href)
        return list(dict.fromkeys(urls))
    
    # --- TEST USAGE ---
async def main():
    api = StockXBrowseAPI(headless=False)
    try:
        products = await api.fetch_products(brand="Nike", limit=10)
        print(f"Got {len(products)} products")
        for u in api.extract_urls(products):
            print(u)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
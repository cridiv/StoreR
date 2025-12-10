import json
import asyncio
from playwright.async_api import async_playwright #type: ignore
import sys
import msvcrt
import threading

products = []
main_loop = None


def read_keypress(callback):
    while True:
        if msvcrt.kbhit():
            key = msvcrt.getwch()
            callback(key)


async def main():
    global products, main_loop

    main_loop = asyncio.get_running_loop()

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            slow_mo=50,
        )
        context = await browser.new_context(viewport=None)
        page = await context.new_page()

        print("\n🚀 Scraper started.")
        print("👉 Navigate manually to ANY DHgate category/product page.")
        print("👉 Scroll manually to load products.")
        print("👉 Press 's' in the terminal to SAVE visible products.")
        print("👉 Press CTRL+C to exit.\n")

        await page.goto("https://www.dhgate.com")

        def on_keypress(key):
            if key.lower() == "s":
                print("\n🔍 Triggered save...")
                asyncio.run_coroutine_threadsafe(scrape_products(page), main_loop)

            if key == "\x03":  # CTRL+C
                print("\n⛔ Exiting...")
                sys.exit(0)

        threading.Thread(target=read_keypress, args=(on_keypress,), daemon=True).start()

        while True:
            await asyncio.sleep(1)


async def scrape_products(page):
    global products

    print("\n🔍 Extracting products...")

    # More robust selector approach - finds ANY element with product data
    scraped = await page.evaluate(
        """() => {
            const results = [];
            
            // Try multiple common DHgate selectors
            const selectors = [
                'li[data-iteminfo]',  // DHgate uses data-iteminfo
                'div[class*="product"]',
                'div[class*="item"]',
                'a[href*="/product/"]',
                '[class*="goods"]',
                '[class*="prod-"]'
            ];
            
            const foundElements = new Set();
            
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        // Avoid duplicates
                        if (!foundElements.has(el)) {
                            foundElements.add(el);
                        }
                    });
                } catch (e) {
                    console.log('Selector failed:', selector);
                }
            }
            
            // Extract data from found elements
            foundElements.forEach(item => {
                try {
                    // Try to find title
                    let title = '';
                    const titleSelectors = ['[class*="title"]', 'h3', 'h2', 'a[title]', '.product-name'];
                    for (const sel of titleSelectors) {
                        const titleEl = item.querySelector(sel);
                        if (titleEl) {
                            title = titleEl.innerText?.trim() || titleEl.getAttribute('title') || '';
                            if (title) break;
                        }
                    }
                    
                    // Try to find image
                    let img = '';
                    const imgEl = item.querySelector('img');
                    if (imgEl) {
                        img = imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy') || '';
                    }
                    
                    // Try to find price
                    let price = '';
                    const priceSelectors = ['[class*="price"]', '.cost', '[class*="amount"]'];
                    for (const sel of priceSelectors) {
                        const priceEl = item.querySelector(sel);
                        if (priceEl) {
                            price = priceEl.innerText?.trim() || '';
                            if (price) break;
                        }
                    }
                    
                    // Try to find link
                    let link = '';
                    const linkEl = item.querySelector('a[href]') || item.closest('a[href]');
                    if (linkEl) {
                        link = linkEl.href || '';
                    }
                    
                    // Only add if we found at least a title or link
                    if (title || link) {
                        results.push({ title, img, price, link });
                    }
                } catch (e) {
                    console.log('Error extracting item:', e);
                }
            });
            
            console.log('Found', results.length, 'products');
            return results;
        }"""
    )

    # Filter - only keep COMPLETE products with all fields
    complete_products = [
        p for p in scraped 
        if p.get('title') and p.get('img') and p.get('price') and p.get('link')
    ]
    
    # Show what was filtered out
    incomplete = len(scraped) - len(complete_products)

    products.extend(complete_products)

    with open("products.json", "w", encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f"💾 Saved {len(complete_products)} complete items. Total collected: {len(products)}")
    if incomplete > 0:
        print(f"⚠️  Skipped {incomplete} incomplete items (missing title/image/price/link)")
    
    if len(valid_scraped) == 0:
        print("⚠️  No products found. Try:")
        print("   1. Make sure you're on a product listing page")
        print("   2. Scroll down to load products")
        print("   3. Wait a few seconds for dynamic content to load")


if __name__ == "__main__":
    asyncio.run(main())
import asyncio
import json
import os
import sys
from scraper import StockXScraper

PRODUCT_FILE = "all_products.json"

def _load_products():
    if not os.path.exists(PRODUCT_FILE) or os.path.getsize(PRODUCT_FILE) == 0:
        return {"products": []}
    try:
        with open(PRODUCT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, dict) or "products" not in data:
                raise ValueError("Invalid structure")
            return data
    except (json.JSONDecodeError, ValueError):
        print("⚠️ Corrupt all_products.json; reinitializing.")
        return {"products": []}

def _save_products(data):
    with open(PRODUCT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

async def scrape_all(urls):
    scraper = StockXScraper(headless=False)
    existing = _load_products()
    existing_ids = {p.get("id") for p in existing["products"] if p.get("id")}
    for url in urls:
        print(f"\n🔍 Scraping: {url}\n")
        try:
            product = await scraper.scrape(url)
            pid = product.get("id")
            if pid in existing_ids:
                print(f"⏭ Already saved: {product.get('title')}")
                continue
            existing["products"].append(product)
            existing_ids.add(pid)
            _save_products(existing)
            print(f"✅ Saved: {product.get('title')}")
        except Exception as e:
            print(f"❌ Error scraping {url}: {e}")
    print("\n🎉 DONE — All products saved to all_products.json")

async def scrape_single(url: str):
    scraper = StockXScraper(headless=False)
    try:
        product = await scraper.scrape(url)
        print(json.dumps(product, indent=2))
        with open("product_data.json", "w", encoding="utf-8") as f:
            json.dump(product, f, indent=2)
        print("💾 Saved product_data.json")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "single":
        asyncio.run(scrape_single(sys.argv[2]))
    else:
        urls_path = "product_urls.txt"
        if not os.path.exists(urls_path):
            print("Missing product_urls.txt")
            sys.exit(1)
        with open(urls_path, encoding="utf-8") as f:
            URLS = [x.strip() for x in f if x.strip()]
        if not URLS:
            print("No URLs found in product_urls.txt")
            sys.exit(0)
        asyncio.run(scrape_all(URLS))
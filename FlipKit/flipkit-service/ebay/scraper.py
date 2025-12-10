import requests
from bs4 import BeautifulSoup  # type: ignore
import json
import time
from typing import List, Dict, Optional

# -------------------------------
# Configuration
# -------------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1"
}

# -------------------------------
# Helper functions
# -------------------------------
def get_html(url: str, retries: int = 3, delay: int = 2) -> str:
    """Fetch HTML content with retry logic to handle connection issues."""
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"[Warning] Attempt {attempt + 1} failed: {e}")
            time.sleep(delay * (attempt + 1))
    raise Exception(f"Failed to fetch URL after {retries} attempts: {url}")

def parse_item(item) -> Optional[Dict]:
    """Extract product details from a single eBay listing element."""
    title_el = item.select_one(".s-item__title")
    if not title_el or title_el.get_text(strip=True) == "Shop on eBay":
        return None
    title = title_el.get_text(strip=True)

    price_el = item.select_one(".s-item__price")
    price = price_el.get_text(strip=True) if price_el else None

    sold_el = item.select_one(".s-item__hotness")
    sold = sold_el.get_text(strip=True) if sold_el else None

    link_el = item.select_one(".s-item__link")
    link = link_el["href"] if link_el else None

    image_el = item.select_one(".s-item__image-img")
    image = image_el.get("src") or image_el.get("data-src") if image_el else None

    return {
        "title": title,
        "price": price,
        "sold": sold,
        "link": link,
        "image": image
    }

def scrape_ebay_category(url: str, limit: int = 20) -> List[Dict]:
    """Scrape eBay category/search page and return up to `limit` items."""
    html = get_html(url)
    soup = BeautifulSoup(html, "lxml")
    results = []

    items = soup.select(".s-item")
    for item in items:
        if len(results) >= limit:
            break
        product = parse_item(item)
        if product:
            results.append(product)

    return results

def save_products(products: List[Dict], path: str = "product.json") -> None:
    """Save scraped products to JSON file."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"[Info] Saved {len(products)} items to {path}")

# -------------------------------
# Main execution
# -------------------------------
if __name__ == "__main__":
    CATEGORY_URL = "https://www.ebay.com/b/Beauty/bn_7000259123?_sop=5"
    ITEMS_LIMIT = 20

    products = scrape_ebay_category(CATEGORY_URL, limit=ITEMS_LIMIT)
    print(f"[Info] Found {len(products)} items\n")

    for item in products:
        print(item)

    save_products(products)

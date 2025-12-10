from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from datetime import datetime
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Map categories to their respective JSON files
CATEGORY_FILES = {
    "skincare": "./products/skincare_products.json",
    "fashion": "./products/fashion_acc_products.json",
    "fragrances": "./products/fragrances_products.json",
    "pets": "./products/pets_products.json",
    "necklace": "./products/necklace_products.json",
}

PRODUCTS_FILE = "./products/products.json"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_products_from_file(file_path: str):
    """Helper function to load and normalize products from a JSON file"""
    full_path = os.path.join(BASE_DIR, file_path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail=f"Products file not found: {full_path}")
    try:
        with open(full_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        
        # Normalize the data to match frontend expectations
        normalized = []
        for i, p in enumerate(data):
            normalized.append({
                "itemId": str(i + 1),
                "title": p.get("title", ""),
                "imageUrl": p.get("img", ""),
                "priceText": p.get("price", ""),
                "shipping": "",  # Your scraped data doesn't have this
                "url": p.get("link", ""),
                "viewCount": 0,  # Your scraped data doesn't have this
                "listingDate": datetime.now().isoformat(),  # Use current time
            })
        return normalized
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
def get_all_products():
    """Get all products from the main products file"""
    products = load_products_from_file(PRODUCTS_FILE)
    print(f"📦 Returning {len(products)} products (all)")
    return {"products": products}

@app.get("/products/{category}")
def get_products_by_category(category: str):
    """Get products for a specific category"""
    print("📢 Hit category route with:", category)
    # Check if category exists in our mapping
    if category not in CATEGORY_FILES:
        raise HTTPException(
            status_code=404, 
            detail=f"Category '{category}' not found. Available categories: {', '.join(CATEGORY_FILES.keys())}"
        )
    
    # Get the file path for this category
    file_path = CATEGORY_FILES[category]
    products = load_products_from_file(file_path)
    
    print(f"📦 Returning {len(products)} products for category: {category}")
    return {"products": products}

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    print(f"🚀 Server running on {host}:{port}")
    print("Categories:", CATEGORY_FILES.keys())
    print(f"📁 Available categories: {', '.join(CATEGORY_FILES.keys())}")
    uvicorn.run(app, host=host, port=port)
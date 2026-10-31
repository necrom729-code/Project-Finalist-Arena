#!/usr/bin/env python3
"""
Placeholder for the recipe generator tool (Tools/GenerateRecipes).
Generates new crafting recipes from the tag system and writes them as data
under Content/Data/Recipes without code changes.
"""

from pathlib import Path
import json

OUTPUT_DIR = Path("Content/Data/Recipes")

def generate_recipes(category: str, count: int = 30):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[GenerateRecipes] Would generate {count} recipes for category '{category}' into {OUTPUT_DIR}")

if __name__ == "__main__":
    import sys
    cat = sys.argv[1] if len(sys.argv) > 1 else "weapons"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 30
    generate_recipes(cat, n)

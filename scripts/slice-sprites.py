#!/usr/bin/env python3
"""Slice a transparent sprite sheet into individual PNG files.

Uses alpha to isolate each item: nominal grid, then keep the largest opaque
blob whose center lies in that cell. No black color-keying.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path
from typing import List, Optional, Set, Tuple

from PIL import Image

ALPHA_MIN = 16
PAD = 4

ROOT = Path(__file__).resolve().parent.parent

SHEETS = {
    "animals": {
        "sheet": ROOT / "assets" / "animals-sheet.png",
        "out": ROOT / "assets" / "animals",
        "cols": 6,
        "rows": 4,
        "names": [
            "lion",
            "elephant",
            "giraffe",
            "zebra",
            "tiger",
            "bear",
            "penguin",
            "frog",
            "rabbit",
            "monkey",
            "fox",
            "deer",
            "dog",
            "cat",
            "cow",
            "pig",
            "sheep",
            "goat",
            "chicken",
            "duck",
            "owl",
            "bird",
            "turtle",
            "dinosaur",
        ],
    },
    "food": {
        "sheet": ROOT / "assets" / "food-sheet.png",
        "out": ROOT / "assets" / "food",
        "cols": 6,
        "rows": 4,
        "names": [
            "apple",
            "banana",
            "strawberry",
            "orange",
            "watermelon",
            "grapes",
            "pizza",
            "hamburger",
            "hot-dog",
            "cupcake",
            "ice-cream",
            "cookie",
            "carrot",
            "broccoli",
            "tomato",
            "cheese",
            "egg",
            "bread",
            "milk",
            "yogurt",
            "cereal",
            "donut",
            "fries",
            "avocado",
        ],
    },
    "monsters": {
        "sheet": ROOT / "assets" / "monsters-sheet.png",
        "out": ROOT / "assets" / "monsters",
        "cols": 3,
        "rows": 2,
        "names": [
            "dragon",
            "yeti",
            "kraken",
            "golem",
            "slime",
            "lich",
        ],
    },
    "symbols": {
        "sheet": ROOT / "assets" / "symbols-sheet.png",
        "out": ROOT / "assets" / "symbols",
        "cols": 8,
        "rows": 5,
        "names": [
            "star",
            "heart",
            "coin",
            "diamond",
            "clover",
            "mushroom",
            "crown",
            "sword",
            "chest",
            "map",
            "flag",
            "signpost",
            "castle",
            "tree",
            "mountain",
            "sun",
            "moon",
            "cloud",
            "rainbow",
            "key",
            "lock",
            "hourglass",
            "lightning",
            "swirl",
            "paw",
            "drop",
            "fire",
            "snowflake",
            "leaf",
            "flower",
            "rock",
            "bone",
            "skull",
            "claw",
            "potion",
            "shield",
            "target",
            "crate",
            "arrow-up",
            "arrow-down",
        ],
    },
}

Point = Tuple[int, int]
Blob = Tuple[int, int, int, int, int, Set[Point]]


def is_opaque(pixel: Tuple[int, int, int, int]) -> bool:
    return pixel[3] >= ALPHA_MIN


def find_opaque_blobs(image: Image.Image) -> List[Blob]:
    width, height = image.size
    pixels = image.load()
    visited = [[False] * width for _ in range(height)]
    blobs: List[Blob] = []

    for start_y in range(height):
        for start_x in range(width):
            if visited[start_y][start_x] or not is_opaque(pixels[start_x, start_y]):
                continue

            queue = deque([(start_x, start_y)])
            visited[start_y][start_x] = True
            points: Set[Point] = set()
            min_x = max_x = start_x
            min_y = max_y = start_y

            while queue:
                x, y = queue.popleft()
                points.add((x, y))
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and not visited[ny][nx]
                        and is_opaque(pixels[nx, ny])
                    ):
                        visited[ny][nx] = True
                        queue.append((nx, ny))

            blobs.append((min_x, min_y, max_x + 1, max_y + 1, len(points), points))

    return blobs


def pick_blob(blobs: List[Blob], cell_top: int, cell_bottom: int) -> Optional[Blob]:
    if not blobs:
        return None

    mid = (cell_top + cell_bottom) / 2
    in_row = [
        blob
        for blob in blobs
        if cell_top <= ((blob[1] + blob[3]) / 2) < cell_bottom
    ]
    candidates = in_row or blobs
    return max(
        candidates,
        key=lambda item: (item[4], -abs(((item[1] + item[3]) / 2) - mid)),
    )


def extract_item(sheet: Image.Image, blob: Blob) -> Image.Image:
    min_x, min_y, max_x, max_y, _size, points = blob
    x0 = max(0, min_x - PAD)
    y0 = max(0, min_y - PAD)
    x1 = min(sheet.width, max_x + PAD)
    y1 = min(sheet.height, max_y + PAD)

    width = x1 - x0
    height = y1 - y0
    side = max(width, height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    out = canvas.load()
    src = sheet.load()
    ox = (side - width) // 2
    oy = (side - height) // 2

    for x, y in points:
        out[ox + (x - x0), oy + (y - y0)] = src[x, y]

    return canvas


def slice_sheet(sheet_path: Path, out_dir: Path, cols: int, rows: int, names: List[str]) -> None:
    if not sheet_path.exists():
        raise SystemExit(f"Missing transparent sheet: {sheet_path}")
    if len(names) != cols * rows:
        raise SystemExit(f"Expected {cols * rows} names, got {len(names)}")

    sheet = Image.open(sheet_path).convert("RGBA")
    width, height = sheet.size
    out_dir.mkdir(parents=True, exist_ok=True)

    blobs = find_opaque_blobs(sheet)
    if len(blobs) < cols * rows:
        print(f"Warning: found {len(blobs)} blobs, expected at least {cols * rows}")

    for index, name in enumerate(names):
        col = index % cols
        row = index // cols
        cell_left = round(col * width / cols)
        cell_right = round((col + 1) * width / cols)
        cell_top = round(row * height / rows)
        cell_bottom = round((row + 1) * height / rows)

        overlapping = []
        for blob in blobs:
            min_x, min_y, max_x, max_y, _size, _points = blob
            center_x = (min_x + max_x) / 2
            center_y = (min_y + max_y) / 2
            if cell_left <= center_x < cell_right and cell_top <= center_y < cell_bottom:
                overlapping.append(blob)

        chosen = pick_blob(overlapping, cell_top, cell_bottom)
        if chosen is None:
            raise SystemExit(f"No item found for {name} in cell ({col},{row})")

        canvas = extract_item(sheet, chosen)
        out_path = out_dir / f"{name}.png"
        canvas.save(out_path, "PNG")
        print(
            f"Wrote {out_path.relative_to(ROOT)} "
            f"pixels={chosen[4]} canvas={canvas.width}x{canvas.height}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Slice transparent sprite sheets")
    parser.add_argument(
        "category",
        nargs="?",
        choices=sorted(SHEETS.keys()),
        help="Built-in sheet category to slice",
    )
    parser.add_argument("--all", action="store_true", help="Slice every built-in sheet")
    args = parser.parse_args()

    if args.all:
        targets = list(SHEETS.keys())
    elif args.category:
        targets = [args.category]
    else:
        parser.error("Pass a category name or --all")

    for key in targets:
        config = SHEETS[key]
        print(f"=== {key} ===")
        slice_sheet(
            config["sheet"],
            config["out"],
            config["cols"],
            config["rows"],
            config["names"],
        )


if __name__ == "__main__":
    main()

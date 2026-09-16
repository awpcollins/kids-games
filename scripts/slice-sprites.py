#!/usr/bin/env python3
"""Slice the transparent animals sprite sheet into individual PNG files.

Uses alpha to isolate each animal: nominal 6x4 grid, then keep the largest
opaque blob whose center lies in that cell (so feet from the row above are
dropped). No black color-keying — outlines stay intact.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import List, Optional, Set, Tuple

from PIL import Image

COLS = 6
ROWS = 4
ALPHA_MIN = 16
PAD = 4
NAMES = [
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
]

ROOT = Path(__file__).resolve().parent.parent
SHEET = ROOT / "assets" / "animals-sheet.png"
OUT_DIR = ROOT / "assets" / "animals"

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


def pick_animal_blob(blobs: List[Blob], cell_top: int, cell_bottom: int) -> Optional[Blob]:
    if not blobs:
        return None

    mid = (cell_top + cell_bottom) / 2
    in_row = []
    for blob in blobs:
        min_x, min_y, max_x, max_y, size, _points = blob
        center_y = (min_y + max_y) / 2
        if cell_top <= center_y < cell_bottom:
            in_row.append(blob)

    candidates = in_row or blobs
    # Prefer blobs near the vertical middle of the cell.
    return max(
        candidates,
        key=lambda item: (item[4], -abs(((item[1] + item[3]) / 2) - mid)),
    )


def extract_animal(sheet: Image.Image, blob: Blob) -> Image.Image:
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


def main() -> None:
    if not SHEET.exists():
        raise SystemExit(f"Missing transparent sheet: {SHEET}")
    if len(NAMES) != COLS * ROWS:
        raise SystemExit(f"Expected {COLS * ROWS} names, got {len(NAMES)}")

    sheet = Image.open(SHEET).convert("RGBA")
    width, height = sheet.size
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Work on full sheet blobs once — more accurate than per-cell crops.
    blobs = find_opaque_blobs(sheet)
    if len(blobs) < COLS * ROWS:
        print(f"Warning: found {len(blobs)} blobs, expected at least {COLS * ROWS}")

    for index, name in enumerate(NAMES):
        col = index % COLS
        row = index // COLS
        cell_left = round(col * width / COLS)
        cell_right = round((col + 1) * width / COLS)
        cell_top = round(row * height / ROWS)
        cell_bottom = round((row + 1) * height / ROWS)

        # Blobs whose bbox overlaps this cell, scored by center in cell.
        overlapping = []
        for blob in blobs:
            min_x, min_y, max_x, max_y, size, points = blob
            center_x = (min_x + max_x) / 2
            center_y = (min_y + max_y) / 2
            if cell_left <= center_x < cell_right and cell_top <= center_y < cell_bottom:
                overlapping.append(blob)

        chosen = pick_animal_blob(overlapping, cell_top, cell_bottom)
        if chosen is None:
            raise SystemExit(f"No animal found for {name} in cell ({col},{row})")

        canvas = extract_animal(sheet, chosen)
        out_path = OUT_DIR / f"{name}.png"
        canvas.save(out_path, "PNG")
        print(
            f"Wrote {out_path.relative_to(ROOT)} "
            f"pixels={chosen[4]} canvas={canvas.width}x{canvas.height}"
        )


if __name__ == "__main__":
    main()

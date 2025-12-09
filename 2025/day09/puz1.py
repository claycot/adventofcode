from typing import Tuple

def main():
    red_tiles: list[Tuple[int, int]] = []
    max_area: int = 0

    with open("input.txt") as file:
        for line in file:
            [c, r] = list(map(lambda x: int(x), line.split(",")))
            for tile in red_tiles:
                max_area = max(max_area, find_area_from_corners(tile, (r, c)))
            red_tiles.append((r, c))

    print(max_area)
    return max_area

def find_area_from_corners(corner_a: Tuple[int, int], corner_b: Tuple[int, int]) -> int:
    w = abs(corner_b[0] - corner_a[0]) + 1
    h = abs(corner_b[1] - corner_a[1]) + 1

    return w * h

if __name__ == "__main__":
    main()
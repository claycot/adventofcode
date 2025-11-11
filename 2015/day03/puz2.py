from collections import defaultdict
from typing import Tuple

def main():
    DIRECTIONS: dict[str, Tuple[int, int]] = {
        '^': (-1, 0),
        '>': (0, 1),
        'v': (1, 0),
        '<': (0, -1),
    }
    santa_locs = [
        (0, 0),
        (0, 0),
    ]
    which_santa = 0

    presents_at_house = defaultdict(int)
    # santa and robo-santa both deliver to first house
    presents_at_house[(0, 0)] = 2 

    with open('input.txt') as file:
        for line in file:
            for char in line:
                if char not in DIRECTIONS:
                    raise ValueError(f"invalid input! received character: {char} instead of a directional")
                
                dx, dy = DIRECTIONS[char]
                x, y = santa_locs[which_santa]
                santa_locs[which_santa] = (x + dx, y + dy)

                presents_at_house[santa_locs[which_santa]] += 1
                
                which_santa = (which_santa + 1) % 2
    
    print(f"there were {len(presents_at_house)} houses that received presents!")

if __name__ == "__main__":
    main()
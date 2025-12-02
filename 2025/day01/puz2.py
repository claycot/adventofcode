from typing import Tuple

def main():
    DIAL_MIN_VALUE = 0
    DIAL_MAX_VALUE = 99
    dial_position = 50
    num_zeroes = 0

    with open("input.txt") as file:
        for line in file:
            inst = line.rstrip()
            dir, dist = parse_instruction(inst)
            print(f"--turning dial {'left' if dir == -1 else 'right'} for {dist} values--")

            for _ in range(dist):
                dial_position += dir
                if dial_position < DIAL_MIN_VALUE:
                    dial_position = DIAL_MAX_VALUE
                elif dial_position > DIAL_MAX_VALUE:
                    dial_position = DIAL_MIN_VALUE

                if dial_position == 0:
                    num_zeroes += 1
                    print(f"found a zero! count is now {num_zeroes}")
    
    print(num_zeroes)
    return num_zeroes

def parse_instruction(instruction: str) -> Tuple[str, int]:
    if len(instruction) < 2:
        raise ValueError(f"invalid instruction received: {instruction}; must include direction and distance")
    
    direction = instruction[0:1]
    if direction not in "LR":
        raise ValueError(f"invalid instruction received: {instruction}; could not parse direction")
    elif direction == "L":
        direction = -1
    elif direction == "R":
        direction = 1

    distance = instruction[1:]
    try:
        distance = int(distance)
    except:
        raise ValueError(f"invalid instruction received: {instruction}; could not parse distance")
    
    return direction, distance

if __name__ == "__main__":
    main()
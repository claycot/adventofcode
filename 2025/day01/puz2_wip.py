from typing import Tuple

def main():
    DIAL_MIN_VALUE = 0
    DIAL_MAX_VALUE = 99
    dial_position = 50
    num_zeroes = 0

    with open("input_shortest.txt") as file:
        for line in file:
            inst = line.rstrip()
            dir, dist = parse_instruction(inst)
            print(f"--turning dial {'left' if dir == -1 else 'right'} for {dist} values--")

            ignore_first_zero = (dial_position == 0)
            # if dial_position == 0 and dir < 0:
            #     num_zeroes -= 1
            #     print(f"subtracting a zero because we're about to spin backwards from 0")

            dial_position += (dir * dist)
            while dial_position > DIAL_MAX_VALUE:
                print(f"dial is on {dial_position}, need to subtract {DIAL_MAX_VALUE - DIAL_MIN_VALUE + 1}")
                dial_position -= (DIAL_MAX_VALUE - DIAL_MIN_VALUE + 1)
                if ignore_first_zero or dial_position == 0:
                    ignore_first_zero = False
                else:
                    num_zeroes += 1
                    print(f"num zeroes is now {num_zeroes}")
            while dial_position < DIAL_MIN_VALUE:
                print(f"dial is on {dial_position}, need to add {DIAL_MAX_VALUE - DIAL_MIN_VALUE + 1}")
                dial_position += (DIAL_MAX_VALUE - DIAL_MIN_VALUE + 1)
                if ignore_first_zero or dial_position == 0:
                    ignore_first_zero = False
                else:
                    num_zeroes += 1
                    print(f"num zeroes is now {num_zeroes}")
                
            if dial_position == 0:
                print("dial on zero!")
                num_zeroes += 1
                print(f"num zeroes is now {num_zeroes}")
            else:
                print(f"dial on {dial_position}")
    
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
def main():
    floor = 0
    target_floor = -1

    with open('input.txt') as file:
        for line in file:
            for i, char in enumerate(line):
                if char == '(':
                    floor += 1
                elif char == ')':
                    floor -= 1
                else:
                    raise ValueError(f"input error! found illegal char {char} at position {i}")
                if floor == target_floor:
                    print(f"reached target floor {target_floor} after following {i + 1} instructions")
                    return
    
    print(f"did not end up on floor {target_floor}, last instruction left me at {floor}")

main()
def main():
    floor = 0

    with open('input.txt') as file:
        for line in file:
            for char in line:
                if char == '(':
                    floor += 1
                elif char == ')':
                    floor -= 1
                else:
                    raise ValueError(f"input error! found illegal char {char}")
    
    print(floor)

main()
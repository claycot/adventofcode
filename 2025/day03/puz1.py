def main(): 
    sum_joltages = 0

    with open("input.txt") as file:
        for line in file:
            sum_joltages += find_max_joltage(line.rstrip())
    
    print(sum_joltages)
    return sum_joltages

def find_max_joltage(line: str) -> int:
    digits = []

    for c in line:
        c_int = int(c)
        if len(digits) < 2:
            digits.append(c_int)
        elif digits[1] > digits[0]:
            digits[0] = digits[1]
            digits[1] = c_int
        elif c_int > digits[1]:
            digits[1] = c_int
    
    # print(f"max joltage of {line} is {digits[0] * 10 + digits[1]}")
    return 10 * digits[0] + digits[1]

if __name__ == "__main__":
    main()
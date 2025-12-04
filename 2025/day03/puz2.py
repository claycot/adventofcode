def main(): 
    sum_joltages = 0

    with open("input.txt") as file:
        for line in file:
            sum_joltages += find_max_joltage(line.rstrip(), 12)
    
    print(sum_joltages)
    return sum_joltages

def find_max_joltage(line: str, num_digits: int) -> int:
    digits = []

    for c in line:
        c_int = int(c)

        # if we don't have a full joltage list, add the next digit to the end
        if len(digits) < num_digits:
            digits.append(c_int)
        # otherwise, remove the first digit in the list that's smaller than the next
        # and shift everything up, adding the new digit to the end
        else:
            digits.append(c_int)
            digit_popped = False
            for i in range(len(digits) - 1):
                # if the digit is smaller than the next digit, shift the array then break
                if digits[i] < digits[i + 1]:
                    digits.pop(i)
                    digit_popped = True
                    break
            # if a digit was not removed, remove the last digit from the end
            if not digit_popped:
                digits.pop()

    # print(f"max joltage of {line} is {digits[0] * 10 + digits[1]}")
    joltage = 0
    for power, val in enumerate(digits[::-1]):
        joltage += (val * pow(10, power))
    return joltage

if __name__ == "__main__":
    main()
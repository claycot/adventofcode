def main(): 
    JOLTAGE_STRING_LENGTH = 12
    sum_joltages = 0

    with open("input.txt") as file:
        for line in file:
            sum_joltages += find_max_joltage(line.rstrip(), JOLTAGE_STRING_LENGTH)
    
    print(sum_joltages)
    return sum_joltages

def find_max_joltage(line: str, num_digits: int) -> int:
    digits = []

    for c in line:
        # append the digit to the end
        digits.append(int(c))

        # if we don't have too many elements, do nothing!

        # otherwise, look for a digit in the list that's smaller than the next
        # so it can be removed and everything else be shifted up
        if len(digits) == (num_digits + 1):
            # track whether or not we removed a digit
            digit_popped = False

            # look for a digit that's smaller than the next
            for i in range(len(digits) - 1):
                # if found, remove it and shift everything left
                if digits[i] < digits[i + 1]:
                    digits.pop(i)
                    # track that we removed a digit then stop looking
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
def main():
    sum: int = 0
    NEG_CHAR = "-"
    NUM_CHARS = "1234567890"

    with open("input.txt") as file:
        for line in file:
            numStr = ""
            for char in line:
                if char in NUM_CHARS:
                    numStr += char
                    continue
                elif len(numStr) > 0:
                    sum += int(numStr)
                    numStr = ""
                    
                if (char == NEG_CHAR):
                    numStr += char
    
    print(sum)
    return sum

if __name__ == "__main__":
    main()
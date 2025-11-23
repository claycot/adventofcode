def main():
    pattern = ''
    with open("input.txt") as file:
        for line in file: 
            pattern = line.rstrip()

    for _ in range(40):
        pattern = say_hear(pattern)

    print(len(pattern))
    return 0

# two pointers approach to turn the string into hearsay
def say_hear(pattern: str) -> str:
    hearsay = ''
    i = 0

    # make sure the second pointer is within the string
    for j in range(len(pattern)):
        # print(f"pointers are i={i} and j={j}; char at i is {pattern[i]}")
        # if the chars don't match between the pointers, hear what they say
        if pattern[i] != pattern[j]:
            hearsay += str(j - i)
            hearsay += pattern[i]
            i = j

    # need to add 1 here because j won't equal full length of string
    hearsay += str(j - i + 1)
    hearsay += pattern[i]

    return hearsay

if __name__ == "__main__":
    main()
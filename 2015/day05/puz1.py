def main():
    nice_strings = 0

    with open('input.txt') as file:
        for line in file:
            nice_strings += is_nice(line.rstrip())

    return nice_strings

BAD_STRINGS = [
    'ab', 'cd', 'pq', 'xy'
]
VOWELS = [
    'a', 'e', 'i', 'o', 'u'
]
VOWEL_TARGET = 3
def is_nice(candidate: str) -> int:
    num_vowels = 0
    has_letter_pair = False

    for c in range(len(candidate)):
        char = candidate[c]
        next_char = '' if c + 1 == len(candidate) else candidate[c + 1]
        if (char + next_char) in BAD_STRINGS:
            return 0
        if char in VOWELS:
            num_vowels += 1
        if char == next_char:
            has_letter_pair = True
    
    return 1 if num_vowels >= VOWEL_TARGET and has_letter_pair else 0

if __name__ == "__main__":
    print(main())
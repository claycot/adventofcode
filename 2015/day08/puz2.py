def main() -> int:
    diff = 0

    with open('input.txt') as file:
        for line in file:
            diff += find_char_diff(line.rstrip())

    return diff

def find_char_diff(line: str) -> int:
    code_chars = len(line)

    # we need to surround the string with new quotes after encoding the ones within
    encoded_chars = 2

    for i in range(len(line)):
        c = line[i]
        # quotes and slashes each require 2 encoded chars
        if c == '"' or c == '\\':
            encoded_chars += 2
        else:
            encoded_chars += 1
        i += 1

    # print(f"line {line} has {code_chars} chars and {encoded_chars} after encoding: diff is {encoded_chars - code_chars}")
    return encoded_chars - code_chars

if __name__ == "__main__":
    print(main())
def main() -> int:
    diff = 0

    with open('input.txt') as file:
        for line in file:
            diff += find_char_diff(line.rstrip())

    return diff

def find_char_diff(line: str) -> int:
    code_chars = len(line)

    display_chars = 0
    i = 0
    while i < len(line):
        c = line[i]
        # quotes don't count unless they were preceded by a \
        if c == '"':
            True
        # if a single backslash is found, check the next char to determine how far to jump
        elif c == '\\':
            # count the display char since a slash always creates a visible char
            display_chars += 1
            # the loop will already skip the character itself
            # if the next char is an x, jump ahead 3 to skip x00-x99
            if line[i + 1] == 'x':
                i += 3
            # if the next char is an apostrophe or a slash, jump ahead 1 to skip ' or \
            elif line[i + 1] == '\\' or line[i + 1] == '\'':
                i += 1
        else:
            display_chars += 1
        i += 1

    # print(f"line {line} has {code_chars} chars and {display_chars} of them are visible: diff is {code_chars - display_chars}")
    return code_chars - display_chars

if __name__ == "__main__":
    print(main())
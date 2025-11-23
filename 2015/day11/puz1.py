def main():
    pwd = ''
    with open("input.txt") as file:
        for line in file:
            pwd = line

    pwd = find_next_password(pwd)
    while not validate_password(pwd):
        pwd = find_next_password(pwd)

    print(pwd)
    return pwd

def has_banned_chars(pwd: str) -> bool:
    BANNED_CHARS = ["i", "o", "l"]
    for char in pwd:
        if char in BANNED_CHARS:
            return False
    return True

def has_desired_pairs(pwd: str, desired_pairs: int) -> bool:
    num_pairs = 0

    j = 1
    while j < len(pwd):
        if pwd[j - 1] == pwd[j]:
            num_pairs += 1
            if num_pairs == desired_pairs:
                return True
            j += 1
        j += 1

    return False

def has_increasing_sequence(pwd: str, desired_len: int) -> bool:
    i = 0
    for j in range(1, len(pwd)):
        if ord(pwd[j]) == (ord(pwd[j - 1]) + 1):
            if j - i + 1 == desired_len:
                return True
        else:
            i = j

    return False

def validate_password(pwd: str) -> bool:
    return not has_banned_chars(pwd) and has_desired_pairs(pwd, 2) and has_increasing_sequence(pwd, 3)

def find_next_password(pwd: str) -> str:
    next_pwd = ''
    char_y = True # it's a pun! increment next char if carry value is true

    for char in pwd[::-1]:
        if char == 'z' and char_y:
            next_pwd = 'a' + next_pwd
            char_y = True
        elif char_y:
            next_pwd = chr(ord(char) + 1) + next_pwd
            char_y = False
        else:
            next_pwd = char + next_pwd

    return next_pwd

if __name__ == "__main__":
    main()
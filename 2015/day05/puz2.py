from collections import defaultdict

def main():
    nice_strings = 0

    with open('input.txt') as file:
        for line in file:
            nice_strings += is_nice(line.rstrip())

    return nice_strings

def is_nice(candidate: str) -> int:
    return 1 if has_gapped_letter(candidate) and has_repeated_pair(candidate) else 0

def has_gapped_letter(candidate: str) -> bool:
    for c in range(len(candidate) - 2):
        if candidate[c] == candidate[c + 2]:
            return True
        
    return False

def has_repeated_pair(candidate: str) -> bool:
    # track the indices of the pairs in the string
    pairs = defaultdict(list)
    for c in range(len(candidate) - 1):
        pairs[candidate[c : c + 2]].append(c)

    # require that the first and last occurrence of the pair are at least 1 char apart
    for pair in pairs:
        indices = pairs[pair]
        if indices[-1] - indices[0] >= 2:
            return True
        
    return False

if __name__ == "__main__":
    print(main())
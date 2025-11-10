import hashlib

def main():
    seed = ''
    i = 1

    with open('input.txt') as file:
        for line in file:
            seed = line.rstrip()
    
    while True:
        coin_hash = hashlib.md5(f"{seed}{i}".encode('utf-8')).hexdigest()
        if coin_hash.startswith("000000"):
            print(i)
            break
        i += 1
    
    return

if __name__ == "__main__":
    main()
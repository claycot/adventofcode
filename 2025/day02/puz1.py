def main():
    sum_nonsense = 0

    with open("input.txt") as file:
        for line in file:
            for instruction in line.rstrip().split(","):
                indices = instruction.split("-")
                if len(indices) != 2:
                    raise ValueError(f"received invalid instruction: {instruction}")
                
                # print(f"instruction: {instruction}; validating indices in range {range(int(indices[0]), int(indices[1]))}")
                for id in range(int(indices[0]), int(indices[1]) + 1):
                    # print(f"validating ID {id}")
                    if not is_valid_ID(id):
                        sum_nonsense += id

    print(sum_nonsense)
    return sum_nonsense

def is_valid_ID(id: int) -> bool:
    id_string = str(id)
    id_string_len = len(id_string)
    is_valid = True
    
    # even-length IDs are invalid if the first and second half are equal
    if id_string_len % 2 == 0 and id_string[0 : (id_string_len // 2)] == id_string[(id_string_len // 2):]:
        is_valid = False
        # print(f"ID {id} is invalid")
    
    return is_valid

if __name__ == "__main__":
    main()
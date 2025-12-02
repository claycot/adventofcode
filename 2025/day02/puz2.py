def main():
    sum_nonsense = 0

    # print(f"sequence {11} is valid: {is_valid_ID(11)}")
    # print(f"sequence {12} is valid: {is_valid_ID(12)}")

    with open("input.txt") as file:
        for line in file:
            for instruction in line.rstrip().split(","):
                indices = instruction.split("-")
                if len(indices) != 2:
                    raise ValueError(f"received invalid instruction: {instruction}")

                # print(f"instruction: {instruction}; validating indices in {range(int(indices[0]), int(indices[1]))}")
                for id in range(int(indices[0]), int(indices[1]) + 1):
                    # print(f"validating ID {id}")
                    if not is_valid_ID(id):
                        # print(f"ID {id} is invalid")
                        sum_nonsense += id

    print(sum_nonsense)
    return sum_nonsense

def is_valid_ID(id: int) -> bool:
    id_string = str(id)
    id_string_len = len(id_string)
    is_valid = True
    
    # starting with len 1, check if substring sequences can tile the whole string
    # print(f"checking all sequences in {range(1, id_string_len // 2 + 1)}")
    for seq_len in range(1, id_string_len // 2 + 1):
        # if the sequence does not evenly divide into the ID, it can't tile
        if id_string_len % seq_len != 0:
            # print(f"sequence of length {seq_len} can not tile ID of length {id_string_len}")
            continue
        
        # if it does tile evenly, check if it's invalid
        seq = id_string[0:seq_len]
        # print(f"checking if sequence {seq} can tile...")
        i = 0
        seq_tiled = True
        while i < id_string_len:
            # print(f"checking if sequence starting at {i} ({id_string[i:i + seq_len]}) equals {seq}")
            # if the sequence can't tile, stop trying to tile it!
            if id_string[i:i + seq_len] != seq:
                seq_tiled = False
                break
            else:
                i += seq_len

        # if we successfully tiled, stop trying and return False
        if seq_tiled:
            is_valid = False
            break
    
    return is_valid

if __name__ == "__main__":
    main()
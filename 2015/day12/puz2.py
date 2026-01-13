import json

def main():
    sum: int = 0
    input = None

    with open("input.txt") as file:
        input = json.load(file)

    sum = count_numbers_in_obj(input)

    print(sum)
    return sum

# tolerate either a list or a dict
def count_numbers_in_obj(obj: list[any] | dict[any]) -> int:
    sum: int = 0
    SPY_WORD = "red"

    if isinstance(obj, list):
        # print("obj is a list")
        for val in obj:
            if isinstance(val, int):
                sum += val
            else:
                sum += count_numbers_in_obj(val)
    elif isinstance(obj, dict):
        # print("obj is a dict")
        temp_sum = 0
        has_spy_word = False
        
        for val in obj.values():
            if val == SPY_WORD:
                has_spy_word = True
                break

            if isinstance(val, int):
                temp_sum += val
            else:
                temp_sum += count_numbers_in_obj(val)

        if not has_spy_word:
            sum += temp_sum
    else:
        True
        # print(f"obj is unexpected type: {type(obj)}")

    return sum


if __name__ == "__main__":
    main()
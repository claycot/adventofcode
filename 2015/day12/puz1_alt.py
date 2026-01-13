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

    if isinstance(obj, list):
        # print("obj is a list")
        for val in obj:
            if isinstance(val, int):
                sum += val
            else:
                sum += count_numbers_in_obj(val)
    elif isinstance(obj, dict):
        # print("obj is a dict")
        for val in obj.values():
            if isinstance(val, int):
                sum += val
            else:
                sum += count_numbers_in_obj(val)
    else:
        True
        # print(f"obj is unexpected type: {type(obj)}")

    return sum


if __name__ == "__main__":
    main()
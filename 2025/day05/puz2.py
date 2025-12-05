from typing import Tuple

def main():
    found_all_ranges = False
    ranges = []
    count_possible_fresh = 0

    with open("input.txt") as file:
        for line in file:
            if not found_all_ranges:
                if len(line.rstrip()) == 0:
                    found_all_ranges = True
                    # print("end of ranges, merging...")
                    ranges = merge_intervals(ranges)
                    # print("intervals merged successfully")
                    # print(ranges)
                else:
                    ranges.append(list(map(lambda x: int(x), line.rstrip().split("-"))))
            else:
                count_possible_fresh = possible_fresh_ingredients(ranges)
                break
                
    print(count_possible_fresh)
    return count_possible_fresh

def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    sorted_intervals = sorted(intervals)

    # two pointers
    # pointer 1 -> interval eating smaller intervals
    ptr_hungry_interval = 0
    # pointer 2 -> potential interval food
    ptr_potential_snack = 1

    # while pointer 2 is less than the len of array...
    while ptr_potential_snack < len(sorted_intervals):
        # if the first element at pointer 2 is within the range of pointer 1's interval...
        if (sorted_intervals[ptr_hungry_interval][0] <= sorted_intervals[ptr_potential_snack][0] and
            sorted_intervals[ptr_hungry_interval][1] >= sorted_intervals[ptr_potential_snack][0]):
            # if the second element at pointer 2 is also within that range...
            if (sorted_intervals[ptr_hungry_interval][0] <= sorted_intervals[ptr_potential_snack][1] and
                sorted_intervals[ptr_hungry_interval][1] >= sorted_intervals[ptr_potential_snack][1]):
                # delete the interval at pointer 2. It is a subset
                sorted_intervals.pop(ptr_potential_snack)
            # else...
            else:
                # update second element in pointer 1 to be equal to second element in pointer 2
                sorted_intervals[ptr_hungry_interval][1] = sorted_intervals[ptr_potential_snack][1]
                # delete interval at pointer 2, shift remainder left
                sorted_intervals.pop(ptr_potential_snack)
            # pointers stay where they are!
        # else...
        else:
            # increment both pointers
            ptr_hungry_interval += 1
            ptr_potential_snack += 1

    return sorted_intervals

def possible_fresh_ingredients(ranges: list[list[int]]) -> int:
    # print(f"checking if ingredient {ingredient} is fresh")
    sum = 0

    for range in ranges:
        # need to add 1 since the ranges are inclusive
        num_in_range = range[1] - range[0] + 1
        # print(f"{num_in_range} fresh ingredients in range {range}")

        sum += num_in_range

    return sum

if __name__ == "__main__":
    main()
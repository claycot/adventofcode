from itertools import combinations
import math

def main():
    paper_needed = 0
    ribbon_needed = 0

    with open('input.txt') as file:
        for line in file:
            dims = list(map(int, line.rstrip().split('x')))
            paper_needed += cover_in_paper(dims)
            ribbon_needed += wrap_in_ribbon(dims)

    print(f"total amount of paper needed is {paper_needed} ft^2")
    print(f"total amount of ribbon needed is {ribbon_needed} ft")


def cover_in_paper(sides):
    paper_needed = 0
    smallest_side_area = -1

    if len(sides) != 3:
        raise ValueError(f"box should have 3 dimensions, provided with {sides.length}")

    for a, b in combinations(sides, 2):
        side_area = a * b
        paper_needed += 2 * side_area
        if smallest_side_area == -1 or side_area < smallest_side_area:
            smallest_side_area = side_area

    paper_needed += smallest_side_area
    print(f"it takes {paper_needed} ft^2 of paper to cover this box")
    return paper_needed

def wrap_in_ribbon(sides):
    ribbon_needed = -1

    if len(sides) != 3:
        raise ValueError(f"box should have 3 dimensions, provided with {sides.length}")

    for a, b in combinations(sides, 2):
        side_perimeter = 2 * (a + b)
        if ribbon_needed == -1 or side_perimeter < ribbon_needed:
            ribbon_needed = side_perimeter

    ribbon_needed += math.prod(sides)
    print(f"it takes {ribbon_needed} ft of ribbon to wrap this box")
    return ribbon_needed

main()
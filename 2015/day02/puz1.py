def main():
    paper_needed = 0

    with open('input.txt') as file:
        for line in file:
            dims = list(map(int, line.rstrip().split('x')))
            paper_needed += cover_in_paper(dims)

    print(f"total amount of paper needed is {paper_needed} ft^2")


def cover_in_paper(sides):
    paper_needed = 0
    smallest_side_area = -1

    if len(sides) != 3:
        raise ValueError(f"box should have 3 dimensions, provided with {sides.length}")

    for i in range(2):
        for j in range(i + 1, 3):
            # print(f"combining side at index {i} and {j}")
            side_area = sides[i] * sides[j]
            paper_needed += 2 * side_area
            if smallest_side_area == -1 or side_area < smallest_side_area:
                smallest_side_area = side_area

    paper_needed += smallest_side_area
    print(f"it takes {paper_needed} ft^2 of paper to cover this box")
    return paper_needed

main()
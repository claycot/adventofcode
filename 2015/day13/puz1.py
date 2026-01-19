import math
import itertools

def main():
    name_index: list[str] = []
    happiness_matrix: list[list[int]] = []

    matrix_todo = []

    with open("input.txt") as file:
        for line in file:
            components = line.rstrip().split(" ")
            name_1 = components[0]
            name_2 = components[-1][:-1]
            val = int(components[3]) if components[2] == "gain" else -1 * int(components[3])
            todo = [name_1, name_2, val]

            if name_1 not in name_index:
                name_index.append(name_1)
            if name_2 not in name_index:
                name_index.append(name_2)

            matrix_todo.append(todo)
    
    for _ in range(len(name_index)):
        happiness_matrix.append(len(name_index) * [None])

    for todo in matrix_todo:
        index_1 = name_index.index(todo[0])
        index_2 = name_index.index(todo[1])
        happiness_matrix[index_1][index_2] = todo[2]

    # print(happiness_matrix)

    max_happy = -math.inf
    for seating_arrangement in itertools.permutations(range(len(name_index))):
        happy = calculate_happiness(list(seating_arrangement), happiness_matrix)
        max_happy = max(max_happy, happy)

    print(max_happy)
    return max_happy

def calculate_happiness(seating_array: list[int], happy_matrix: list[list[int]]) -> int:
    happiness: int = 0

    # duplicate the first person to the end of the array so we don't have to wrap around
    seating_array.append(seating_array[0])

    for i in range(len(seating_array) - 1):
        seat_i = seating_array[i]
        seat_j = seating_array[i + 1]
        # happiness is a bidirectional relationship, so add both
        happiness += happy_matrix[seat_i][seat_j]
        happiness += happy_matrix[seat_j][seat_i]

    return happiness

if __name__ == "__main__":
    main()
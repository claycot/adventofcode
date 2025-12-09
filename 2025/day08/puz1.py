from typing import Tuple

def main():
    NUM_CONNECTIONS_PROCESSED: int = 1000
    NUM_CIRCUITS_COUNTED: int = 3

    # boxes will be given an integer ID that corresponds to their original position in the input
    boxes: list[list[int]] = []

    # distance between any two boxes (one-directional for space efficiency, for i <= j the dist is -1)
    distance_matrix: list[list[float]] = []

    # ordered list of nearest boxes; does not contain the actual distance
    distance_queue: list[Tuple[int, int]] = []

    # list of circuits that have been created
    circuits: list[list[int]] = []

    with open("input.txt") as file:
        for line in file:
            boxes.append(list(map(lambda x: int(x), line.split(","))))

    for i in range(len(boxes)):
        dists = []
        for j in range(len(boxes)):
            # need sentinel value to make sure we don't link a box to itself
            # also only allow links in one direction since they're equidistant
            # better for compute and memory this way (:
            if j <= i:
                dists.append(-1)
            else:
                distance_queue.append((i, j))
                dists.append(find_3d_distance(boxes[i], boxes[j]))
        distance_matrix.append(dists)

    # sort the queue so the closests boxes come first
    distance_queue.sort(key=lambda linkage: distance_matrix[linkage[0]][linkage[1]])
    # print(distance_queue)

    for link in distance_queue[0 : NUM_CONNECTIONS_PROCESSED]:
        [box_a, box_b] = link

        box_a_circuit = find_box_circuit(box_a, circuits)
        box_b_circuit = find_box_circuit(box_b, circuits)

        # print(f"processing the next link between {box_a} [circuit {box_a_circuit}] and {box_b} [circuit {box_b_circuit}], which has a dist of {distance_matrix[box_a][box_b]}")

        # if neither box is in a circuit, make a new one!
        if box_a_circuit == -1 and box_b_circuit == -1:
            circuits.append([box_a, box_b])
            # print(f"creating a new circuit! there are now {len(circuits)}")

        # if only one box is in a circuit, add the orphan to the circuit
        elif box_a_circuit != -1 and box_b_circuit == -1:
            circuits[box_a_circuit].append(box_b)
            # print(f"added box {box_b} to circuit {circuits[box_a_circuit]}")

        elif box_b_circuit != -1 and box_a_circuit == -1:
            circuits[box_b_circuit].append(box_a)
            # print(f"added box {box_a} to circuit {circuits[box_b_circuit]}")

        # if both boxes are in a circuit, merge the circuits
        # make sure they're not already in the same circuit or we will loop infinitely
        elif box_a_circuit != -1 and box_b_circuit != -1 and (box_a_circuit != box_b_circuit):
            for box in circuits[box_b_circuit]:
                circuits[box_a_circuit].append(box)
            circuits.pop(box_b_circuit)
            # print(f"merged circuits! removed circuit {box_b_circuit}")

    # print(distance_matrix)
    circuits.sort(key=lambda circuit: len(circuit), reverse=True)
    # print(circuits)

    product = 1
    for i in range(NUM_CIRCUITS_COUNTED):
        product *= len(circuits[i])

    print(product)
    return product

def find_box_circuit(box: int, circuits: list[list[int]]) -> int:
    matched_circuit = -1

    for i in range(len(circuits)):
        if box in circuits[i]:
            matched_circuit = i
            break

    return matched_circuit

def find_3d_distance(vector_a: list[int], vector_b: list[int]) -> float:
    if len(vector_a) != len(vector_b):
        return -1
    
    sq_dist = 0
    for i in range(len(vector_a)):
        sq_dist += (vector_b[i] - vector_a[i]) ** 2

    return sq_dist ** (1 / 2)

assert -1 == find_3d_distance([1, 2], [3, 4, 5]), "find_3d_distance not detecting invalid input"
assert 0 == find_3d_distance([1, 2, 3], [1, 2, 3]), "find_3d_distance not detecting zero distance"
assert (2 ** (3 / 2)) == find_3d_distance([0, 0], [2, 2]), "find_3d_distance not detecting non-zero distance (2D)"
assert (3 ** (3 / 2)) == find_3d_distance([1, 2, 3], [4, 5, 6]), "find_3d_distance not detecting non-zero distance (3D)"

if __name__ == "__main__":
    main()
import re
import math
import itertools

def main():
    # for parsing purposes, keep an index of where the town resides in the matrix
    town_index = {}
    # distances between each origin (row) and destination (col)
    dist_matrix = []
    
    # hold dirs so we don't have to resize the dist_matrix on every new town
    temp_dirs = []

    # parse input to the above structures
    with open('input.txt') as file:
        for line in file:
            # enforce that the line has loc_1, loc_2, and dist
            direction = re.fullmatch("^(?P<loc_1>[a-zA-Z]*?) to (?P<loc_2>[a-zA-Z]*?) = (?P<dist>[0-9]*?)$", line.rstrip())

            # find the index of the town, creating it if necessary
            if direction.group("loc_1") not in town_index:
                town_index[direction.group("loc_1")] = len(town_index)
            if direction.group("loc_2") not in town_index:
                town_index[direction.group("loc_2")] = len(town_index)

            # save the direction in a temp array for later processing
            temp_dirs.append([town_index[direction.group("loc_1")], town_index[direction.group("loc_2")], int(direction.group("dist"))])

    # create the empty dist array
    for i in range(len(town_index)):
        # init as -1 so we can check for impossible trips
        dist_matrix.append([-1] * len(town_index))
  
    # fill the dist array
    for dir in temp_dirs:
        # make link in both directions (a -> b and b -> a)
        dist_matrix[dir[0]][dir[1]] = dir[2]
        dist_matrix[dir[1]][dir[0]] = dir[2]
    
    # print("printing distance matrix")
    # print(dist_matrix)

    paths = find_all_paths(len(town_index))
    # print("printing paths between destinations")
    # print(paths)

    longest_dist = -math.inf
    for path in paths:
        dist = measure_path_distance(dist_matrix, path)
        if dist > longest_dist:
            longest_dist = dist

    print(f"the longest distance is {longest_dist}")
    return longest_dist

def find_all_paths(num_destinations: int) -> list[list[int]]:
    return itertools.permutations(range(num_destinations))

def measure_path_distance(dists: list[list[int]], path: list[int]) -> int:
    dist = 0

    for i in range(len(path) - 1):
        dist += dists[path[i]][path[i + 1]]

    return dist

if __name__ == "__main__":
    main()
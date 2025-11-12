import re

def main():
    # keep an ordered list of when towns were seen on the input
    town_lookup = []
    # distances between each origin (row) and destination (col)
    dist_matrix = []
    
    # hold dirs so we don't have to resize the dist_matrix on every new town
    temp_dirs = []

    # parse input to the above structures
    with open('input_short.txt') as file:
        for line in file:
            # enforce that the line has loc_1, loc_2, and dist
            direction = re.fullmatch("^(?P<loc_1>[a-zA-Z]*?) to (?P<loc_2>[a-zA-Z]*?) = (?P<dist>[0-9]*?)$", line.rstrip())

            # find the index of the town, creating it if necessary
            loc_1_index = find_town_index(town_lookup, direction.group("loc_1"))
            if loc_1_index == -1:
                town_lookup.append(direction.group("loc_1"))
                loc_1_index = len(town_lookup) - 1
            loc_2_index = find_town_index(town_lookup, direction.group("loc_2"))
            if loc_2_index == -1:
                town_lookup.append(direction.group("loc_2"))
                loc_2_index = len(town_lookup) - 1

            # save the direction in a temp array for later processing
            temp_dirs.append([loc_1_index, loc_2_index, int(direction.group("dist"))])

    # create the empty dist array
    for i in range(len(town_lookup)):
        # init as -1 so we can check for impossible trips
        dist_matrix.append([-1] * len(town_lookup))
  
    # fill the dist array
    for dir in temp_dirs:
        # make link in both directions (a -> b and b -> a)
        dist_matrix[dir[0]][dir[1]] = dir[2]
        dist_matrix[dir[1]][dir[0]] = dir[2]
    
    # TODO: permute through all of the ways to visit destinations
    print(dist_matrix)

    return 0

def find_town_index(lookup: list[int], town: str) -> int:
    t = -1
    try:
        t = lookup.index(town)
    except:
        print(f"town {town} was not found in lookup table")

    return t

if __name__ == "__main__":
    main()
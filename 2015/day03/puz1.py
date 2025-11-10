def main():
    dirs = {
        '^': [-1, 0],
        '>': [0, 1],
        'v': [1, 0],
        '<': [0, -1],
    }
    location = [0, 0]

    presents_at_house = {
        "0,0": 1
    }

    with open('input.txt') as file:
        for line in file:
            for char in line:
                if char not in dirs:
                    raise ValueError(f"invalid input! received character: {char} instead of a directional")
                
                location[0] += dirs[char][0]
                location[1] += dirs[char][1]

                location_key = get_location_key(location)
                if location_key not in presents_at_house:
                    presents_at_house[location_key] = 0
                
                presents_at_house[location_key] += 1
    
    print(f"there were {len(presents_at_house)} houses that received presents!")

def get_location_key(loc):
    if len(loc) != 2:
        raise ValueError(f"can only make a location key for a pair of coordinates! received {len(loc)}")
    return f"{loc[0]},{loc[1]}"

if __name__ == "__main__":
    main()
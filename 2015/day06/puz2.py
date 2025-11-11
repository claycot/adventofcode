from math import floor

GRID_WIDTH = 1000
GRID_HEIGHT = 1000

def main():
    instructions = []
    total_brightness = 0

    with open('input.txt') as file:
        for line in file:
            instructions.append(parse_instruction(line))

    for i in range(GRID_WIDTH * GRID_HEIGHT):
        coordinates = get_coordinate_from_bulb_number(i)
        brightness = 0
        for instruction in instructions:
            if instruction[1][0] > coordinates[0] or instruction[2][0] < coordinates[0] or instruction[1][1] > coordinates[1] or instruction[2][1] < coordinates[1]:
                continue
            
            if instruction[0] == 0 and brightness > 0:
                brightness -=1
            elif instruction[0] == 1:
                brightness += 1
            elif instruction[0] == 2:
                brightness += 2
        
        print(f"bulb number {i} at coordinates {coordinates} is at brightness {brightness}")
        total_brightness += brightness

    return total_brightness

def parse_instruction(instruction: str) -> list:
    # [action (0 = off; 1 = on; 2 = toggle), start_coordinates, end_coordinates]
    parsed_instruction = [-1, [-1, -1], [-1, -1]]
    
    instruction_words = instruction.split(' ')
    if instruction_words[0] == "turn":
        if instruction_words[1] == "off":
            parsed_instruction[0] = 0
        elif instruction_words[1] == "on":
            parsed_instruction[0] = 1
        parsed_instruction[1] = parse_coordinates(instruction_words[2])
        parsed_instruction[2] = parse_coordinates(instruction_words[4])
    elif instruction_words[0] == "toggle":
        parsed_instruction[0] = 2
        parsed_instruction[1] = parse_coordinates(instruction_words[1])
        parsed_instruction[2] = parse_coordinates(instruction_words[3])
    else:
        raise ValueError(f"received illegal instruction: {instruction_words[0]}")
    
    return parsed_instruction
        
def parse_coordinates(coordinate_group: str) -> list[int]:
    coordinates = coordinate_group.split(',')
    if len(coordinates) != 2:
        raise ValueError(f"received illegal coordinate pair: {coordinates}")
    return [int(coordinate) for coordinate in coordinates]

# counting from the top left of the grid, find the position of the bulb
def get_coordinate_from_bulb_number(bulb_number: int) -> list[int]:
    row_number = floor(bulb_number / GRID_WIDTH)
    col_number = bulb_number - (row_number * GRID_WIDTH)
    return [col_number, row_number]

if __name__ == "__main__":
    print(main())
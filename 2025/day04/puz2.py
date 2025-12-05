CHARACTER_FULL = '@'
CHARACTER_EMPTY = '.'

def main():
    accessible = 0

    grid = []
    with open("input.txt") as file:
        for line in file:
            next_grid = []
            for char in line.rstrip():
                if char == CHARACTER_EMPTY:
                    next_grid.append(0)
                elif char == CHARACTER_FULL:
                    next_grid.append(1)
            grid.append(next_grid)

    queue_to_remove = []
    iter = 0
    while True:
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if is_roll_reachable(grid, [r, c]):
                    accessible += 1
                    queue_to_remove.append([r, c])

        if len(queue_to_remove) == 0:
            break
        else:
            # print(f"on iteration #{iter}, removed {len(queue_to_remove)}")
            iter += 1        
            for [r, c] in queue_to_remove:
                grid[r][c] = 0
            queue_to_remove = []
        
    # print(grid)
    print(accessible)
    return 0

def is_roll_reachable(grid, cell) -> bool:
    DIRS = [
        [-1, -1],
        [-1, 0], 
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ]

    [row, col] = cell
    if not is_valid(grid, cell) or grid[row][col] == 0:
        return False
    
    count_neighbors = 0
    for dir in DIRS:
        [delta_row, delta_col] = dir
        next_row = row + delta_row
        next_col = col + delta_col

        if is_valid(grid, [next_row, next_col]) and grid[next_row][next_col] == 1:
            count_neighbors += 1

    return count_neighbors < 4

def is_valid(grid, cell) -> bool:
    [row, col] = cell
    return row >= 0 and row < len(grid) and col >= 0 and col < len(grid[0])

if __name__ == "__main__":
    main()
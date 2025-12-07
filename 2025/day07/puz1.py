CHAR_START = "S"
CHAR_SPLITTER = "^"

def main():
    grid_len = 0
    grid_width = 0

    active_beams = {}
    line_splitters = []
    times_split = 0

    with open("input.txt") as file:
        for line in file:
            # could be best to only set this once, but here we are!
            grid_width = len(line.rstrip())
            line_splitters = []

            for c in range(grid_width):
                # start a beam at the start position
                if line[c] == CHAR_START:
                    active_beams[c] = True
                # split any beams above a splitter
                elif line[c] == CHAR_SPLITTER:
                    # print(f"found a splitter at row {grid_len} col {c}")
                    # note the splitter
                    line_splitters.append(c)
                    # if the splitter had a beam above it, split it!
                    if c in active_beams and active_beams[c] == True:
                        times_split += 1
                        # print(f"split the beam! there are now {times_split} splits")
                        active_beams[c - 1] = True
                        active_beams[c + 1] = True

            # wipe out any beams that are blocked by a splitter
            for c in line_splitters:
                active_beams[c] = False
            
            # for beam, active in active_beams.items():
            #     if active == True:
            #         print(f"beam at {beam} is active!")

            # print(f"new row! \r\n")
            grid_len += 1

    print(times_split)
    return times_split

if __name__ == "__main__":
    main()
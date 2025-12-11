CHAR_LIGHT_ON = "#"
CHAR_LIGHT_OFF = "."

from itertools import combinations

def main():
    sum = 0

    with open("input.txt") as file:
        for line in file:
            elems = line.rstrip().split(" ")
            goal = parse_goal(elems[0])
            buttons = parse_buttons(elems[1:len(elems) - 1])
            joltages = parse_joltages(elems[len(elems) - 1])

            # print(goal)
            # print(buttons)
            # print(joltages)

            # find the end state of applying each combination of buttons
            num_elems = 0
            found = False
            while num_elems <= len(goal):
                # find all combinations of this number of buttons, checking each for validity
                for combo in list(combinations(buttons, num_elems)):
                    if check_validity(goal, combo):
                        # print(f"solved puzzle by pressing buttons {combo}")
                        found = True
                        break

                if found:
                    break
                else:
                    num_elems += 1
            
            if not found:
                raise ValueError(f"could not complete line {line}")
            else:
                # print(f"solved puzzle by pressing {num_elems} buttons")
                sum += num_elems

    print(sum)
    return sum

def check_validity(goal: list[bool], buttons_pressed: list[list[int]]) -> bool:
    # goal will be True if the number of times the button is flipped is odd
    end_state = [0] * len(goal)

    for button in buttons_pressed:
        for bit in button:
            end_state[bit] += 1

    valid = True
    for i in range(len(goal)):
        if goal[i] != (end_state[i] % 2 == 1):
            valid = False
            break

    # print(f"can {goal} be achieved with buttons {buttons_pressed}? end state was {end_state}: {valid}")
    return valid

def parse_goal(goal_str: str) -> list[bool]:
    lights: list[bool] = []

    for char in goal_str[1:len(goal_str) - 1]:
        if char == CHAR_LIGHT_ON:
            lights.append(True)
        elif char == CHAR_LIGHT_OFF:
            lights.append(False)
        else:
            raise ValueError(f"found illegal char in goal array: {char}")

    return lights

def parse_buttons(buttons_str_list: list[str]) -> list[list[int]]:
    buttons: list[list[int]] = []

    for button_str in buttons_str_list:
        button: list[int] = []
        for c in button_str[1:len(button) - 1].split(","):
            button.append(int(c))
        buttons.append(button)
    
    return buttons

def parse_joltages(joltage_str: str) -> list[int]:
    joltages: list[int] = []

    for c in joltage_str[1:len(joltage_str) - 1].split(","):
        joltages.append(int(c))
    
    return joltages

if __name__ == "__main__":
    main()
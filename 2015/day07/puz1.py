ALLOWED_OPERATORS = ["IS", "NOT", "AND", "OR", "LSHIFT", "RSHIFT"]

def main() -> int:
    DESIRED_WIRE = "a"

    wires: dict[str, tuple[str, list[str | int]]] = {}
    wires_solved: dict[str, int] = {}

    with open("input.txt") as file:
        for line in file:
            [output, op, inputs] = parse_line(line)

            wires[output] = (op, inputs)

    if DESIRED_WIRE not in wires:
        raise ValueError(f"tried to solve for wire that does not exist: {DESIRED_WIRE}")
    
    solution = solve_wire(DESIRED_WIRE, wires, wires_solved) 
    
    print(f"the solution for wire {DESIRED_WIRE} is {solution} jolts")
    return solution


def parse_line(line: str) -> tuple[str, str, list[str | int]]:
    split_line = line.rstrip().split(" ")

    # first elem is the output wire
    output_wire = split_line[-1]
    # second elem is the operator (placeholder IS)
    operator = "IS"

    # parse all inputs and operators (-2 to exclude the output and ->)
    inputs: list[str | int] = []
    for elem in split_line[0:-2]:
        if elem in ALLOWED_OPERATORS:
            operator = elem
        else:
            try:
                inputs.append(int(elem))
            except:
                inputs.append(elem)

    return (output_wire, operator, inputs)


def solve_wire(wire: str, wires: dict[str, tuple[str, list[str | int]]], solved: dict[str, int]) -> int:
    # if we solved the wire already, no problemo
    if wire in solved:
        return solved[wire]
    
    # otherwise, solve for all inputs (recursively! enjoy the call stack)
    [op, inputs] = wires[wire]
    for i in range(len(inputs)):
        if isinstance(inputs[i], str):
            inputs[i] = solve_wire(str(inputs[i]), wires, solved)

    solution = perform_operation(op, inputs)
    solved[wire] = solution

    return solution


def perform_operation(op: str, inputs: list[str | int]) -> int:
    if op not in ALLOWED_OPERATORS:
        raise ValueError(f"attempted to perform an illegal operation: {op}")
    
    if any(isinstance(elem, str) for elem in inputs):
        raise ValueError(f"attempted to perform an operation before all inputs were solved: {inputs}")

    safe_inputs = [int(elem) for elem in inputs]

    if op == "IS":
        return safe_inputs[0]
    elif op == "NOT":
        return ~safe_inputs[0]
    elif op == "AND":
        return safe_inputs[0] & safe_inputs[1]
    elif op == "OR":
        return safe_inputs[0] | safe_inputs[1]
    elif op == "LSHIFT":
        return safe_inputs[0] << safe_inputs[1]
    elif op == "RSHIFT":
        return safe_inputs[0] >> safe_inputs[1]
    
    return -1

if __name__ == "__main__":
    main()
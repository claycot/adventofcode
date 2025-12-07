def main():
    problems = []
    sum = 0

    with open("input.txt") as file:
        for line in file:
            vals = line.rstrip().split()

            for i in range(len(vals)):
                if i >= len(problems):
                    problems.append([])
                
                problems[i].append(vals[i])

        for problem in problems:
            sum += solve_problem(problem)

    print(sum)
    return sum

def solve_problem(problem: list[str]) -> int:
    ans = 0

    if (problem[-1] == "+"):
        ans = sum_values(problem[:len(problem) - 1])
    elif (problem[-1] == "*"):
        ans = product_values(problem[:len(problem) - 1])

    return ans

def sum_values(values: list[str]) -> int:
    sum = 0
    
    for val in values:
        sum += int(val)

    return sum

def product_values(values: list[str]) -> int:
    product = 1

    for val in values:
        product *= int(val)

    return product

if __name__ == "__main__":
    main()
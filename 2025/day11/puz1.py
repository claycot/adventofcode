from typing import Dict

def main():
    KEY_START = "you"
    KEY_END = "out"

    connections: Dict[str, list[str]] = {}

    with open("input.txt") as file:
        for line in file:
            try:
                [src, dests] = line.rstrip().split(": ")
            except:
                raise ValueError(f"received illegal input: `{line.rstrip()}`; input must be of form `source: dest_1 dest_2 dest_n`")
            
            connections[src] = []
            for dest in dests.split(" "):
                connections[src].append(dest)

    # print(connections)

    if KEY_START not in connections:
        raise ValueError(f"could not find starting key `{KEY_START}` in input")
    
    paths = 0
    active_traces: Dict[str, int] = dict.fromkeys(connections[KEY_START], 1)
    while len(active_traces):
        # print("loop starts")
        # print(active_traces)
        next_traces: Dict[str, int] = {}

        for trace in active_traces:
            if trace == KEY_END:
                # print(f"found an end for {active_traces[trace]} paths")
                paths += active_traces[trace]
                continue

            # print(f"tracing {active_traces[trace]} connections from {trace} to {connections[trace]}")
            for connection in connections[trace]:
                if connection not in next_traces:
                    next_traces[connection] = 0
                next_traces[connection] += active_traces[trace]

        active_traces = next_traces

    print(paths)
    return paths

if __name__ == "__main__":
    main()
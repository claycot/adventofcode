from typing import Dict
from typing import Tuple

def main():
    KEY_START = "svr"
    KEY_END = "out"
    KEYS_REQUIRED = ["dac", "fft"]

    connections: Dict[str, list[str]] = {}

    with open("input.txt") as file:
        for line in file:
            try:
                [src, dests] = line.rstrip().split(": ")
            except:
                raise ValueError(f"received illegal input `{line.rstrip()}`; input must be of form `source: dest_1 dest_2 dest_n`")
            
            connections[src] = []
            for dest in dests.split(" "):
                connections[src].append(dest)

    # print(connections)

    if KEY_START not in connections:
        raise ValueError(f"could not find starting key `{KEY_START}` in input")
    
    paths = 0
    # key: Tuple with current server name and number of required servers visited eg. ("abc", 1)
    # val: number of active traces eg. 100
    active_traces: Dict[Tuple[str, int], int] = {}
    for server in connections[KEY_START]:
        active_traces[(server, 0)] = 1

    while len(active_traces):
        # print("loop starts")
        # print(active_traces)
        next_traces: Dict[Tuple[str, int], int] = {}

        for trace in active_traces:
            # print(trace)
            [server, num_required_servers_hit] = trace

            if server == KEY_END:
                # print("found an end")
                if num_required_servers_hit == len(KEYS_REQUIRED):
                    # print(f"found an end for {active_traces[trace]} paths")
                    paths += active_traces[trace]
                continue

            # print(f"tracing {active_traces[trace]} connections from {trace} to {connections[trace]}")
            for connection in connections[server]:
                # if the next connection is a required one, count it
                next_num_required_servers_hit = num_required_servers_hit if connection not in KEYS_REQUIRED else num_required_servers_hit + 1
                
                if (connection, next_num_required_servers_hit) not in next_traces:
                    next_traces[(connection, next_num_required_servers_hit)] = 0
                
                # print(f"next key is {(connection, next_num_required_servers_hit)}")
                next_traces[(connection, next_num_required_servers_hit)] += active_traces[trace]

        # print("loop is complete")
        # print(next_traces)
        active_traces = next_traces

    print(paths)
    return paths

if __name__ == "__main__":
    main()
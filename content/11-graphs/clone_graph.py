class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node: Node) -> Node:
    oldToNew = {}

    def dfs(n):
        if not n:
            return None
        if n in oldToNew:
            return oldToNew[n]
        copy = Node(n.val)
        oldToNew[n] = copy
        for nei in n.neighbors:
            copy.neighbors.append(dfs(nei))
        return copy

    return dfs(node)

if __name__ == "__main__":
    n1 = Node(1)
    n2 = Node(2)
    n1.neighbors.append(n2)
    n2.neighbors.append(n1)
    cloned = cloneGraph(n1)
    assert cloned.val == 1 and cloned.neighbors[0].val == 2, "Test 1 Failed"
    print("All tests passed!")

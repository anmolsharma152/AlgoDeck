from collections import deque

def orangesRotting(grid) -> int:
    ROWS, COLS = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    time = 0

    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == 1:
                fresh += 1
            elif grid[r][c] == 2:
                q.append((r, c))

    directions = [[0,1],[0,-1],[1,0],[-1,0]]
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in directions:
                row, col = r + dr, c + dc
                if 0 <= row < ROWS and 0 <= col < COLS and grid[row][col] == 1:
                    grid[row][col] = 2
                    q.append((row, col))
                    fresh -= 1
        time += 1

    return time if fresh == 0 else -1

if __name__ == "__main__":
    g1 = [[2,1,1],[1,1,0],[0,1,1]]
    assert orangesRotting(g1) == 4, "Test 1 Failed"
    print("All tests passed!")

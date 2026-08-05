"""
Problem: Minimum Jumps to Reach End
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/minimum-number-of-jumps/0
"""

def min_jumps(arr: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    n = len(arr)
    if n <= 1:
        return 0
    if arr[0] == 0:
        return -1
        
    max_reach = arr[0]
    steps = arr[0]
    jumps = 1
    
    for i in range(1, n - 1):
        max_reach = max(max_reach, i + arr[i])
        steps -= 1
        
        if steps == 0:
            jumps += 1
            if i >= max_reach:
                return -1
            steps = max_reach - i
            
    return jumps

if __name__ == "__main__":
    assert min_jumps([1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]) == 3
    assert min_jumps([1, 1, 1, 1, 1]) == 4
    assert min_jumps([0, 1, 2]) == -1
    print("Python: min_jumps passed tests!")

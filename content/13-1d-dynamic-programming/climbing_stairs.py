"""
Problem: Climbing Stairs
LeetCode: #70 (Easy) | NeetCode 150 | Blind 75
"""

def climb_stairs(n: int) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    if n <= 2:
        return n
    
    one, two = 1, 2
    for _ in range(3, n + 1):
        one, two = two, one + two
        
    return two

if __name__ == "__main__":
    assert climb_stairs(2) == 2
    assert climb_stairs(3) == 3
    assert climb_stairs(5) == 8
    print("Python: climb_stairs passed tests!")

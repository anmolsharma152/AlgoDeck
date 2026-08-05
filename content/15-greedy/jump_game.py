"""
Problem: Jump Game
LeetCode: #55 (Medium) | NeetCode 150 | Blind 75
"""

def can_jump(nums: list[int]) -> bool:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    goal = len(nums) - 1
    
    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= goal:
            goal = i
            
    return goal == 0

if __name__ == "__main__":
    assert can_jump([2, 3, 1, 1, 4]) == True
    assert can_jump([3, 2, 1, 0, 4]) == False
    print("Python: can_jump passed tests!")

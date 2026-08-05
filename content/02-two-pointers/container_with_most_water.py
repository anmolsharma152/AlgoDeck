"""
Problem: Container With Most Water
LeetCode: #11 (Medium) | NeetCode 150 | Blind 75
"""

def max_area(height: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    left, right = 0, len(height) - 1
    max_w = 0
    
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        max_w = max(max_w, w * h)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
            
    return max_w

if __name__ == "__main__":
    assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
    assert max_area([1, 1]) == 1
    print("Python: max_area passed tests!")

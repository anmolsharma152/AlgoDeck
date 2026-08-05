"""
Problem: Maximum and Minimum in an Array
GeeksforGeeks: https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/
"""

def get_min_max(arr: list[int]) -> tuple[int, int]:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    if not arr:
        return -1, -1
    
    minimum = arr[0]
    maximum = arr[0]
    
    for num in arr[1:]:
        if num < minimum:
            minimum = num
        elif num > maximum:
            maximum = num
            
    return minimum, maximum

if __name__ == "__main__":
    assert get_min_max([3, 5, 4, 1, 9]) == (1, 9)
    assert get_min_max([22, 14, 8, 17, 35, 3]) == (3, 35)
    print("Python: max_min_array passed tests!")

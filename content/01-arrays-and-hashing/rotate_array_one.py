"""
Problem: Cyclically Rotate Array by One
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one/0
"""

def rotate_by_one(arr: list[int]) -> list[int]:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    if not arr:
        return arr
    
    last = arr[-1]
    for i in range(len(arr) - 1, 0, -1):
        arr[i] = arr[i - 1]
    arr[0] = last
    return arr

if __name__ == "__main__":
    assert rotate_by_one([1, 2, 3, 4, 5]) == [5, 1, 2, 3, 4]
    assert rotate_by_one([9, 8, 7, 6]) == [6, 9, 8, 7]
    print("Python: rotate_array_one passed tests!")

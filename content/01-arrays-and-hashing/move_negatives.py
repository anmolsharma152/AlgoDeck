"""
Problem: Move Negative Numbers to Beginning
GeeksforGeeks: https://www.geeksforgeeks.org/move-negative-numbers-beginning-positive-end-constant-extra-space/
"""

def move_negatives(arr: list[int]) -> list[int]:
    """
    Moves all negative elements to the beginning of the array in-place.
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    left = 0
    for right in range(len(arr)):
        if arr[right] < 0:
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
    return arr

if __name__ == "__main__":
    arr1 = [-12, 11, -13, -5, 6, -7, 5, -3, -6]
    move_negatives(arr1)
    # Check that all elements up to index 5 are negative
    assert all(x < 0 for x in arr1[:6])
    assert all(x >= 0 for x in arr1[6:])
    print("Python: move_negatives passed tests!")

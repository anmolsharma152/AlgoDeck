"""
Problem: Reverse an Array
Platform: GeeksforGeeks / Standard Fundamental Benchmark
Pattern: Two Pointers (Opposite Direction)

Given an array (or list), reverse the elements in-place using two pointers.

Time Complexity: O(N)
Space Complexity: O(1)
"""

def reverse_array(arr: list) -> list:
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr

if __name__ == "__main__":
    test_1 = [1, 2, 3, 4, 5]
    assert reverse_array(test_1) == [5, 4, 3, 2, 1]

    test_2 = [10, 20]
    assert reverse_array(test_2) == [20, 10]

    test_3 = [7]
    assert reverse_array(test_3) == [7]

    print("All Python tests passed for Reverse Array!")

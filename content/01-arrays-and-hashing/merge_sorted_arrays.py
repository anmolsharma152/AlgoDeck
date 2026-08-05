"""
Problem: Merge Two Sorted Arrays Without Extra Space
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays5135/1
"""
import math

def merge_arrays(arr1: list[int], arr2: list[int]) -> None:
    """
    Time Complexity: O((N + M) log(N + M))
    Space Complexity: O(1)
    Modifies arr1 and arr2 in-place.
    """
    n, m = len(arr1), len(arr2)
    gap = math.ceil((n + m) / 2)
    
    while gap > 0:
        i = 0
        j = gap
        
        while j < n + m:
            # Case 1: Both pointers in arr1
            if j < n:
                if arr1[i] > arr1[j]:
                    arr1[i], arr1[j] = arr1[j], arr1[i]
            # Case 2: Pointers split between arr1 and arr2
            elif i < n and j >= n:
                if arr1[i] > arr2[j - n]:
                    arr1[i], arr2[j - n] = arr2[j - n], arr1[i]
            # Case 3: Both pointers in arr2
            else:
                if arr2[i - n] > arr2[j - n]:
                    arr2[i - n], arr2[j - n] = arr2[j - n], arr2[i - n]
            i += 1
            j += 1
            
        if gap == 1:
            break
        gap = math.ceil(gap / 2)

if __name__ == "__main__":
    a1 = [1, 3, 5, 7]
    a2 = [0, 2, 6, 8, 9]
    merge_arrays(a1, a2)
    assert a1 == [0, 1, 2, 3]
    assert a2 == [5, 6, 7, 8, 9]
    print("Python: merge_arrays passed tests!")

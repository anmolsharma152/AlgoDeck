"""
Problem: Union and Intersection of Sorted Arrays
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/union-of-two-arrays/0
"""

def get_union_and_intersection(arr1: list[int], arr2: list[int]) -> tuple[list[int], list[int]]:
    """
    Finds the union and intersection of two sorted arrays.
    Time Complexity: O(N + M)
    Space Complexity: O(N + M) for outputs
    """
    i, j = 0, 0
    union = []
    intersection = []
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            if not union or union[-1] != arr1[i]:
                union.append(arr1[i])
            i += 1
        elif arr1[i] > arr2[j]:
            if not union or union[-1] != arr2[j]:
                union.append(arr2[j])
            j += 1
        else:
            if not union or union[-1] != arr1[i]:
                union.append(arr1[i])
            if not intersection or intersection[-1] != arr1[i]:
                intersection.append(arr1[i])
            i += 1
            j += 1
            
    while i < len(arr1):
        if not union or union[-1] != arr1[i]:
            union.append(arr1[i])
        i += 1
        
    while j < len(arr2):
        if not union or union[-1] != arr2[j]:
            union.append(arr2[j])
        j += 1
        
    return union, intersection

if __name__ == "__main__":
    u, inter = get_union_and_intersection([1, 3, 4, 5, 7], [2, 3, 5, 6])
    assert u == [1, 2, 3, 4, 5, 6, 7]
    assert inter == [3, 5]
    print("Python: union_intersection passed tests!")

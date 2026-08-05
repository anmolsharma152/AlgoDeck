"""
Problem: Common Elements in 3 Sorted Arrays
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/common-elements1132/1
"""

def common_elements(a: list[int], b: list[int], c: list[int]) -> list[int]:
    """
    Time Complexity: O(N_1 + N_2 + N_3)
    Space Complexity: O(1) auxiliary
    """
    i, j, k = 0, 0, 0
    res = []
    
    while i < len(a) and j < len(b) and k < len(c):
        if a[i] == b[j] == c[k]:
            if not res or res[-1] != a[i]:
                res.append(a[i])
            i += 1
            j += 1
            k += 1
        elif a[i] < b[j]:
            i += 1
        elif b[j] < c[k]:
            j += 1
        else:
            k += 1
            
    return res

if __name__ == "__main__":
    a = [1, 5, 10, 20, 40, 80]
    b = [6, 7, 20, 80, 100]
    c = [3, 4, 15, 20, 30, 70, 80, 120]
    assert common_elements(a, b, c) == [20, 80]
    print("Python: common_elements passed tests!")

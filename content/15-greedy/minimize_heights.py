"""
Problem: Minimize Maximum Difference of Heights
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/minimize-the-heights3351/1
"""

def get_min_diff(arr: list[int], k: int) -> int:
    """
    Time Complexity: O(N log N)
    Space Complexity: O(1)
    """
    n = len(arr)
    if n == 1:
        return 0
        
    arr.sort()
    
    # Initialize initial difference without change
    ans = arr[-1] - arr[0]
    
    # After sorting, arr[0] + k is candidate for smallest, arr[-1] - k is candidate for largest
    # We check each transition boundary i
    for i in range(n - 1):
        # We must keep heights non-negative
        if arr[i + 1] - k < 0:
            continue
            
        temp_min = min(arr[0] + k, arr[i + 1] - k)
        temp_max = max(arr[-1] - k, arr[i] + k)
        
        ans = min(ans, temp_max - temp_min)
        
    return ans

if __name__ == "__main__":
    assert get_min_diff([1, 5, 8, 10], 2) == 5  # Modify to: 3, 3, 6, 8 -> diff = 5
    assert get_min_diff([3, 9, 12, 16, 20], 3) == 11
    print("Python: get_min_diff passed tests!")

"""
Problem: Count Inversions in Array
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/inversion-of-array/0
"""

def count_inversions(arr: list[int]) -> int:
    """
    Time Complexity: O(N log N)
    Space Complexity: O(N)
    """
    def merge_and_count(temp_arr, left, mid, right):
        i = left     # starting index for left subarray
        j = mid + 1  # starting index for right subarray
        k = left     # starting index to be sorted in temp_arr
        inv_count = 0
        
        while i <= mid and j <= right:
            if arr[i] <= arr[j]:
                temp_arr[k] = arr[i]
                i += 1
            else:
                # There are mid - i inversions because all remaining elements
                # in the left subarray (arr[i] to arr[mid]) will be greater than arr[j]
                temp_arr[k] = arr[j]
                inv_count += (mid - i + 1)
                j += 1
            k += 1
            
        while i <= mid:
            temp_arr[k] = arr[i]
            i += 1
            k += 1
            
        while j <= right:
            temp_arr[k] = arr[j]
            j += 1
            k += 1
            
        for loop_var in range(left, right + 1):
            arr[loop_var] = temp_arr[loop_var]
            
        return inv_count

    def _merge_sort(temp_arr, left, right):
        inv_count = 0
        if left < right:
            mid = (left + right) // 2
            inv_count += _merge_sort(temp_arr, left, mid)
            inv_count += _merge_sort(temp_arr, mid + 1, right)
            inv_count += merge_and_count(temp_arr, left, mid, right)
        return inv_count

    temp = [0] * len(arr)
    return _merge_sort(temp, 0, len(arr) - 1)

if __name__ == "__main__":
    assert count_inversions([2, 4, 1, 3, 5]) == 3 # Inversions: (2,1), (4,1), (4,3)
    assert count_inversions([2, 3, 4, 5, 6]) == 0
    assert count_inversions([10, 10, 10]) == 0
    print("Python: count_inversions passed tests!")

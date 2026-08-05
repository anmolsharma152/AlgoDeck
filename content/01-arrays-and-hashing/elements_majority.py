"""
Problem: Elements Appearing More than N/K times
GeeksforGeeks: https://www.geeksforgeeks.org/given-an-array-of-of-size-n-finds-all-the-elements-that-appear-more-than-nk-times/
"""

def get_majority_elements(arr: list[int], k: int) -> list[int]:
    """
    Finds elements that appear more than N/K times in the array.
    Time Complexity: O(N)
    Space Complexity: O(K)
    """
    n = len(arr)
    if k <= 1:
        return list(set(arr))
        
    # Step 1: Find candidates (at most k-1 candidates)
    candidates = {}
    for num in arr:
        if num in candidates:
            candidates[num] += 1
        elif len(candidates) < k - 1:
            candidates[num] = 1
        else:
            # Decrease count of all candidates
            to_remove = []
            for candidate in candidates:
                candidates[candidate] -= 1
                if candidates[candidate] == 0:
                    to_remove.append(candidate)
            for cand in to_remove:
                del candidates[cand]
                
    # Step 2: Validate candidates
    res = []
    threshold = n // k
    for candidate in candidates:
        count = arr.count(candidate)
        if count > threshold:
            res.append(candidate)
            
    return sorted(res)

if __name__ == "__main__":
    assert get_majority_elements([3, 1, 2, 2, 1, 2, 3, 3], 4) == [2, 3]
    assert get_majority_elements([9, 8, 7, 9, 2, 9, 7], 3) == [9]
    print("Python: get_majority_elements passed tests!")

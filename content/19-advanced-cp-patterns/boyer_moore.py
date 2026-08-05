"""
Problem: Boyer Moore Algorithm
GeeksforGeeks: https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/
"""

def boyer_moore(pat: str, txt: str) -> list[int]:
    """
    Boyer-Moore pattern searching using Bad Character Heuristic.
    Time Complexity: O(N / M) best, O(N * M) worst
    Space Complexity: O(Σ) where Σ is alphabet size (max 256 keys)
    """
    m = len(pat)
    n = len(txt)
    res = []
    
    if m == 0 or n == 0 or m > n:
        return []

    # Preprocess Bad Character Heuristic
    bad_char = {}
    for i in range(m):
        bad_char[pat[i]] = i
        
    s = 0 # s is shift of the pattern with respect to text
    while s <= n - m:
        j = m - 1
        
        # Keep reducing index j of pattern while characters of pattern
        # and text are matching at this shift s
        while j >= 0 and pat[j] == txt[s + j]:
            j -= 1
            
        # If the pattern is present at current shift, then index j
        # will become -1
        if j < 0:
            res.append(s)
            
            # Shift the pattern so that the next character in text
            # aligns with the last occurrence of it in pattern.
            # The condition s+m < n is necessary for txt boundary.
            if s + m < n:
                s += m - bad_char.get(txt[s + m], -1)
            else:
                s += 1
        else:
            # Shift the pattern so that the bad character in text
            # aligns with the last occurrence of it in pattern.
            # The max function is used to make sure that we get a positive shift.
            s += max(1, j - bad_char.get(txt[s + j], -1))
            
    return res

if __name__ == "__main__":
    assert boyer_moore("ABABCABAB", "ABABDABABCABAB") == [5]
    assert boyer_moore("TEST", "THIS IS A TEST TEXT") == [10]
    assert boyer_moore("A", "AAAAA") == [0, 1, 2, 3, 4]
    print("Python: boyer_moore passed tests!")

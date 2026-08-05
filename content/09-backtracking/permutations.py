"""
Problem: Print all Permutations of String
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/permutations-of-a-given-string/0
"""

def find_permutations(s: str) -> list[str]:
    """
    Time Complexity: O(N * N!)
    Space Complexity: O(N * N!) for outputs and O(N) recursion stack
    """
    res = set()
    chars = list(s)
    
    def backtrack(l):
        if l == len(chars):
            res.add("".join(chars))
            return
            
        for i in range(l, len(chars)):
            chars[l], chars[i] = chars[i], chars[l]
            backtrack(l + 1)
            chars[l], chars[i] = chars[i], chars[l] # backtrack
            
    backtrack(0)
    return sorted(list(res))

if __name__ == "__main__":
    assert find_permutations("ABC") == ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]
    assert find_permutations("AB") == ["AB", "BA"]
    assert find_permutations("ABA") == ["AAB", "ABA", "BAA"]
    print("Python: find_permutations passed tests!")

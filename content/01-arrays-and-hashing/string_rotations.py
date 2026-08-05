"""
Problem: Check if Strings are Rotations of Each Other
GeeksforGeeks: https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/
"""

def are_rotations(s1: str, s2: str) -> bool:
    """
    Time Complexity: O(N) where N is string length
    Space Complexity: O(N)
    """
    if len(s1) != len(s2):
        return False
    return s2 in (s1 + s1)

if __name__ == "__main__":
    assert are_rotations("ABCD", "CDAB") == True
    assert are_rotations("ABCD", "ACBD") == False
    assert are_rotations("geeks", "eksge") == True
    print("Python: are_rotations passed tests!")

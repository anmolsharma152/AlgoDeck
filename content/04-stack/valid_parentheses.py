"""
Problem: Valid Parentheses
LeetCode: #20 (Easy) | NeetCode 150 | Blind 75

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

Time Complexity: O(N)
Space Complexity: O(N)
"""

def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack

if __name__ == "__main__":
    assert is_valid("()") == True
    assert is_valid("()[]{}") == True
    assert is_valid("(]") == False
    print("All Python tests passed for Valid Parentheses!")

/**
 * Problem: Valid Parentheses
 * LeetCode: #20 (Easy) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */

function isValid(s) {
    const stack = [];
    const mapping = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (char in mapping) {
            const topElement = stack.length > 0 ? stack.pop() : '#';
            if (mapping[char] !== topElement) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}

if (require.main === module) {
    console.assert(isValid("()") === true, "Test 1 Failed");
    console.assert(isValid("()[]{}") === true, "Test 2 Failed");
    console.assert(isValid("(]") === false, "Test 3 Failed");
    console.log("All JavaScript tests passed for Valid Parentheses!");
}

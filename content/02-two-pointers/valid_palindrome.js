/**
 * Problem: Valid Palindrome
 * LeetCode: #125 (Easy) | NeetCode 150 | Blind 75
 */

function isPalindrome(s) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let left = 0, right = s.length - 1;
    const isAlphanumeric = (char) => {
        const code = char.charCodeAt(0);
        return (code >= 48 && code <= 57) || // numeric (0-9)
               (code >= 65 && code <= 90) || // upper alpha (A-Z)
               (code >= 97 && code <= 122);  // lower alpha (a-z)
    };

    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(isPalindrome("A man, a plan, a canal: Panama"), true);
    assert.strictEqual(isPalindrome("race a car"), false);
    assert.strictEqual(isPalindrome(" "), true);
    console.log("JS: isPalindrome passed tests!");
}

/**
 * Problem: Longest Palindromic Substring
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-palindrome-in-a-string/0
 */

function longestPalindrome(s) {
    /**
     * Time Complexity: O(N^2)
     * Space Complexity: O(1)
     */
    if (!s) return "";
    
    let start = 0, end = 0;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }
    
    for (let i = 0; i < s.length; i++) {
        const len1 = expandAroundCenter(i, i);
        const len2 = expandAroundCenter(i, i + 1);
        const maxLen = Math.max(len1, len2);
        
        if (maxLen > end - start) {
            start = i - Math.floor((maxLen - 1) / 2);
            end = i + Math.floor(maxLen / 2);
        }
    }
    
    return s.substring(start, end + 1);
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(longestPalindrome("aaaabbaa"), "aabbaa");
    assert.ok(["a", "b", "c"].includes(longestPalindrome("abc")));
    console.log("JS: longestPalindrome passed tests!");
}

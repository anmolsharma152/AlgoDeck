/**
 * Problem: Valid Anagram
 * LeetCode: #242 (Easy) | NeetCode 150 | Blind 75
 */

function isAnagram(s, t) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1) -> Only lowercase English letters (max 26 keys)
     */
    if (s.length !== t.length) {
        return false;
    }
    
    const count = {};
    for (let i = 0; i < s.length; i++) {
        count[s[i]] = (count[s[i]] || 0) + 1;
    }
    
    for (let i = 0; i < t.length; i++) {
        if (!count[t[i]]) {
            return false;
        }
        count[t[i]]--;
    }
    
    return true;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(isAnagram("anagram", "nagaram"), true);
    assert.strictEqual(isAnagram("rat", "car"), false);
    console.log("JS: isAnagram passed tests!");
}

/**
 * Problem: Contains Duplicate
 * LeetCode: #217 (Easy) | NeetCode 150 | Blind 75
 */

function containsDuplicate(nums) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(containsDuplicate([1, 2, 3, 1]), true);
    assert.strictEqual(containsDuplicate([1, 2, 3, 4]), false);
    assert.strictEqual(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
    console.log("JS: containsDuplicate passed tests!");
}

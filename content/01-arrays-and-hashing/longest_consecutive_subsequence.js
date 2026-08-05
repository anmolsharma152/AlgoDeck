/**
 * Problem: Longest Consecutive Subsequence
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-consecutive-subsequence/0
 */

function longestConsecutive(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    const numSet = new Set(arr);
    let longestStreak = 0;
    
    for (const num of numSet) {
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;
            
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }
            
            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }
    
    return longestStreak;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(longestConsecutive([2, 6, 1, 9, 4, 5, 3]), 6);
    assert.strictEqual(longestConsecutive([1, 9, 3, 10, 4, 20, 2]), 4);
    assert.strictEqual(longestConsecutive([]), 0);
    console.log("JS: longestConsecutive passed tests!");
}

/**
 * Problem: Container With Most Water
 * LeetCode: #11 (Medium) | NeetCode 150 | Blind 75
 */

function maxArea(height) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let left = 0, right = height.length - 1;
    let maxW = 0;
    
    while (left < right) {
        const w = right - left;
        const h = Math.min(height[left], height[right]);
        maxW = Math.max(maxW, w * h);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxW;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    assert.strictEqual(maxArea([1, 1]), 1);
    console.log("JS: maxArea passed tests!");
}

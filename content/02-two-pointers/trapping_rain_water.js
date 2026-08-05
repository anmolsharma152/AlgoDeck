/**
 * Problem: Trapping Rain Water
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/trapping-rain-water/0
 */

function trap(height) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (!height || height.length === 0) return 0;
    
    let left = 0, right = height.length - 1;
    let leftMax = height[left], rightMax = height[right];
    let water = 0;
    
    while (left < right) {
        if (leftMax < rightMax) {
            left++;
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
        } else {
            right--;
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
        }
    }
    
    return water;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
    assert.strictEqual(trap([4, 2, 0, 3, 2, 5]), 9);
    console.log("JS: trap passed tests!");
}

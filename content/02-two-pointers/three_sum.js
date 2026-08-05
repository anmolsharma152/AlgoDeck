/**
 * Problem: 3Sum
 * LeetCode: #15 (Medium) | NeetCode 150 | Blind 75
 */

function threeSum(nums) {
    /**
     * Time Complexity: O(N^2)
     * Space Complexity: O(1) or O(N) depending on sorting
     */
    nums.sort((a, b) => a - b);
    const res = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }
        
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                res.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
    assert.deepStrictEqual(threeSum([0, 1, 1]), []);
    assert.deepStrictEqual(threeSum([0, 0, 0]), [[0, 0, 0]]);
    console.log("JS: threeSum passed tests!");
}

/**
 * Problem: Maximum Product Subarray
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/maximum-product-subarray3604/1
 */

function maxProduct(nums) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (!nums || nums.length === 0) return 0;
    
    let res = Math.max(...nums);
    let currMin = 1, currMax = 1;
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (num === 0) {
            currMin = 1;
            currMax = 1;
            continue;
        }
        
        const temp = currMax * num;
        currMax = Math.max(num * currMax, num * currMin, num);
        currMin = Math.min(temp, num * currMin, num);
        res = Math.max(res, currMax);
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(maxProduct([6, -3, -10, 0, 2]), 180);
    assert.strictEqual(maxProduct([-1, -3, -10, 60]), 1800);
    assert.strictEqual(maxProduct([-2, 0, -1]), 0);
    console.log("JS: maxProduct passed tests!");
}

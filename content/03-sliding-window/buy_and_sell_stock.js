/**
 * Problem: Best Time to Buy and Sell Stock
 * LeetCode: #121 (Easy) | NeetCode 150 | Blind 75
 */

function maxProfit(prices) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let minPrice = Infinity;
    let maxProf = 0;
    
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProf) {
            maxProf = prices[i] - minPrice;
        }
    }
    
    return maxProf;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(maxProfit([7, 1, 5, 3, 6, 4]), 5);
    assert.strictEqual(maxProfit([7, 6, 4, 3, 1]), 0);
    console.log("JS: maxProfit passed tests!");
}

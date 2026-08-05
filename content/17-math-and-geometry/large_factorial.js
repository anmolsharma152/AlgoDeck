/**
 * Problem: Factorials of Large Numbers
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/factorials-of-large-numbers/0
 */

function multiply(x, res) {
    let carry = 0;
    for (let i = 0; i < res.length; i++) {
        const prod = res[i] * x + carry;
        res[i] = prod % 10;
        carry = Math.floor(prod / 10);
    }
    
    while (carry > 0) {
        res.push(carry % 10);
        carry = Math.floor(carry / 10);
    }
}

function factorial(n) {
    /**
     * Time Complexity: O(N^2)
     * Space Complexity: O(N)
     */
    const res = [1];
    for (let x = 2; x <= n; x++) {
        multiply(x, res);
    }
    return res.reverse();
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(factorial(5).join(''), "120");
    assert.strictEqual(factorial(10).join(''), "3628800");
    console.log("JS: factorial passed tests!");
}

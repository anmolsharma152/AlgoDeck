/**
 * Problem: Edit Distance
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/edit-distance3702/1
 */

function editDistance(s1, s2) {
    /**
     * Time Complexity: O(M * N)
     * Space Complexity: O(M * N)
     */
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],    // Remove
                    dp[i][j - 1],    // Insert
                    dp[i - 1][j - 1] // Replace
                );
            }
        }
    }
    
    return dp[m][n];
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(editDistance("geek", "gesek"), 1);
    assert.strictEqual(editDistance("gfg", "gfg"), 0);
    assert.strictEqual(editDistance("cat", "cut"), 1);
    console.log("JS: editDistance passed tests!");
}

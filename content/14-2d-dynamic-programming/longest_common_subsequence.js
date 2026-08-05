/**
 * Problem: Longest Common Subsequence
 * LeetCode: #1143 (Medium) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(M * N)
 * Space Complexity: O(M * N)
 */

function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (text1[i] === text2[j]) {
                dp[i][j] = 1 + dp[i + 1][j + 1];
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
    }
    return dp[0][0];
}

if (require.main === module) {
    console.assert(longestCommonSubsequence("abcde", "ace") === 3, "Test 1 Failed");
    console.assert(longestCommonSubsequence("abc", "abc") === 3, "Test 2 Failed");
    console.assert(longestCommonSubsequence("abc", "def") === 0, "Test 3 Failed");
    console.log("All JavaScript tests passed for Longest Common Subsequence!");
}

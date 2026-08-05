/**
 * Problem: Number of 1 Bits (Hamming Weight)
 * LeetCode: #191 (Easy) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(k)
 * Space Complexity: O(1)
 */

function hammingWeight(n) {
    let count = 0;
    while (n !== 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}

if (require.main === module) {
    console.assert(hammingWeight(11) === 3, "Test 1 Failed");
    console.assert(hammingWeight(128) === 1, "Test 2 Failed");
    console.log("All JavaScript tests passed for Number of 1 Bits!");
}

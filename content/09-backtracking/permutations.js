/**
 * Problem: Print all Permutations of String
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/permutations-of-a-given-string/0
 */

function findPermutations(s) {
    /**
     * Time Complexity: O(N * N!)
     * Space Complexity: O(N * N!)
     */
    const res = new Set();
    const chars = s.split('');
    
    function backtrack(l) {
        if (l === chars.length) {
            res.add(chars.join(''));
            return;
        }
        for (let i = l; i < chars.length; i++) {
            // Swap
            [chars[l], chars[i]] = [chars[i], chars[l]];
            backtrack(l + 1);
            // Backtrack swap
            [chars[l], chars[i]] = [chars[i], chars[l]];
        }
    }
    
    backtrack(0);
    return Array.from(res).sort();
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(findPermutations("ABC"), ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]);
    assert.deepStrictEqual(findPermutations("AB"), ["AB", "BA"]);
    assert.deepStrictEqual(findPermutations("ABA"), ["AAB", "ABA", "BAA"]);
    console.log("JS: findPermutations passed tests!");
}

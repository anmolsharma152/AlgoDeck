/**
 * Problem: KMP Pattern Searching
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1
 */

function kmpSearch(pat, txt) {
    /**
     * KMP search algorithm.
     * Time Complexity: O(N + M)
     * Space Complexity: O(M)
     */
    const m = pat.length;
    const n = txt.length;
    const res = [];
    
    if (m === 0 || n === 0 || m > n) return [];
    
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;
    
    while (i < m) {
        if (pat[i] === pat[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    i = 0;
    let j = 0;
    while (i < n) {
        if (pat[j] === txt[i]) {
            i++;
            j++;
        }
        
        if (j === m) {
            res.push(i - j);
            j = lps[j - 1];
        } else if (i < n && pat[j] !== txt[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(kmpSearch("ABABCABAB", "ABABDABABCABAB"), [5]);
    assert.deepStrictEqual(kmpSearch("TEST", "THIS IS A TEST TEXT"), [10]);
    assert.deepStrictEqual(kmpSearch("A", "AAAAA"), [0, 1, 2, 3, 4]);
    console.log("JS: kmpSearch passed tests!");
}

/**
 * Problem: Boyer Moore Algorithm
 * GeeksforGeeks: https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/
 */

function boyerMoore(pat, txt) {
    /**
     * Boyer-Moore pattern searching using Bad Character Heuristic.
     * Time Complexity: O(N / M) best, O(N * M) worst
     * Space Complexity: O(Σ)
     */
    const m = pat.length;
    const n = txt.length;
    const res = [];
    
    if (m === 0 || n === 0 || m > n) return [];
    
    const badChar = {};
    for (let i = 0; i < m; i++) {
        badChar[pat[i]] = i;
    }
    
    let s = 0;
    while (s <= n - m) {
        let j = m - 1;
        
        while (j >= 0 && pat[j] === txt[s + j]) {
            j--;
        }
        
        if (j < 0) {
            res.push(s);
            if (s + m < n) {
                s += m - (badChar[txt[s + m]] !== undefined ? badChar[txt[s + m]] : -1);
            } else {
                s += 1;
            }
        } else {
            const lastIdx = badChar[txt[s + j]] !== undefined ? badChar[txt[s + j]] : -1;
            s += Math.max(1, j - lastIdx);
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(boyerMoore("ABABCABAB", "ABABDABABCABAB"), [5]);
    assert.deepStrictEqual(boyerMoore("TEST", "THIS IS A TEST TEXT"), [10]);
    assert.deepStrictEqual(boyerMoore("A", "AAAAA"), [0, 1, 2, 3, 4]);
    console.log("JS: boyerMoore passed tests!");
}

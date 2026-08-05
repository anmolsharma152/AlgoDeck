/**
 * Problem: Rabin-Karp Pattern Searching
 * GeeksforGeeks: https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/
 */

function rabinKarp(pat, txt) {
    /**
     * Rabin-Karp string matching.
     * Time Complexity: O(N + M) average, O(N * M) worst
     * Space Complexity: O(1)
     */
    const d = 256;
    const q = 101;
    const m = pat.length;
    const n = txt.length;
    let p = 0;
    let t = 0;
    let h = 1;
    const res = [];
    
    if (m > n) return [];
    
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    for (let i = 0; i < m; i++) {
        p = (d * p + pat.charCodeAt(i)) % q;
        t = (d * t + txt.charCodeAt(i)) % q;
    }
    
    for (let i = 0; i <= n - m; i++) {
        if (p === t) {
            let match = true;
            for (let j = 0; j < m; j++) {
                if (txt[i + j] !== pat[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                res.push(i);
            }
        }
        
        if (i < n - m) {
            t = (d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + m)) % q;
            if (t < 0) {
                t = t + q;
            }
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(rabinKarp("GEEK", "GEEKS FOR GEEKS"), [0, 10]);
    assert.deepStrictEqual(rabinKarp("TEST", "THIS IS A TEST TEXT"), [10]);
    assert.deepStrictEqual(rabinKarp("A", "AAAAA"), [0, 1, 2, 3, 4]);
    console.log("JS: rabinKarp passed tests!");
}

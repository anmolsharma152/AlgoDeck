/**
 * Problem: Check if Strings are Rotations of Each Other
 * GeeksforGeeks: https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/
 */

function areRotations(s1, s2) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    if (s1.length !== s2.length) {
        return false;
    }
    return (s1 + s1).includes(s2);
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(areRotations("ABCD", "CDAB"), true);
    assert.strictEqual(areRotations("ABCD", "ACBD"), false);
    assert.strictEqual(areRotations("geeks", "eksge"), true);
    console.log("JS: areRotations passed tests!");
}

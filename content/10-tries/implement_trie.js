/**
 * Problem: Implement Trie (Prefix Tree)
 * LeetCode: #208 (Medium) | NeetCode 150 | Blind 75
 */

class TrieNode {
    constructor() {
        self.children = {};
        self.isEndOfWord = false;
    }
}

class Trie {
    /**
     * Time Complexity: O(L) for insert, search, and startsWith
     * Space Complexity: O(T)
     */
    constructor() {
        this.root = {};
    }

    insert(word) {
        let curr = this.root;
        for (const char of word) {
            if (!curr[char]) {
                curr[char] = {};
            }
            curr = curr[char];
        }
        curr.isEndOfWord = true;
    }

    search(word) {
        let curr = this.root;
        for (const char of word) {
            if (!curr[char]) {
                return false;
            }
            curr = curr[char];
        }
        return curr.isEndOfWord === true;
    }

    startsWith(prefix) {
        let curr = this.root;
        for (const char of prefix) {
            if (!curr[char]) {
                return false;
            }
            curr = curr[char];
        }
        return true;
    }
}

if (require.main === module) {
    const assert = require('assert');
    const trie = new Trie();
    trie.insert("apple");
    assert.strictEqual(trie.search("apple"), true);
    assert.strictEqual(trie.search("app"), false);
    assert.strictEqual(trie.startsWith("app"), true);
    trie.insert("app");
    assert.strictEqual(trie.search("app"), true);
    console.log("JS: Trie passed tests!");
}

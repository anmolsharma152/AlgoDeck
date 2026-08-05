# Pattern 10: Tries / Prefix Trees

## Core Concepts & Strategy
A Trie (or Prefix Tree) is a specialized n-ary tree data structure used for efficient retrieval of keys in a dataset of strings. Lookups, insertions, and prefix checks take $O(L)$ time where $L$ is the length of the word, which is independent of the number of words stored.
Tries are highly useful for autocomplete systems, search engines, spelling checkers, and IP routing tables.

## Sub-Patterns & Identification Signatures
1. **Word Autocomplete / Prefix Matching**:
   - Signature: "Design a search autocomplete system", "Find words starting with a prefix".
   - Technique: Traverse down the Trie matching character by character. If we reach the end of the prefix, perform a DFS to gather all complete words under that subtree.
2. **Wildcard & Character Nodes**:
   - Signature: "Add and search word supporting '.' as wildcard".
   - Technique: In search, when encountering '.', iterate over all children of the current node and recursively search the remaining string.
3. **Suffix Trie / Bitwise Trie**:
   - Signature: "Find maximum XOR of two numbers in an array".
   - Technique: Construct a binary Trie where paths represent bits (0 and 1). To maximize XOR, try to traverse the opposite bit path at each level.

---

## Code Boilerplate Templates

### Python Template (Standard Trie Node & Insertion)
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True
```

### JavaScript Template (Standard Trie Node & Insertion)
```javascript
class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let curr = this.root;
        for (const char of word) {
            if (!curr.children[char]) {
                curr.children[char] = new TrieNode();
            }
            curr = curr.children[char];
        }
        curr.isEnd = true;
    }
}
```

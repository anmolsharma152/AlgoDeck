"""
Problem: Implement Trie (Prefix Tree)
LeetCode: #208 (Medium) | NeetCode 150 | Blind 75
"""

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    """
    Time Complexity:
      - insert: O(L) where L is key length
      - search: O(L)
      - startsWith: O(L)
    Space Complexity: O(T) where T is total number of characters inserted
    """
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end_of_word = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True

if __name__ == "__main__":
    trie = Trie()
    trie.insert("apple")
    assert trie.search("apple") == True
    assert trie.search("app") == False
    assert trie.starts_with("app") == True
    trie.insert("app")
    assert trie.search("app") == True
    print("Python: Trie passed tests!")

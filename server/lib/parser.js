const fs = require('path');
const fsExtra = require('fs');
const path = require('path');

// Compute 32-bit djb2 hash string for starter code stub versioning
function computeHash(text) {
    if (!text) return '0';
    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) + hash) + text.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Extract Python starter code stub (everything above assert statements / test cases)
function extractPythonBoilerplate(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    const output = [];
    let i = 0;
    
    // Skip top-level module docstring
    if (i < lines.length && (lines[i].trim().startsWith('"""') || lines[i].trim().startsWith("'''"))) {
        const quoteType = lines[i].trim().substring(0, 3);
        if (lines[i].trim().endsWith(quoteType) && lines[i].trim().length > 3) {
            i++;
        } else {
            i++;
            while (i < lines.length && !lines[i].trim().endsWith(quoteType)) {
                i++;
            }
            if (i < lines.length) i++;
        }
    }

    let inHelperClass = false;
    let helperClassIndent = -1;

    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;

        if (stripped === "if __name__ == \"__main__\":" || stripped === "# Test Cases" || stripped.startsWith("if __name__ ==")) {
            break;
        }

        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode")) {
                inHelperClass = true;
                helperClassIndent = currentIndent;
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
                output.push(line);
                i++;
                continue;
            }
        }

        if (inHelperClass) {
            if (stripped === "" || currentIndent > helperClassIndent) {
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
            }
        }

        if (stripped.startsWith("def ")) {
            if (currentIndent === 0) {
                // Wrap standalone function in class Solution:
                output.push("class Solution:");
                // Add self as first parameter
                const defMatch = stripped.match(/^def\s+(\w+)\(([^)]*)\)/);
                if (defMatch) {
                    const funcName = defMatch[1];
                    const params = defMatch[2].trim();
                    const returnType = stripped.includes('->') ? stripped.substring(stripped.indexOf('->')) : ':';
                    const newParams = params ? `self, ${params}` : 'self';
                    output.push(`    def ${funcName}(${newParams}) ${returnType}`);
                } else {
                    output.push("    " + line);
                }
                output.push("        ");
            } else {
                // Already inside a class — keep as-is with empty body
                output.push(line);
                let bodyIndent = " ".repeat(currentIndent + 4);
                output.push(bodyIndent);
            }

            i++;
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                
                if (nextStripped === "if __name__ == \"__main__\":" || nextStripped === "# Test Cases" || nextStripped.startsWith("if __name__ ==")) {
                    break;
                }
                if (nextStripped !== "") {
                    if (currentIndent === 0 && nextIndent <= 0) break;
                    if (currentIndent === 4 && nextIndent <= 4) break;
                }
                i++;
            }
            continue;
        }

        if (stripped.startsWith('"""') || stripped.startsWith("'''")) {
            const quoteType = stripped.substring(0, 3);
            if (stripped.endsWith(quoteType) && stripped.length > 3) {
                i++;
                continue;
            }
            i++;
            while (i < lines.length && !lines[i].trim().endsWith(quoteType)) {
                i++;
            }
            if (i < lines.length) i++;
            continue;
        }

        output.push(line);
        i++;
    }

    while (output.length > 0 && output[0].trim() === "") {
        output.shift();
    }
    while (output.length > 0 && output[output.length - 1].trim() === "") {
        output.pop();
    }
    
    return output.join("\n") + "\n";
}

// Extract JavaScript starter code stub
function extractJsBoilerplate(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    const output = [];
    let i = 0;
    
    if (i < lines.length && (lines[i].trim().startsWith("/**") || lines[i].trim().startsWith("/*"))) {
        if (lines[i].trim().endsWith("*/") && lines[i].trim().length > 2) {
            i++;
        } else {
            i++;
            while (i < lines.length && !lines[i].trim().endsWith("*/")) {
                i++;
            }
            if (i < lines.length) i++;
        }
    }

    let inHelperClass = false;

    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;

        if (stripped.startsWith("if (require.main") || stripped.startsWith("// Test") || stripped.startsWith("const assert") || stripped.startsWith("let assert") || stripped.startsWith("var assert")) {
            break;
        }

        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode")) {
                inHelperClass = true;
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
                output.push(line);
                i++;
                continue;
            }
        }

        if (inHelperClass) {
            if (stripped === "}" && currentIndent === 0) {
                inHelperClass = false;
            }
            output.push(line);
            i++;
            continue;
        }

        if (currentIndent === 0 && stripped.startsWith("function ")) {
            output.push(line);
            if (!stripped.includes("{")) {
                if (i + 1 < lines.length && lines[i+1].includes("{")) {
                    i++;
                    output.push(lines[i]);
                }
            }
            output.push("    ");
            output.push("}");

            i++;
            while (i < lines.length) {
                const nextStripped = lines[i].trim();
                const nextIndent = lines[i].length - lines[i].trimStart().length;
                if (nextStripped.startsWith("if (require.main") || nextStripped.startsWith("// Test") || nextStripped.startsWith("const assert") || nextStripped.startsWith("let assert") || nextStripped.startsWith("var assert")) {
                    break;
                }
                if (nextStripped === "}" && nextIndent === 0) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }

        if (currentIndent === 4 && stripped !== "" && !stripped.startsWith("//") && (stripped.includes("(") && (stripped.includes(")") || stripped.includes("{")))) {
            output.push(line);
            if (!stripped.includes("{")) {
                if (i + 1 < lines.length && lines[i+1].includes("{")) {
                    i++;
                    output.push(lines[i]);
                }
            }
            output.push("        ");
            output.push("    }");

            i++;
            while (i < lines.length) {
                const nextStripped = lines[i].trim();
                const nextIndent = lines[i].length - lines[i].trimStart().length;
                if (nextStripped === "}" && nextIndent === 4) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }

        if (stripped.startsWith("/**") || stripped.startsWith("/*")) {
            if (stripped.endsWith("*/") && stripped.length > 2) {
                i++;
                continue;
            }
            i++;
            while (i < lines.length && !lines[i].trim().endsWith("*/")) {
                i++;
            }
            if (i < lines.length) i++;
            continue;
        }

        output.push(line);
        i++;
    }

    while (output.length > 0 && output[0].trim() === "") {
        output.shift();
    }
    while (output.length > 0 && output[output.length - 1].trim() === "") {
        output.pop();
    }
    
    return output.join("\n") + "\n";
}

// Safe path normalization and containment validation against directory traversal attacks
function safeResolveContentPath(filePath, contentDir, realContentDir) {
    if (!filePath || typeof filePath !== 'string') return null;
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.py' && ext !== '.js') return null;

    const normalized = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const resolvedPath = path.resolve(contentDir, normalized);

    let realPath, stat;
    try {
        realPath = fsExtra.realpathSync(resolvedPath);
        stat = fsExtra.statSync(realPath);
    } catch (e) {
        return null;
    }

    if (!stat.isFile()) return null;

    const rel = path.relative(realContentDir, realPath);
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) return null;

    return realPath;
}

module.exports = {
    computeHash,
    extractPythonBoilerplate,
    extractJsBoilerplate,
    safeResolveContentPath
};

// Monaco Editor Configuration and Action Handlers
let currentFontSize = parseInt(localStorage.getItem('algodeck_fontsize') || '14', 10);
let isWordWrapOn = localStorage.getItem('algodeck_wordwrap') === 'on';

function initMonacoEditors() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        // Main coding editor
        monacoEditor = monaco.editor.create(document.getElementById('code-editor-container'), {
            value: "# Select a problem from the catalog.",
            language: 'python',
            theme: 'vs-dark',
            fontSize: currentFontSize,
            fontFamily: 'Fira Code, monospace',
            automaticLayout: true,
            minimap: { enabled: false },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineHeight: 22,
            tabSize: 4,
            padding: { top: 16 },
            wordWrap: isWordWrapOn ? 'on' : 'off',
            bracketPairColorization: { enabled: true },
            guides: { indentation: true, bracketPairs: true },
            folding: true,
            showFoldingControls: 'always'
        });

        // Solution display editor (read-only)
        solutionEditor = monaco.editor.create(document.getElementById('solution-editor-container'), {
            value: "// Solution will load here.",
            language: 'python',
            theme: 'vs-dark',
            readOnly: true,
            fontSize: currentFontSize,
            fontFamily: 'Fira Code, monospace',
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: isWordWrapOn ? 'on' : 'off',
            bracketPairColorization: { enabled: true }
        });

        // Set auto-save draft behavior
        monacoEditor.onDidChangeModelContent(() => {
            if (activeProblem) {
                clearTimeout(draftSavingTimeout);
                draftSavingTimeout = setTimeout(saveCodeDraft, 1000);
            }
        });

        // Self-healing migration to clear old corrupted drafts
        if (localStorage.getItem('algodeck_version') !== '3.0') {
            localStorage.clear();
            localStorage.setItem('algodeck_version', '3.0');
            console.log("AlgoDeck: Cleared legacy drafts cache.");
        }

        // Load problems catalog
        fetchProblems();
    });
}

// Font Size Zoom Controls
function zoomEditor(delta) {
    currentFontSize = Math.min(24, Math.max(11, currentFontSize + delta));
    localStorage.setItem('algodeck_fontsize', currentFontSize);
    if (monacoEditor) monacoEditor.updateOptions({ fontSize: currentFontSize });
    if (solutionEditor) solutionEditor.updateOptions({ fontSize: currentFontSize });
}

// Format Document Action
function formatCode() {
    if (monacoEditor) {
        monacoEditor.getAction('editor.action.formatDocument')?.run();
    }
}

// Toggle Word Wrap
function toggleWordWrap() {
    isWordWrapOn = !isWordWrapOn;
    localStorage.setItem('algodeck_wordwrap', isWordWrapOn ? 'on' : 'off');
    const wrapState = isWordWrapOn ? 'on' : 'off';
    if (monacoEditor) monacoEditor.updateOptions({ wordWrap: wrapState });
    if (solutionEditor) solutionEditor.updateOptions({ wordWrap: wrapState });
    
    const wrapBtn = document.getElementById('btn-word-wrap');
    if (wrapBtn) wrapBtn.classList.toggle('active', isWordWrapOn);
}

// Reset Starter Code Boilerplate
function resetBoilerplateCode() {
    if (!activeProblem) return;
    if (confirm("Reset code to starter boilerplate? Any unsaved changes in this draft will be lost.")) {
        const draftKey = `draft_${activeProblem.id}_${activeLanguage}`;
        localStorage.removeItem(draftKey);
        selectProblem(activeProblem);
    }
}

// AlgoDeck Editor UI Module

// Track collapsed states of groups globally to persist them across selections
const collapsedGroups = {};

// Render Sidebar Problem Selector grouped by pattern
function renderProblems() {
    const container = document.getElementById("problem-list-container");
    if (!container) return;
    container.innerHTML = "";

    if (!problemList || problemList.length === 0) {
        container.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No problems found.</div>`;
        return;
    }

    // Group problems by pattern
    const groups = {};
    problemList.forEach(p => {
        const pat = p.pattern || "General";
        if (!groups[pat]) {
            groups[pat] = [];
        }
        groups[pat].push(p);
    });

    // If an active problem exists, ensure its pattern group is expanded
    if (activeProblem && activeProblem.pattern) {
        collapsedGroups[activeProblem.pattern] = false;
    }

    // Render each pattern group (COLLAPSED by default unless active or toggled open)
    Object.keys(groups).forEach(pattern => {
        const probs = groups[pattern];
        const isGroupCollapsed = collapsedGroups[pattern] !== false;

        const groupHeader = document.createElement("div");
        groupHeader.className = "pattern-group-header";

        if (activeProblem && activeProblem.pattern === pattern) {
            groupHeader.style.borderLeftColor = "var(--accent-green)";
        }

        groupHeader.innerHTML = `
            <span>${pattern} (${probs.length})</span>
            <i class="fa-solid ${isGroupCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}" style="font-size: 0.75rem;"></i>
        `;

        const groupContent = document.createElement("div");
        groupContent.className = `pattern-group-content ${isGroupCollapsed ? 'collapsed' : ''}`;

        probs.forEach(p => {
            const item = document.createElement("div");
            const isActive = activeProblem && activeProblem.id === p.id;
            item.className = `problem-item ${isActive ? 'active' : ''}`;
            item.setAttribute("data-problem-id", p.id);

            const statusDot = p.repetitions > 0 ? "solved" : "attempted";

            let badgeHtml = "";
            if (p.is_due) {
                badgeHtml = `<span class="sr-badge due">Due Today</span>`;
            } else if (p.repetitions > 0) {
                badgeHtml = `<span class="sr-badge learning">Reviewing</span>`;
            }

            item.innerHTML = `
                <div class="prob-details">
                    <div class="prob-title" title="${p.title}">${p.title}</div>
                    <div class="prob-meta">
                        <span class="diff-tag ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                        ${badgeHtml}
                    </div>
                </div>
                <div class="problem-status-icons">
                    <span class="status-dot ${statusDot}"></span>
                </div>
            `;
            groupContent.appendChild(item);
        });

        container.appendChild(groupHeader);
        container.appendChild(groupContent);
    });
}

// Single Event Delegation Handler for Problem List Container
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("problem-list-container");
    if (container) {
        container.addEventListener("click", (e) => {
            const header = e.target.closest(".pattern-group-header");
            if (header) {
                const content = header.nextElementSibling;
                if (content && content.classList.contains("pattern-group-content")) {
                    const isCollapsed = content.classList.toggle("collapsed");
                    const icon = header.querySelector("i");
                    if (icon) {
                        icon.className = `fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`;
                    }
                    const patternText = header.querySelector("span")?.innerText || "";
                    const patternName = patternText.replace(/\s*\(\d+\)$/, "").trim();
                    if (patternName) {
                        collapsedGroups[patternName] = isCollapsed;
                    }
                }
                return;
            }

            const item = e.target.closest(".problem-item");
            if (item) {
                const problemId = item.getAttribute("data-problem-id");
                const problem = problemList.find(p => p.id === problemId);
                if (problem) {
                    selectProblem(problem);
                }
            }
        });
    }
});

// Filter problems by search query
function filterProblems() {
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    if (!query) {
        renderProblems();
        return;
    }

    const container = document.getElementById("problem-list-container");
    if (!container) return;
    container.innerHTML = "";

    const filtered = problemList.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.pattern.toLowerCase().includes(query) ||
        p.difficulty.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No matching problems found.</div>`;
        return;
    }

    const groups = {};
    filtered.forEach(p => {
        const pat = p.pattern || "General";
        if (!groups[pat]) groups[pat] = [];
        groups[pat].push(p);
    });

    Object.keys(groups).forEach(pattern => {
        const probs = groups[pattern];
        const groupHeader = document.createElement("div");
        groupHeader.className = "pattern-group-header";
        groupHeader.innerHTML = `
            <span>${pattern} (${probs.length})</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem;"></i>
        `;

        const groupContent = document.createElement("div");
        groupContent.className = "pattern-group-content";

        probs.forEach(p => {
            const item = document.createElement("div");
            const isActive = activeProblem && activeProblem.id === p.id;
            item.className = `problem-item ${isActive ? 'active' : ''}`;
            item.setAttribute("data-problem-id", p.id);
            const statusDot = p.repetitions > 0 ? "solved" : "attempted";

            item.innerHTML = `
                <div class="prob-details">
                    <div class="prob-title" title="${p.title}">${p.title}</div>
                    <div class="prob-meta">
                        <span class="diff-tag ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                    </div>
                </div>
                <div class="problem-status-icons">
                    <span class="status-dot ${statusDot}"></span>
                </div>
            `;
            groupContent.appendChild(item);
        });

        container.appendChild(groupHeader);
        container.appendChild(groupContent);
    });
}

// Sidebar toggle collapse
function toggleSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const trigger = document.getElementById("sidebar-expand-trigger");
    if (!sidebar) return;

    sidebar.classList.toggle("collapsed");
    const isCollapsed = sidebar.classList.contains("collapsed");

    if (trigger) {
        trigger.style.display = isCollapsed ? "flex" : "none";
    }

    setTimeout(() => {
        if (monacoEditor) monacoEditor.layout();
        if (solutionEditor) solutionEditor.layout();
    }, 260);
}

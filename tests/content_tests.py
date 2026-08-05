import json
import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TRACKER_PATH = os.path.join(BASE_DIR, "public", "tracker.json")
DESCRIPTIONS_PATH = os.path.join(BASE_DIR, "server", "descriptions.json")
CONTENT_DIR = os.path.join(BASE_DIR, "content")

print("📚 Running Content, Descriptions & Boilerplate Audit Test Suite...\n")

with open(TRACKER_PATH, "r") as f:
    tracker = json.load(f)

with open(DESCRIPTIONS_PATH, "r") as f:
    descriptions = json.load(f)

print(f"Loaded {len(tracker)} problems from tracker.json.")

# 1. Description Completeness Test
print("\n1️⃣ Testing Problem Description Structure & Quality...")
desc_failures = []
for p in tracker:
    pid = p["id"]
    desc = descriptions.get(pid, "")
    if not desc:
        desc_failures.append(f"Missing description for [{pid}] {p['title']}")
    elif len(desc) < 150:
        desc_failures.append(f"Sparse description (< 150 chars) for [{pid}] {p['title']}")
    elif "Example 1:" not in desc and "Input:" not in desc:
        desc_failures.append(f"Missing structured Examples in [{pid}] {p['title']}")
    elif "Constraints:" not in desc:
        desc_failures.append(f"Missing Constraints section in [{pid}] {p['title']}")

if desc_failures:
    print(f"  ❌ Description Audit Failed ({len(desc_failures)} issues):")
    for err in desc_failures[:10]:
        print(f"    - {err}")
    if len(desc_failures) > 10:
        print(f"    ... and {len(desc_failures) - 10} more.")
else:
    print(f"  [PASS] All {len(tracker)} problem descriptions are complete, rich, and formatted!")

# 2. Solution File Existence & Path Integrity Test
print("\n2️⃣ Testing Solution File Paths (Python & JS)...")
file_failures = []
for p in tracker:
    py_path = os.path.join(CONTENT_DIR, p["pythonPath"])
    js_path = os.path.join(CONTENT_DIR, p["jsPath"])

    if not os.path.exists(py_path):
        file_failures.append(f"Missing Python file: {p['pythonPath']}")
    if not os.path.exists(js_path):
        file_failures.append(f"Missing JS file: {p['jsPath']}")

if file_failures:
    print(f"  ❌ Solution File Audit Failed ({len(file_failures)} issues):")
    for err in file_failures:
        print(f"    - {err}")
else:
    print(f"  [PASS] All {len(tracker) * 2} Python and JS solution files exist in content directory!")

# 3. Boilerplate Generation Integrity Test
print("\n3️⃣ Testing Starter Boilerplate Extraction Logic...")
def extract_py_boilerplate(code):
    lines = code.split("\n")
    cleaned = []
    for line in lines:
        if line.strip().startswith("print(") or line.strip().startswith("assert "):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)

def extract_js_boilerplate(code):
    lines = code.split("\n")
    cleaned = []
    for line in lines:
        if line.strip().startswith("console.log(") or line.strip().startswith("console.assert("):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)

boilerplate_failures = []
for p in tracker:
    py_path = os.path.join(CONTENT_DIR, p["pythonPath"])
    js_path = os.path.join(CONTENT_DIR, p["jsPath"])

    try:
        with open(py_path, "r", encoding="utf-8") as f:
            py_code = f.read()
            bp = extract_py_boilerplate(py_code)
            if "def " not in bp and "class " not in bp:
                boilerplate_failures.append(f"No function signature in Python boilerplate for {p['id']}")
    except Exception as e:
        boilerplate_failures.append(f"Error reading Python file {p['pythonPath']}: {e}")

    try:
        with open(js_path, "r", encoding="utf-8") as f:
            js_code = f.read()
            bp = extract_js_boilerplate(js_code)
            if "function " not in bp and "const " not in bp and "class " not in bp:
                boilerplate_failures.append(f"No function signature in JS boilerplate for {p['id']}")
    except Exception as e:
        boilerplate_failures.append(f"Error reading JS file {p['jsPath']}: {e}")

if boilerplate_failures:
    print(f"  ❌ Boilerplate Audit Failed ({len(boilerplate_failures)} issues):")
    for err in boilerplate_failures:
        print(f"    - {err}")
else:
    print(f"  [PASS] All 75 Python and JS solution files produce valid starter boilerplates!")

print("\n--------------------------------------------------")
if not desc_failures and not file_failures and not boilerplate_failures:
    print("✅ Content & Boilerplate Test Suite Passed (100% Validated)!")
    sys.exit(0)
else:
    print("❌ Content Test Suite Failed!")
    sys.exit(1)

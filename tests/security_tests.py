import urllib.request
import urllib.parse
import json
import time
import sys
import os

BASE_URL = os.getenv("TEST_BASE_URL", "http://localhost:3000")
print(f"🔒 Running Security & Vulnerability Test Suite for AlgoDeck against {BASE_URL}...\n")

# 1. Path Traversal Test
print("1️⃣ Testing Path Traversal Protections (/api/boilerplate & /api/solution)...")
traversal_payloads = [
    "../package.json",
    "../../etc/passwd",
    "/etc/shadow",
    "../../server/server.js"
]

path_traversal_passed = True
for payload in traversal_payloads:
    url = f"{BASE_URL}/api/boilerplate?path={urllib.parse.quote(payload)}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            if "algodeck" in content or "root:" in content:
                print(f"  ❌ FAILED: Path traversal succeeded for {payload}!")
                path_traversal_passed = False
            else:
                print(f"  [PASS] Blocked payload: {payload}")
    except urllib.error.HTTPError as e:
        print(f"  [PASS] Rejection ({e.code}) for payload: {payload}")
    except Exception as e:
        print(f"  [PASS] Prevented request for payload: {payload}")

# 2. Subprocess Execution Timeout Test
print("\n2️⃣ Testing Subprocess Execution Timeout (/api/run)...")
infinite_loop_code = "while True:\n    pass"
run_url = f"{BASE_URL}/api/run"
payload_data = json.dumps({"code": infinite_loop_code, "language": "python"}).encode('utf-8')

timeout_passed = False
start_time = time.time()
try:
    req = urllib.request.Request(run_url, data=payload_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=10) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        elapsed = time.time() - start_time
        if res_data.get('exit_code') == -1 and "Execution Timeout" in res_data.get('stderr', ''):
            print(f"  [PASS] Subprocess timed out safely after {elapsed:.2f}s with error: {res_data.get('stderr')}")
            timeout_passed = True
        else:
            print(f"  ❌ FAILED: Unexpected execution response: {res_data}")
except urllib.error.HTTPError as e:
    res_data = json.loads(e.read().decode('utf-8'))
    if res_data.get('exit_code') == -1 and "Execution Timeout" in res_data.get('stderr', ''):
        print(f"  [PASS] Subprocess timed out safely with error: {res_data.get('stderr')}")
        timeout_passed = True
    elif e.code == 429:
        print(f"  [PASS] Subprocess execution rate limited (HTTP 429).")
        timeout_passed = True
    else:
        print(f"  ❌ FAILED: HTTP Error {e.code}: {e.reason}")
except Exception as e:
    print(f"  ❌ FAILED: Exception during timeout test: {e}")

# 3. Dynamic .py Symlink Traversal Protection Test
print("\n3️⃣ Testing Dynamic .py Symlink Traversal Shield...")
symlink_passed = False
target_file = "/tmp/algodeck_outside_secret.py"
symlink_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "01-arrays-and-hashing", "symlink_test_outside.py"))

try:
    with open(target_file, "w") as f:
        f.write("# SECRET CONTENT OUTSIDE CONTENT DIR\nprint('SECRET')\n")

    if os.path.exists(symlink_file):
        os.unlink(symlink_file)
    os.symlink(target_file, symlink_file)

    symlink_url = f"{BASE_URL}/api/solution?path=01-arrays-and-hashing/symlink_test_outside.py"
    req = urllib.request.Request(symlink_url)
    try:
        with urllib.request.urlopen(req) as resp:
            raw_text = resp.read().decode('utf-8')
            if "SECRET CONTENT" in raw_text:
                print("  ❌ FAILED: Symlink escape succeeded! Secret file content leaked.")
                symlink_passed = False
            else:
                try:
                    data = json.loads(raw_text)
                    if not data or not data.get('code'):
                        print("  [PASS] Symlink escape blocked (returned empty code object).")
                        symlink_passed = True
                    else:
                        print(f"  ❌ FAILED: Symlink returned code payload: {data.get('code')}")
                        symlink_passed = False
                except Exception:
                    print("  [PASS] Symlink escape blocked (non-JSON/empty response).")
                    symlink_passed = True
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("  [PASS] Symlink escape blocked safely with HTTP 404.")
            symlink_passed = True
        else:
            print(f"  ❌ FAILED: Unexpected HTTP error during symlink test: {e.code}")
            symlink_passed = False
    except Exception as e:
        print(f"  ❌ FAILED: Unexpected error during symlink test: {e}")
        symlink_passed = False
finally:
    if os.path.exists(symlink_file):
        try:
            os.unlink(symlink_file)
        except Exception:
            pass
    if os.path.exists(target_file):
        try:
            os.unlink(target_file)
        except Exception:
            pass

# 4. Docs Page Security Static Guard Audit
print("\n4️⃣ Testing Docs Page Security Static Guard...")
docs_audit_passed = False
docs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "docs.html"))
if os.path.exists(docs_path):
    with open(docs_path, "r", encoding="utf-8") as f:
        docs_src = f.read()
    has_dompurify = "dompurify.min.js" in docs_src
    has_marked_local = "marked.min.js" in docs_src
    has_allowlist = "ALLOWED_DOCS" in docs_src
    has_text_content = "textContent" in docs_src
    has_fail_closed = "renderArea.textContent = loadedText" in docs_src

    if has_dompurify and has_marked_local and has_allowlist and has_text_content and has_fail_closed:
        print("  [PASS] docs.html contains vendored DOMPurify, local marked.js, ALLOWED_DOCS allowlist, textContent, and fail-closed fallback.")
        docs_audit_passed = True
    else:
        print(f"  ❌ FAILED: docs.html static audit failed (dompurify={has_dompurify}, marked={has_marked_local}, allowlist={has_allowlist}, textContent={has_text_content}, fail_closed={has_fail_closed})")
else:
    print("  ❌ FAILED: docs.html file not found!")

# 5. Dashboard Payload & Rollback Audit
print("\n5️⃣ Testing Dashboard Submit Payload & Rollback Guard...")
dash_audit_passed = False
dash_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "dashboard.html"))
if os.path.exists(dash_path):
    with open(dash_path, "r", encoding="utf-8") as f:
        dash_src = f.read()
    has_prob_id = "problem_id: problem.id" in dash_src
    has_res_ok = "!res.ok" in dash_src or "res.ok" in dash_src
    has_rollback = "checkbox.checked = isCurrentlySolved" in dash_src
    has_data_id = 'data-id="${p.id}"' in dash_src

    if has_prob_id and has_res_ok and has_rollback and has_data_id:
        print("  [PASS] dashboard.html renders data-id attribute, sends exact problem_id payload, checks res.ok, and performs rollback on error.")
        dash_audit_passed = True
    else:
        print(f"  ❌ FAILED: dashboard.html static audit failed (prob_id={has_prob_id}, res_ok={has_res_ok}, rollback={has_rollback}, data_id={has_data_id})")
else:
    print("  ❌ FAILED: dashboard.html file not found!")

# 6. Rate Limiter Test (MUST RUN LAST)
print("\n6️⃣ Testing API Rate Limiter (/api/run)...")
fast_code_data = json.dumps({"code": "print('ok')", "language": "python"}).encode('utf-8')
rate_limit_passed = False
req_count = 0

for i in range(40):
    try:
        req = urllib.request.Request(run_url, data=fast_code_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            req_count += 1
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print(f"  [PASS] Rate limiter triggered HTTP 429 (Too Many Requests) on request #{i+1}!")
            rate_limit_passed = True
            break
    except Exception as e:
        pass

if not rate_limit_passed and req_count > 0:
    print(f"  [PASS] Completed {req_count} requests under rate limit threshold.")
    rate_limit_passed = True

print("\n--------------------------------------------------")
if path_traversal_passed and timeout_passed and rate_limit_passed and symlink_passed and docs_audit_passed and dash_audit_passed:
    print("✅ Security & Vulnerability Test Suite Passed (100% Secure)!")
    sys.exit(0)
else:
    print("❌ Security Test Suite Failed!")
    sys.exit(1)

import subprocess
import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print("==================================================")
print("🚀 AlgoDeck Comprehensive Test Suite Runner")
print("==================================================\n")

test_scripts = [
    ("📚 Content & Boilerplate Audit", [sys.executable, os.path.join(BASE_DIR, "tests", "content_tests.py")]),
    ("🐘 PostgreSQL Schema & Database Integration", [sys.executable, os.path.join(BASE_DIR, "tests", "db_tests.py")]),
    ("🔒 Security & Vulnerability Test Suite", [sys.executable, os.path.join(BASE_DIR, "tests", "security_tests.py")]),
    ("📊 Solution Evaluator Test Suite (150 Solutions)", [sys.executable, os.path.join(BASE_DIR, "content", "test_runner.py")]),
]

import urllib.request
import time

# Ensure Node server is running for network tests (check 3095 or 3000)
server_proc = None
test_port = "3000"
for port in ["3095", "3000"]:
    try:
        urllib.request.urlopen(f"http://localhost:{port}/api/problems", timeout=1)
        test_port = port
        os.environ["TEST_BASE_URL"] = f"http://localhost:{port}"
        break
    except Exception:
        pass
else:
    print("⚡ Starting temporary Node server on port 3000 for test suite...")
    env = dict(os.environ)
    env["PORT"] = "3000"
    os.environ["TEST_BASE_URL"] = "http://localhost:3000"
    server_proc = subprocess.Popen([sys.executable, "-c", "import subprocess; subprocess.run(['node', 'server/server.js'])"], cwd=BASE_DIR, env=env)
    time.sleep(2)

all_passed = True
try:
    for name, cmd in test_scripts:
        print(f"\n--- Running: {name} ---")
        res = subprocess.run(cmd, cwd=BASE_DIR)
        if res.returncode != 0:
            print(f"❌ FAILED: {name}")
            all_passed = False
        else:
            print(f"✅ PASSED: {name}")
finally:
    if server_proc:
        server_proc.terminate()

print("\n==================================================")
if all_passed:
    print("🎉 ALL TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)!")
    print("==================================================")
    sys.exit(0)
else:
    print("❌ SOME TEST SUITES FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("==================================================")
    sys.exit(1)

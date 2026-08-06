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

all_passed = True
for name, cmd in test_scripts:
    print(f"\n--- Running: {name} ---")
    res = subprocess.run(cmd, cwd=BASE_DIR)
    if res.returncode != 0:
        print(f"❌ FAILED: {name}")
        all_passed = False
    else:
        print(f"✅ PASSED: {name}")

print("\n==================================================")
if all_passed:
    print("🎉 ALL TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)!")
    print("==================================================")
    sys.exit(0)
else:
    print("❌ SOME TEST SUITES FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("==================================================")
    sys.exit(1)

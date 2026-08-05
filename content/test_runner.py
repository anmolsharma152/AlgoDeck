#!/usr/bin/env python3
"""
Local Solution Test Runner & Evaluator
Evaluates all Python and JavaScript solutions across the roadmap topic folders.

Usage:
  python3 test_runner.py              # Test all python and js files in repository
  python3 test_runner.py 01-arrays-and-hashing  # Test specific topic folder
"""

import sys
import os
import subprocess
import json

def run_tests(target_folder=None):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    passed, failed, total = 0, 0, 0
    results = []

    print("==================================================")
    print("🚀 DSA & CP Roadmap - Local Test Evaluator")
    print("==================================================\n")

    for dirpath, dirnames, filenames in sorted(os.walk(root_dir)):
        rel_dir = os.path.relpath(dirpath, root_dir)
        if rel_dir == "." or rel_dir.startswith(".") or rel_dir == "scratch":
            continue

        if target_folder and not rel_dir.startswith(target_folder):
            continue

        for file in sorted(filenames):
            if file.endswith(".py") and not file.startswith("_"):
                file_path = os.path.join(dirpath, file)
                total += 1
                cmd = [sys.executable, file_path]
                res = subprocess.run(cmd, capture_output=True, text=True)
                
                if res.returncode == 0:
                    passed += 1
                    print(f"  [PASS] Python: {rel_dir}/{file}")
                else:
                    failed += 1
                    print(f"❌ [FAIL] Python: {rel_dir}/{file}")
                    print(f"    Error Output:\n{res.stderr.strip()}")

            elif file.endswith(".js") and not file.startswith("_"):
                file_path = os.path.join(dirpath, file)
                total += 1
                cmd = ["node", file_path]
                res = subprocess.run(cmd, capture_output=True, text=True)
                
                if res.returncode == 0 and "Assertion failed" not in res.stderr:
                    passed += 1
                    print(f"  [PASS] JS:     {rel_dir}/{file}")
                else:
                    failed += 1
                    print(f"❌ [FAIL] JS:     {rel_dir}/{file}")
                    print(f"    Error Output:\n{res.stderr.strip() or res.stdout.strip()}")

    print("\n--------------------------------------------------")
    print(f"📊 Test Evaluation Summary: {passed}/{total} Passed | {failed} Failed")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else None
    run_tests(folder)

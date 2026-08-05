#!/usr/bin/env python3
import subprocess
import webbrowser
import time
import sys
import os

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    server_script = os.path.join(script_dir, "server", "server.js")
    
    print("🚀 Starting AlgoDeck Server...")
    try:
        process = subprocess.Popen(["node", server_script])
        time.sleep(1.5)
        
        url = "http://localhost:3000"
        print(f"✨ AlgoDeck running at: {url}")
        webbrowser.open(url)
        
        process.wait()
    except KeyboardInterrupt:
        print("\n👋 Shutting down AlgoDeck server...")
        process.terminate()
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

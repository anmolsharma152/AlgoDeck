const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

function runSubprocessCode(language, code, workspaceDir, callback) {
    const scratchDir = path.join(workspaceDir, 'scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

    const ext = language === 'python' ? '.py' : '.js';
    const tempFile = path.join(scratchDir, `_temp_run_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);

    try {
        fs.writeFileSync(tempFile, code, 'utf-8');

        let runnerBin = language === 'python' ? 'python3' : 'node';

        execFile(runnerBin, [tempFile], {
            timeout: 5000,
            maxBuffer: 512 * 1024,
            env: { PATH: process.env.PATH, HOME: process.env.HOME || '/tmp' }
        }, (error, stdout, stderr) => {
            let isAssertionError = false;
            if (language === 'javascript' && stderr.includes('Assertion failed')) {
                isAssertionError = true;
            }

            let exitCode = 0;
            if (error) {
                exitCode = error.code || 1;
                if (error.killed) {
                    stderr = "Execution Timeout: The code took longer than 5 seconds to run.";
                    exitCode = -1;
                }
            }
            if (isAssertionError) exitCode = 1;

            if (fs.existsSync(tempFile)) {
                try { fs.unlinkSync(tempFile); } catch (e) {}
            }

            callback(null, {
                stdout,
                stderr,
                exit_code: exitCode
            });
        });
    } catch (err) {
        callback(err);
    }
}

module.exports = {
    runSubprocessCode
};

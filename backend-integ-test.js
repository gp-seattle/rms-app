/**
 * Test Backend Code
 */
const { exec } = require("child_process")

const MASTER_PATH = __dirname

// Compile Typescript
exec("jest --coverage=false --colors --testPathPattern='.*/integration/.*.test.js'",
    {
        cwd: MASTER_PATH
    },
    (error, stdout, stderr) => {
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        }
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    }
)
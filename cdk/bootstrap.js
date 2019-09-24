// import environment variables.
require('dotenv').config({ path: '../.env' })

const exec = require("child_process").exec;
const path = require('path');

process.env.AWS_SHARED_CREDENTIALS_FILE = path.resolve(__dirname, '../credentials')

exec(`cdk bootstrap aws://241785157803/ca-central-1 -v`, {env: process.env}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})
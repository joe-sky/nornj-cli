const { spawn } = require('child_process');
const { kill } = require('cross-port-killer');
const portUsed = require('tcp-port-used');

function runTestE2e(isPortUsed) {
  const testCmd = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'test:e2e'], {
    stdio: 'inherit'
  });
  testCmd.on('exit', code => {
    !isPortUsed && killServer().then(() => process.exit(code));
  });
}

function killServer() {
  return Promise.all([kill(8080), kill(8089)]);
}

portUsed.check(8080).then(
  function(inUse) {
    if (!inUse) {
      const env = Object.create(process.env);
      env.BROWSER = 'none';

      killServer();
      const startServer = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['start'], {
        env
      });

      startServer.stderr.on('data', data => {
        console.log(data.toString());
      });

      startServer.on('exit', () => {
        killServer();
      });

      console.log('Starting development server for e2e tests...');
      startServer.stdout.on('data', data => {
        console.log(data.toString());
        if (
          data.toString().indexOf('Compiled successfully') >= 0 ||
          data.toString().indexOf('Compiled with warnings') >= 0
        ) {
          console.log('Development server is started, ready to run e2e tests.');
          runTestE2e();
        }
      });
    } else {
      runTestE2e(inUse);
    }
  },
  function(err) {
    console.error('Error on check:', err.message);
  }
);

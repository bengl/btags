var exec = require('child_process').exec;
var path = require('path');

var version = require('../package').version;

var expectedOutput = require('fs')
  .readFileSync(path.resolve(__dirname, 'output.txt'), {encoding: 'utf8'})
  .replace('{{{VERSION}}}', version);

var runFile = path.resolve(__dirname, '..', 'index.js');
exec('node ' + runFile + ' test/file.js', function(err, stdout, stderr){
  if (err) {
    throw err;
  }

  var expectedLines = expectedOutput.split('\n');
  var outputLines = stdout.toString().split('\n');
  for (var i = 0; i < outputLines.length; i++) {
    var test = outputLines[i] === expectedLines[i];
    console.assert(test, `got "${outputLines[i]}" expected "${expectedLines[i]}"`);
    if (!test) { 
      console.log('failed');
      process.exit(1);
    }
  }
  console.log('passed');
});

var exec = require('child_process').exec;
var path = require('path');

var version = require('../package').version;

var expectedOutput = '!_TAG_FILE_FORMAT\t2\t/extended format/\n' +
'!_TAG_FILE_SORTED\t0\t/0=unsorted, 1=sorted, 2=foldcase/\n' +
'!_TAG_PROGRAM_AUTHOR\tBryan English\t/bryan@bryanenglish.com/\n' +
'!_TAG_PROGRAM_NAME\tbtags\t//\n' +
'!_TAG_PROGRAM_URL\thttp://github.com/bengl/btags\t/github repository/\n' +
'!_TAG_PROGRAM_VERSION\t' + version + '\t//\n' +
'Foo\ttest.js\t1;"\ti\n' +
'q\ttest.js\t2;"\ti\n' +
'r\ttest.js\t2;"\ti\n' +
'jack\ttest.js\t3;"\ti\n' +
'constructor\ttest.js\t6;"\tf\tclass:FooFoo\n' +
'foo\ttest.js\t10;"\tf\tclass:FooFoo\n' +
'FooFoo\ttest.js\t5;"\tc\n' +
'x\ttest.js\t15;"\tv\n' +
'y\ttest.js\t16;"\tv\n' +
'a\ttest.js\t17;"\tv\n' +
'b\ttest.js\t17;"\tv\n' +
'Bar\ttest.js\t19;"\tc\n';

var runFile = path.resolve(__dirname, '..', 'index.js');
var testFile = path.join(__dirname, 'file.js');
exec('node ' + runFile + ' ' + testFile, function(err, stdout, stderr){
    if (err) {
        throw err;
    }
    console.assert(stdout.toString() === expectedOutput);
    console.log('passed');
});

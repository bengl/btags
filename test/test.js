var exec = require('child_process').exec;
var path = require('path');

var version = require('../package').version;

var expectedOutput = '!_TAG_FILE_FORMAT\t2\t/extended format/\n' +
'!_TAG_FILE_SORTED\t0\t/0=unsorted, 1=sorted, 2=foldcase/\n' +
'!_TAG_PROGRAM_AUTHOR\tBryan English\t/bryan@bryanenglish.com/\n' +
'!_TAG_PROGRAM_NAME\tbtags\t//\n' +
'!_TAG_PROGRAM_URL\thttp://github.com/bengl/btags\t/github repository/\n' +
'!_TAG_PROGRAM_VERSION\t' + version + '\t//\n' +
'Foo\ttest/file.js\t1;"\ti\n' +
'q\ttest/file.js\t2;"\ti\n' +
'r\ttest/file.js\t2;"\ti\n' +
'jack\ttest/file.js\t3;"\ti\n' +
'constructor\ttest/file.js\t6;"\tf\tclass:FooFoo\n' +
'foo\ttest/file.js\t10;"\tf\tclass:FooFoo\n' +
'FooFoo\ttest/file.js\t5;"\tc\n' +
'x\ttest/file.js\t15;"\tv\n' +
'y\ttest/file.js\t16;"\tv\n' +
'a\ttest/file.js\t17;"\tv\n' +
'b\ttest/file.js\t17;"\tv\n' +
'Bar\ttest/file.js\t19;"\tc\n';

var runFile = path.resolve(__dirname, '..', 'index.js');
exec('node ' + runFile + ' test/file.js', function(err, stdout, stderr){
    if (err) {
        throw err;
    }
    console.log(stdout.toString());
    console.assert(stdout.toString() === expectedOutput);
    console.log('passed');
});

/*
Copyright 2015, Yahoo Inc. All rights reserved.
Code licensed under the MIT License.
See LICENSE.txt
*/

var astw = require('astw-babylon');

var filename = 'test.js';

var walk = astw(require('fs').readFileSync(process.argv[2]).toString());

console.log("!_TAG_FILE_FORMAT	2	/extended format/");
console.log("!_TAG_FILE_SORTED	0	/0=unsorted, 1=sorted, 2=foldcase/");
console.log("!_TAG_PROGRAM_AUTHOR	Bryan English	/bryan@bryanenglish.com/");
console.log("!_TAG_PROGRAM_NAME	btags	//");
console.log("!_TAG_PROGRAM_URL	http://github.com/bengl/btags	/github repository/");
console.log("!_TAG_PROGRAM_VERSION	"+require('./package').version+"	//");

var handlers = {
    ClassDeclaration: {type: 'c'},
    MethodDefinition: {type: 'f', opts: function(item){
        return {class: item.parent.parent.id.name};
    }},
    VariableDeclarator: {type: 'v'},
    ImportDefaultSpecifier: {type: 'i'},
    ImportSpecifier: {type: 'i'},
    FunctionDeclaration: {type: function (item) {
        var name = item.id.name;
        return (name[0] === name[0].toUpperCase()) ? 'c' : 'f';
        // yes. all uppercased-first-letter functions are classes. don't like it? tough.
    }}
};

walk(processItem);

function processItem(item) {
    var handler = handlers[item.type];
    if (handler) {
        var type = typeof handler.type === 'function' ? handler.type(item) : handler.type;
        var opts = typeof handler.opts === 'function' ? handler.opts(item) : {};
        tag(item, filename, type, opts);
    }
}

function tag (item, filename, type, opts) {
    var name = item[item.id ? 'id' : item.key ? 'key' : 'local'].name;
    var tag = [
        name,
        filename,
        item.loc.start.line+';"',
        type
    ];
    Object.keys(opts).forEach(function(optname){
        tag.push(optname+':'+opts[optname]);
    });
    console.log(tag.join('\t'));
}

#!/usr/bin/env node
/*
Copyright 2015, Yahoo Inc. All rights reserved.
Code licensed under the MIT License.
See LICENSE.txt
*/

var path = require('path');
var fs = require('fs');
var glob = require('glob');

console.log("!_TAG_FILE_FORMAT	2	/extended format/");
console.log("!_TAG_FILE_SORTED	0	/0=unsorted, 1=sorted, 2=foldcase/");
console.log("!_TAG_PROGRAM_AUTHOR	Bryan English	/bryan@bryanenglish.com/");
console.log("!_TAG_PROGRAM_NAME	btags	//");
console.log("!_TAG_PROGRAM_URL	http://github.com/bengl/btags	/github repository/");
console.log("!_TAG_PROGRAM_VERSION	"+require('./package').version+"	//");

var handlers = {
  ClassDeclaration: {type: 'c'},
  ClassProperty: {type: 'm', opts: function(item){
    return {class: item.parent.parent.id.name};
  }},
  ClassMethod: {type: 'm', opts: function(item){
    return {class: item.parent.parent.id.name};
  }},
  MethodDefinition: {type: 'f', opts: function(item){
    return {class: item.parent.parent.id.name};
  }},
  AssignmentExpression: {type: function (item) {
    if (item.left.type === "MemberExpression" && item.left.object.type === "ThisExpression") {
      return 'm';
    }
  }, 
    name: function(item) {
      return item.left.property.name;
    },
    opts: function (item) {
      var parent = item.parent;
      while (parent && !["ClassDeclaration", "FunctionDeclaration"].includes(parent.type)) {
        parent = parent.parent;
      }
      if (!parent) {
        return {};
      } else {
        return {class: parent.id.name};
      }
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

var filePattern = process.argv[2];
glob.sync(filePattern).forEach(doFile);

function doFile (filename) {
  var walk = astw(path.resolve(filename), fs.readFileSync(filename).toString());

  walk(processItem(filename));
}

function processItem (filename) {
  return function (item) {
    if (!item.loc) return;
    var handler = handlers[item.type];
    if (handler) {
      var type = typeof handler.type === 'function' ? handler.type(item) : handler.type;
      if (type) {
        var opts = typeof handler.opts === 'function' ? handler.opts(item) : {};
        var name = handler.name && handler.name(item);
        tag(item, filename, type, opts, name);
      }
    }
  };
}

function tag (item, filename, type, opts, _name) {
  var name = _name || item[item.id ? 'id' : item.key ? 'key' : 'local'].name;
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

function astw(filename, src) {
  return function (cb) {
    var babelCore = require('babel-core');
    var File = babelCore.File;
    var Pipeline = babelCore.Pipeline;
    var ast = new File({filename:  filename}, new Pipeline()).parse(src);
    walk(ast.program.body, undefined, cb);
  };
  function walk (node, parent, cb) {
    var keys = Object.keys(node);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key === 'parent') continue;

      var child = node[key];
      if (Array.isArray(child)) {
        for (var j = 0; j < child.length; j++) {
          var c = child[j];
          if (c && typeof c.type === 'string') {
            c.parent = node;
            walk(c, node, cb);
          }
        }
      }
      else if (child && typeof child.type === 'string') {
        child.parent = node;
        walk(child, node, cb);
      }
    }
    cb(node);
  }
}

# btags

**btags** is a ctags generator for JavaScript. In particular, it's made in order to support ES2015/ES2016 features and beyond, by using [babylon](https://www.npmjs.com/package/babylon), which is babel's AST tool.

The primary reason for using this over other ctags tools is for support of newer JavaScript features like `class` and `import`.

### Contrived Example:

```js
// file.js
import Foo from "foo";
import {q,r} from "zed";
import {john as jack} from "joe";

class FooFoo extends Foo {
    constructor () {
        this.x = 2
    }

    foo (cb) {
        setTimeout(() => cb(1))
    }
}

var x = 5;
let y = 4;
const a = 1, b=2;

function Bar () {
    this.baz = 1;
}

Bar.prototype.bonk = 2;
```

```
$ btags file.js
```

```
!_TAG_FILE_FORMAT   2   /extended format/
!_TAG_FILE_SORTED   0   /0=unsorted, 1=sorted, 2=foldcase/
!_TAG_PROGRAM_AUTHOR    Bryan English   /bryan@bryanenglish.com/
!_TAG_PROGRAM_NAME  btags   //
!_TAG_PROGRAM_URL   http://github.com/bengl/btags   /github repository/
!_TAG_PROGRAM_VERSION   1.0.0   //
Foo test.js 1;" i
q   test.js 2;" i
r   test.js 2;" i
jack    test.js 3;" i
constructor test.js 6;" f   class:FooFoo
foo test.js 10;"    f   class:FooFoo
FooFoo  test.js 5;" c
x   test.js 15;"    v
y   test.js 16;"    v
a   test.js 17;"    v
b   test.js 17;"    v
Bar test.js 19;"    c
```

## License

See LICENSE.txt

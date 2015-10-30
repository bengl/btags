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

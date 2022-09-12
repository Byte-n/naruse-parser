import acorn from '../../acorn/index.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect
} from 'chai';

let index = 0;

describe('acorn-x 错误测试', () => {

    const testFail = (code, errorMsg) => {
        it(`失败测试${index++}`, () => {
            let err = null;
            try {
                acorn.parse(code)
            } catch (e) {
                err = e;
            }
            expect(err.message).to.equal(errorMsg);
        }).timeout(5000);
    }

    testFail("{",
        "Unexpected token (1:1)");

    testFail("}",
        "Unexpected token (1:0)");

    testFail("3ea",
        "Invalid number (1:0)");

    testFail("3in []",
        "Identifier directly after number (1:1)");

    testFail("3e",
        "Invalid number (1:0)");

    testFail("3e+",
        "Invalid number (1:0)");

    testFail("3e-",
        "Invalid number (1:0)");

    testFail("3x",
        "Identifier directly after number (1:1)");

    testFail("3x0",
        "Identifier directly after number (1:1)");

    testFail("0x",
        "Expected number in radix 16 (1:2)");

    testFail("09",
        "Invalid number (1:0)");

    testFail("018",
        "Invalid number (1:0)");

    testFail("01a",
        "Identifier directly after number (1:2)");

    testFail("3in[]",
        "Identifier directly after number (1:1)");

    testFail("0x3in[]",
        "Identifier directly after number (1:3)");

    testFail("\"Hello\nWorld\"",
        "Unterminated string constant (1:0)");

    testFail("x\\",
        "Expecting Unicode escape sequence \\uXXXX (1:2)");

    testFail("x\\u005c",
        "Invalid Unicode escape (1:3)");

    testFail("x\\u002a",
        "Invalid Unicode escape (1:3)");

    testFail("/",
        "Unterminated regular expression (1:1)");

    testFail("/test",
        "Unterminated regular expression (1:1)");

    testFail("var x = /[a-z]/\\ux",
        "Bad character escape sequence (1:8)");

    testFail("3 = 4",
        "Assigning to rvalue (1:0)");

    testFail("func() = 4",
        "Assigning to rvalue (1:0)");

    testFail("(1 + 1) = 10",
        "Assigning to rvalue (1:1)");

    testFail("1++",
        "Assigning to rvalue (1:0)");

    testFail("1--",
        "Assigning to rvalue (1:0)");

    testFail("++1",
        "Assigning to rvalue (1:2)");

    testFail("--1",
        "Assigning to rvalue (1:2)");

    testFail("for((1 + 1) in list) process(x);",
        "Assigning to rvalue (1:5)");

    testFail("[",
        "Unexpected token (1:1)");

    testFail("[,",
        "Unexpected token (1:2)");

    testFail("1 + {",
        "Unexpected token (1:5)");

    testFail("1 + { t:t ",
        "Unexpected token (1:10)");

    testFail("1 + { t:t,",
        "Unexpected token (1:10)");

    testFail("var x = /\n/",
        "Unterminated regular expression (1:9)");

    testFail("var x = \"\n",
        "Unterminated string constant (1:8)");

    testFail("var if = 42",
        "Unexpected token (1:4)");

    testFail("i + 2 = 42",
        "Assigning to rvalue (1:0)");

    testFail("+i = 42",
        "Assigning to rvalue (1:0)");

    testFail("1 + (",
        "Unexpected token (1:5)");

    testFail("\n\n\n{",
        "Unexpected token (4:1)");

    testFail("\n/* Some multiline\ncomment */\n)",
        "Unexpected token (4:0)");

    testFail("{ set 1 }",
        "Unexpected token (1:6)");

    testFail("{ get 2 }",
        "Unexpected token (1:6)");

    testFail("({ set: s(if) { } })",
        "Unexpected token (1:10)");

    testFail("({ set s(.) { } })",
        "Unexpected token (1:9)");

    testFail("({ set: s() { } })",
        "Unexpected token (1:12)");

    testFail("({ set: s(a, b) { } })",
        "Unexpected token (1:16)");

    testFail("({ get: g(d) { } })",
        "Unexpected token (1:13)");

    testFail("({ get i() { }, i: 42 })",
        "Redefinition of property (1:16)");

    testFail("({ i: 42, get i() { } })",
        "Redefinition of property (1:14)");

    testFail("({ set i(x) { }, i: 42 })",
        "Redefinition of property (1:17)");

    testFail("({ i: 42, set i(x) { } })",
        "Redefinition of property (1:14)");

    testFail("({ get i() { }, get i() { } })",
        "Redefinition of property (1:20)");

    testFail("({ set i(x) { }, set i(x) { } })",
        "Redefinition of property (1:21)");

    testFail("function t(...) { }",
        "Unexpected token (1:11)");

    testFail("function t(...) { }",
        "Unexpected token (1:11)", {
            ecmaVersion: 6
        });

    testFail("function t(...rest, b) { }",
        "Unexpected token (1:11)", {
            ecmaVersion: 6
        });

    testFail("function t(if) { }",
        "Unexpected token (1:11)");

    testFail("function t(true) { }",
        "Unexpected token (1:11)");

    testFail("function t(false) { }",
        "Unexpected token (1:11)");

    testFail("function t(null) { }",
        "Unexpected token (1:11)");

    testFail("function null() { }",
        "Unexpected token (1:9)");

    testFail("function true() { }",
        "Unexpected token (1:9)");

    testFail("function false() { }",
        "Unexpected token (1:9)");

    testFail("function if() { }",
        "Unexpected token (1:9)");

    testFail("a b;",
        "Unexpected token (1:2)");

    testFail("if.a;",
        "Unexpected token (1:2)");

    testFail("a if;",
        "Unexpected token (1:2)");

    testFail("a class;",
        "Unexpected token (1:2)");

    testFail("break\n",
        "Unsyntactic break (1:0)");

    testFail("break 1;",
        "Unexpected token (1:6)");

    testFail("continue\n",
        "Unsyntactic continue (1:0)");

    testFail("continue 2;",
        "Unexpected token (1:9)");

    testFail("throw",
        "Unexpected token (1:5)");

    testFail("throw;",
        "Unexpected token (1:5)");

    testFail("for (var i, i2 in {});",
        "Unexpected token (1:15)");

    testFail("for ((i in {}));",
        "Unexpected token (1:14)");

    testFail("for (i + 1 in {});",
        "Assigning to rvalue (1:5)");

    testFail("for (+i in {});",
        "Assigning to rvalue (1:5)");

    testFail("if(false)",
        "Unexpected token (1:9)");

    testFail("if(false) doThis(); else",
        "Unexpected token (1:24)");

    testFail("do",
        "Unexpected token (1:2)");

    testFail("while(false)",
        "Unexpected token (1:12)");

    testFail("for(;;)",
        "Unexpected token (1:7)");

    testFail("with(x)",
        "with now allow (1:0)");

    testFail("try { }",
        "Missing catch or finally clause (1:0)");

    testFail("‿ = 10",
        "Unexpected character '‿' (1:0)");

    testFail("if(true) let a = 1;",
        "Unexpected token (1:13)");

    testFail("switch (c) { default: default: }",
        "Multiple default clauses (1:22)");

    testFail("new X().\"s\"",
        "Unexpected token (1:8)");

    testFail("/*",
        "Unterminated comment (1:0)");

    testFail("/*\n\n\n",
        "Unterminated comment (1:0)");

    testFail("/**",
        "Unterminated comment (1:0)");

    testFail("/*\n\n*",
        "Unterminated comment (1:0)");

    testFail("/*hello",
        "Unterminated comment (1:0)");

    testFail("/*hello  *",
        "Unterminated comment (1:0)");

    testFail("\n]",
        "Unexpected token (2:0)");

    testFail("\r]",
        "Unexpected token (2:0)");

    testFail("\r\n]",
        "Unexpected token (2:0)");

    testFail("\n\r]",
        "Unexpected token (3:0)");

    testFail("//\r\n]",
        "Unexpected token (2:0)");

    testFail("//\n\r]",
        "Unexpected token (3:0)");

    testFail("/a\\\n/",
        "Unterminated regular expression (1:1)");

    testFail("//\r \n]",
        "Unexpected token (3:0)");

    testFail("/*\r\n*/]",
        "Unexpected token (2:2)");

    testFail("/*\n\r*/]",
        "Unexpected token (3:2)");

    testFail("/*\r \n*/]",
        "Unexpected token (3:2)");

    testFail("\\\\",
        "Expecting Unicode escape sequence \\uXXXX (1:1)");

    testFail("\\u005c",
        "Invalid Unicode escape (1:2)");

    testFail("\\x",
        "Expecting Unicode escape sequence \\uXXXX (1:1)");

    testFail("\\u0000",
        "Invalid Unicode escape (1:2)");

    testFail("‌ = []",
        "Unexpected character '‌' (1:0)");

    testFail("‍ = []",
        "Unexpected character '‍' (1:0)");

    testFail("\"\\",
        "Unterminated string constant (1:0)");

    testFail("\"\\u",
        "Bad character escape sequence (1:0)");

    testFail("return",
        "'return' outside of function (1:0)");

    testFail("break",
        "Unsyntactic break (1:0)");

    testFail("continue",
        "Unsyntactic continue (1:0)");

    testFail("switch (x) { default: continue; }",
        "Unsyntactic continue (1:22)");

    testFail("do { x } *",
        "Unexpected token (1:9)");

    testFail("while (true) { break x; }",
        "Unsyntactic break (1:15)");

    testFail("while (true) { continue x; }",
        "Unsyntactic continue (1:15)");

    testFail("x: while (true) { (function () { break x; }); }",
        "Unsyntactic break (1:33)");

    testFail("x: while (true) { (function () { continue x; }); }",
        "Unsyntactic continue (1:33)");

    testFail("x: while (true) { (function () { break; }); }",
        "Unsyntactic break (1:33)");

    testFail("x: while (true) { (function () { continue; }); }",
        "Unsyntactic continue (1:33)");

    testFail("x: while (true) { x: while (true) { } }",
        "Label 'x' is already declared (1:18)");

    testFail("(function () { 'use strict'; delete i; }())",
        "Deleting local variable in strict mode (1:29)");

    testFail("function hello() {'use strict'; ({ i: 42, i: 42 }) }",
        "Redefinition of property (1:42)");

    testFail("function hello() {'use strict'; ({ hasOwnProperty: 42, hasOwnProperty: 42 }) }",
        "Redefinition of property (1:55)");

    testFail("function hello() {'use strict'; var eval = 10; }",
        "Binding eval in strict mode (1:36)");

    testFail("function hello() {'use strict'; var arguments = 10; }",
        "Binding arguments in strict mode (1:36)");

    testFail("function hello() {'use strict'; try { } catch (eval) { } }",
        "Binding eval in strict mode (1:47)");

    testFail("function hello() {'use strict'; try { } catch (arguments) { } }",
        "Binding arguments in strict mode (1:47)");

    testFail("function hello() {'use strict'; eval = 10; }",
        "Assigning to eval in strict mode (1:32)");

    testFail("function hello() {'use strict'; arguments = 10; }",
        "Assigning to arguments in strict mode (1:32)");

    testFail("function hello() {'use strict'; ++eval; }",
        "Assigning to eval in strict mode (1:34)");

    testFail("function hello() {'use strict'; --eval; }",
        "Assigning to eval in strict mode (1:34)");

    testFail("function hello() {'use strict'; ++arguments; }",
        "Assigning to arguments in strict mode (1:34)");

    testFail("function hello() {'use strict'; --arguments; }",
        "Assigning to arguments in strict mode (1:34)");

    testFail("function hello() {'use strict'; eval++; }",
        "Assigning to eval in strict mode (1:32)");

    testFail("function hello() {'use strict'; eval--; }",
        "Assigning to eval in strict mode (1:32)");

    testFail("function hello() {'use strict'; arguments++; }",
        "Assigning to arguments in strict mode (1:32)");

    testFail("function hello() {'use strict'; arguments--; }",
        "Assigning to arguments in strict mode (1:32)");

    testFail("function hello() {'use strict'; function eval() { } }",
        "Defining 'eval' in strict mode (1:41)");

    testFail("function hello() {'use strict'; function arguments() { } }",
        "Defining 'arguments' in strict mode (1:41)");

    testFail("function eval() {'use strict'; }",
        "Defining 'eval' in strict mode (1:9)");

    testFail("function arguments() {'use strict'; }",
        "Defining 'arguments' in strict mode (1:9)");

    testFail("function hello() {'use strict'; (function eval() { }()) }",
        "Defining 'eval' in strict mode (1:42)");

    testFail("function hello() {'use strict'; (function arguments() { }()) }",
        "Defining 'arguments' in strict mode (1:42)");

    testFail("(function eval() {'use strict'; })()",
        "Defining 'eval' in strict mode (1:10)");

    testFail("(function arguments() {'use strict'; })()",
        "Defining 'arguments' in strict mode (1:10)");

    testFail("function hello() {'use strict'; ({ s: function eval() { } }); }",
        "Defining 'eval' in strict mode (1:47)");

    testFail("(function package() {'use strict'; })()",
        "Defining 'package' in strict mode (1:10)");

    testFail("function hello() {'use strict'; ({ i: 10, set s(eval) { } }); }",
        "Defining 'eval' in strict mode (1:48)");

    testFail("function hello() {'use strict'; ({ set s(eval) { } }); }",
        "Defining 'eval' in strict mode (1:41)");

    testFail("function hello() {'use strict'; ({ s: function s(eval) { } }); }",
        "Defining 'eval' in strict mode (1:49)");

    testFail("function hello(eval) {'use strict';}",
        "Defining 'eval' in strict mode (1:15)");

    testFail("function hello(arguments) {'use strict';}",
        "Defining 'arguments' in strict mode (1:15)");

    testFail("function hello() { 'use strict'; function inner(eval) {} }",
        "Defining 'eval' in strict mode (1:48)");

    testFail("function hello() { 'use strict'; function inner(arguments) {} }",
        "Defining 'arguments' in strict mode (1:48)");

    testFail("function hello() { 'use strict'; \"\\1\"; }",
        "Octal literal in strict mode (1:34)");

    testFail("function hello() { 'use strict'; 021; }",
        "Invalid number (1:33)");

    testFail("function hello() { 'use strict'; ({ \"\\1\": 42 }); }",
        "Octal literal in strict mode (1:37)");

    testFail("function hello() { 'use strict'; ({ 021: 42 }); }",
        "Invalid number (1:36)");

    testFail("function hello() { \"use strict\"; function inner() { \"octal directive\\1\"; } }",
        "Octal literal in strict mode (1:68)");

    testFail("function hello() { \"use strict\"; var implements; }",
        "The keyword 'implements' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var interface; }",
        "The keyword 'interface' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var package; }",
        "The keyword 'package' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var private; }",
        "The keyword 'private' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var protected; }",
        "The keyword 'protected' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var public; }",
        "The keyword 'public' is reserved (1:37)");

    testFail("function hello() { \"use strict\"; var static; }",
        "The keyword 'static' is reserved (1:37)");

    testFail("function hello(static) { \"use strict\"; }",
        "Defining 'static' in strict mode (1:15)");

    testFail("function static() { \"use strict\"; }",
        "Defining 'static' in strict mode (1:9)");

    testFail("\"use strict\"; function static() { }",
        "The keyword 'static' is reserved (1:23)");

    testFail("function a(t, t) { \"use strict\"; }",
        "Argument name clash in strict mode (1:14)");

    testFail("function a(eval) { \"use strict\"; }",
        "Defining 'eval' in strict mode (1:11)");

    testFail("function a(package) { \"use strict\"; }",
        "Defining 'package' in strict mode (1:11)");

    testFail("function a() { \"use strict\"; function b(t, t) { }; }",
        "Argument name clash in strict mode (1:43)");

    testFail("(function a(t, t) { \"use strict\"; })",
        "Argument name clash in strict mode (1:15)");

    testFail("function a() { \"use strict\"; (function b(t, t) { }); }",
        "Argument name clash in strict mode (1:44)");

    testFail("(function a(eval) { \"use strict\"; })",
        "Defining 'eval' in strict mode (1:12)");

    testFail("(function a(package) { \"use strict\"; })",
        "Defining 'package' in strict mode (1:12)");

    testFail("\"use strict\";function foo(){\"use strict\";}function bar(){var v = 015}",
        "Invalid number (1:65)");

    testFail("var this = 10;", "Unexpected token (1:4)");

    testFail("throw\n10;", "Illegal newline after throw (1:5)");


    // ECMA < 6 mode should work as before

    testFail("const a;", "Unexpected token (1:6)");

    testFail("let x;", "Unexpected token (1:4)");

    testFail("const a = 1;", "Unexpected token (1:6)");

    testFail("let a = 1;", "Unexpected token (1:4)");

    testFail("for(const x = 0;;);", "Unexpected token (1:10)");

    testFail("for(let x = 0;;);", "Unexpected token (1:8)");
    testFail("const a;", "Unexpected token (1:6)", {
        ecmaVersion: 6
    });

    // testFail("for(const x = 0;;);", "Unexpected token (1:4)", {
    //     ecmaVersion: 6
    // });

    testFail("for(x of a);", "Unexpected token (1:6)");

    testFail("for(var x of a);", "Unexpected token (1:10)");
})
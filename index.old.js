import acorn from './acorn/index';
import { babelPolyfill } from './polyfill.js';

const Parser = acorn.parse;

let anonymousId = 0;
const BREAK_SINGAL = {};
const CONTINUE_SINGAL = {};
const RETURN_SINGAL = { result: undefined };
const illegalFun = [setTimeout, setInterval, clearInterval, clearTimeout];

const evaluate_map = {
    Program: (program, scope) => {
        for (const node of program.body) evaluate(node, scope);
    },
    Identifier: (node, scope) => {
        if (node.name === 'undefined') {
            return undefined;
        } // 奇怪的问题
        const $var = scope.$find(node.name);
        if ($var) {
            return $var.$get();
        }
        throw `[Error] 变量'${node.name}' 未定义`;
    },
    Literal: (node) => {
        return node.value;
    },
    BlockStatement: (block, scope) => {
        const new_scope = scope.invasived ? scope : new Scope('block', scope);
        for (const node of block.body) {
            const result = evaluate(node, new_scope);
            if (result === BREAK_SINGAL ||
                result === CONTINUE_SINGAL ||
                result === RETURN_SINGAL) {
                return result;
            }
        }
    },
    EmptyStatement: () => { },
    ExpressionStatement: (node, scope) => {
        evaluate(node.expression, scope);
    },
    ReturnStatement: (node, scope) => {
        RETURN_SINGAL.result = node.argument ? evaluate(node.argument, scope) : undefined;
        return RETURN_SINGAL;
    },
    BreakStatement: () => {
        return BREAK_SINGAL;
    },
    ContinueStatement: () => {
        return CONTINUE_SINGAL;
    },
    IfStatement: (node, scope) => {
        if (evaluate(node.test, scope)) return evaluate(node.consequent, scope);
        else if (node.alternate) return evaluate(node.alternate, scope);
    },
    ForStatement: (node, scope) => {
        for (
            const new_scope = new Scope('loop', scope),
            init_val = node.init ? evaluate(node.init, new_scope) : null;
            node.test ? evaluate(node.test, new_scope) : true;
            node.update ? evaluate(node.update, new_scope) : void (0)
        ) {
            const result = evaluate({ type: 'BlockStatement', body: node.body }, new_scope);
            if (result === BREAK_SINGAL) {
                break;
            } else if (result === CONTINUE_SINGAL) {
                continue;
            } else if (result === RETURN_SINGAL) {
                return result;
            }
        }
    },
    FunctionDeclaration: (node, scope) => {
        const func = evaluate_map.FunctionExpression(node, scope);
        const { name: func_name } = node.id || { name: `anonymous${anonymousId++}` };
        if (!scope.$var(func_name, func)) {
            throw `[Error] ${func_name} 重复定义`;
        }
        return func;
    },
    VariableDeclaration: (node, scope) => {
        const { kind } = node;
        for (const declartor of node.declarations) {
            const { name } = declartor.id;
            const value = declartor.init ? evaluate(declartor.init, scope) : undefined;
            if (!scope.$declar(kind, name, value)) {
                throw `[Error] ${name} 重复定义`;
            }
        }
    },
    ThisExpression: (node, scope) => {
        const this_val = scope.$find('this');
        return this_val ? this_val.$get() : null;
    },
    ArrayExpression: (node, scope) => {
        return node.elements.map(item => evaluate(item, scope));
    },
    ObjectExpression: (node, scope) => {
        const object = {};
        for (const property of node.properties) {
            const { kind } = property;
            let key;
            if (property.key.type === 'Literal') {
                key = evaluate(property.key, scope);
            } else if (property.key.type === 'Identifier') {
                key = property.key.name;
            }
            const value = evaluate(property.value, scope);
            if (kind === 'init') {
                object[key] = value;
            } else if (kind === 'set') {
                Object.defineProperty(object, key, { set: value });
            } else if (kind === 'get') {
                Object.defineProperty(object, key, { get: value });
            }
        }
        return object;
    },

    FunctionExpression: (node, scope) => {
        function func(...args) {
            const new_scope = new Scope('function', scope);
            new_scope.invasived = true;
            for (let i = 0; i < node.params.length; i++) {
                const { name } = node.params[i];
                new_scope.$const(name, args[i]);
            }
            new_scope.$const('this', this);
            new_scope.$const('arguments', arguments);
            const result = evaluate(node.body, new_scope);
            if (result === RETURN_SINGAL) {
                return result.result;
            }
        };
        // 手动矫正func length
        Object.defineProperty(func, "length", { value: node.params.length });
        return func;
    },
    UnaryExpression: (node, scope) => {
        return ({
            '-': () => -evaluate(node.argument, scope),
            '+': () => +evaluate(node.argument, scope),
            '!': () => !evaluate(node.argument, scope),
            '~': () => ~evaluate(node.argument, scope),
            'void': () => void evaluate(node.argument, scope),
            'typeof': () => {
                if (node.argument.type === 'Identifier') {
                    const $var = scope.$find(node.argument.name)
                    return $var ? typeof $var.$get() : 'undefined'
                } else {
                    return typeof evaluate(node.argument, scope)
                }
            },
            'delete': () => {
                if (node.argument.type === 'MemberExpression') {
                    const { object, property, computed } = node.argument
                    if (computed) {
                        return delete evaluate(object, scope)[evaluate(property, scope)]
                    } else {
                        return delete evaluate(object, scope)[(property).name]
                    }
                } else if (node.argument.type === 'Identifier') {
                    const $this = scope.$find('this')
                    if ($this) return $this.$get()[node.argument.name]
                }
            }
        })[node.operator]();
    },
    UpdateExpression: (node, scope) => {
        const { prefix } = node;
        let $var;
        if (node.argument.type === 'Identifier') {
            const { name } = node.argument;
            $var = scope.$find(name);
            if (!$var) throw `${name} 未定义`;
        } else if (node.argument.type === 'MemberExpression') {
            const { argument } = node;
            const object = evaluate(argument.object, scope);
            const property = argument.computed
                ? evaluate(argument.property, scope)
                : (argument.property).name;
            $var = {
                $set(value) {
                    object[property] = value;
                    return true;
                },
                $get() {
                    return object[property];
                },
            };
        }
        return ({
            '--': v => ($var.$set(v - 1), (prefix ? --v : v--)),
            '++': v => ($var.$set(v + 1), (prefix ? ++v : v++)),
        })[node.operator](evaluate(node.argument, scope));
    },

    BinaryExpression: (node, scope) => {
        return ({
            '==': (a, b) => a == b,
            '!=': (a, b) => a != b,
            '===': (a, b) => a === b,
            '!==': (a, b) => a !== b,
            '<': (a, b) => a < b,
            '<=': (a, b) => a <= b,
            '>': (a, b) => a > b,
            '>=': (a, b) => a >= b,
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => a % b,
            '|': (a, b) => a | b,
            '^': (a, b) => a ^ b,
            '&': (a, b) => a & b,
            in: (a, b) => a in b,
            instanceof: (a, b) => a instanceof b,
        })[node.operator](evaluate(node.left, scope), evaluate(node.right, scope));
    },

    AssignmentExpression: (node, scope) => {
        let $var;
        if (node.left.type === 'Identifier') {
            const { name } = node.left;
            const $var_or_not = scope.$find(name);
            if (!$var_or_not) throw `${name} 未定义`;
            $var = $var_or_not;
        } else if (node.left.type === 'MemberExpression') {
            const { left } = node;
            const object = evaluate(left.object, scope);
            const property = left.computed
                ? evaluate(left.property, scope)
                : (left.property).name;
            $var = {
                $set(value) {
                    object[property] = value;
                    return true;
                },
                $get() {
                    return object[property];
                },
            };
        } else {
            throw '如果出现在这里，那就说明有问题了';
        }

        return ({
            '=': (v) => ($var.$set(v), v),
            '+=': (v) => ($var.$set($var.$get() + v), $var.$get()),
            '-=': (v) => ($var.$set($var.$get() - v), $var.$get()),
            '*=': (v) => ($var.$set($var.$get() * v), $var.$get()),
            '/=': (v) => ($var.$set($var.$get() / v), $var.$get()),
            '%=': (v) => ($var.$set($var.$get() % v), $var.$get()),
            '|=': (v) => ($var.$set($var.$get() | v), $var.$get()),
            '^=': (v) => ($var.$set($var.$get() ^ v), $var.$get()),
            '&=': (v) => ($var.$set($var.$get() & v), $var.$get()),
        })[node.operator](evaluate(node.right, scope));
    },

    LogicalExpression: (node, scope) => {
        return ({
            '||': () => evaluate(node.left, scope) || evaluate(node.right, scope),
            '&&': () => evaluate(node.left, scope) && evaluate(node.right, scope),
        })[node.operator]();
    },

    MemberExpression: (node, scope) => {
        const { object, property, computed } = node;
        if (computed) {
            return evaluate(object, scope)[evaluate(property, scope)];
        }
        return evaluate(object, scope)[(property).name];
    },

    ConditionalExpression: (node, scope) => {
        return (
            evaluate(node.test, scope)
                ? evaluate(node.consequent, scope)
                : evaluate(node.alternate, scope)
        );
    },

    CallExpression: (node, scope) => {
        let this_val = null;
        let func = null;
        // fix: ww().ww().ww()
        if (node.callee.type === 'MemberExpression') {
            const { object, property, computed } = node.callee;
            this_val = evaluate(object, scope);
            const funcName = !computed ? property.name : evaluate_map[property.type](property, scope);
            func = this_val[funcName];
            if (illegalFun.includes(func)) this_val = null;
        } else {
            this_val = scope.$find('this').$get();
            func = evaluate(node.callee, scope);
            // fix: setTimeout.apply({}, '');
            if (illegalFun.includes(func)) this_val = null;
        }
        return func.apply(this_val, node.arguments.map(arg => evaluate(arg, scope)));
    },
    NewExpression: (node, scope) => {
        const Func = evaluate(node.callee, scope);
        const args = node.arguments.map(arg => evaluate(arg, scope));
        return new Func(...args);
    },
    SequenceExpression: (node, scope) => {
        let last;
        for (const expr of node.expressions) {
            last = evaluate(expr, scope);
        }
        return last;
    },
    ThrowStatement: (node, scope) => {
        throw evaluate(node.argument, scope)
    },

    TryStatement: (node, scope) => {
        try {
            return evaluate(node.block, scope)
        } catch (err) {
            if (node.handler) {
                const param = node.handler.param
                const new_scope = new Scope('block', scope)
                new_scope.invasived = true // 标记为侵入式Scope，不用再多构造啦
                new_scope.$const(param.name, err)
                return evaluate(node.handler, new_scope)
            } else {
                throw err
            }
        } finally {
            if (node.finalizer)
                return evaluate(node.finalizer, scope)
        }
    },

    CatchClause: (node, scope) => {
        return evaluate(node.body, scope)
    },
};

class ScopeVar {
    constructor(kind, value) {
        this.value = value;
        this.kind = kind;
    }
    $set(value) {
        if (this.value === 'const') {
            return false;
        }
        this.value = value;
        return true;
    }
    $get() {
        return this.value;
    }
}

class Scope {
    constructor(type, parent) {
        this.type = type;
        this.parent = parent || null;
        this.content = {};
        this.invasived = false;
        this.prefix = '';
    }

    $find(raw_name) {
        const name = this.prefix + raw_name;
        if (this.content.hasOwnProperty(name)) {
            return this.content[name];
        } else if (this.parent) {
            return this.parent.$find(raw_name);
        }
        return null;
    }

    $let(raw_name, value) {
        const name = this.prefix + raw_name;
        const $var = this.content[name];
        if (!$var) {
            this.content[name] = new ScopeVar('let', value);
            return true;
        } return false;
    }

    $const(raw_name, value) {
        const name = this.prefix + raw_name;
        const $var = this.content[name];
        if (!$var) {
            this.content[name] = new ScopeVar('const', value);
            return true;
        } return false;
    }

    $var(raw_name, value) {
        const name = this.prefix + raw_name;
        let scope = this;

        while (scope.parent !== null && scope.type !== 'function') {
            scope = scope.parent;
        }

        const $var = scope.content[name];
        if (!$var) {
            this.content[name] = new ScopeVar('var', value);
            return true;
        } return false;
    }
    $declar(kind, raw_name, value) {
        return ({
            var: () => this.$var(raw_name, value),
            let: () => this.$let(raw_name, value),
            const: () => this.$const(raw_name, value),
        })[kind]();
    }
}
// 记录每条语句的id
let traceId = 0;
// 记录执行栈
const traceStack = [];
// 正在执行的语句
let runingCode = '';

const findErrorCode = (pos) => {
    if (!pos) return runingCode;
    pos = pos < 0 ? -1 : pos;
    let headPos = pos;
    let endPos = pos;
    let headCount = 0;
    let endCount = 0;
    const endFlag = runingCode.length - 1;
    const res = [0, endFlag];
    while (!(headPos === -1 && endPos === endFlag)) {
        if (headPos !== -1) {
            // ; \r
            if ([59, 19].includes(runingCode[headPos].charCodeAt())) {
                if (headCount === 2) {
                    res[0] = headPos + 1;
                    headPos = -1;
                } else {
                    headCount++;
                    headPos++;
                }
            } else {
                headPos !== -1 && headPos--;
            }
        }
        if (endPos !== endFlag) {
            if ([59, 19].includes(runingCode[endPos].charCodeAt())) {
                if (endCount === 2) {
                    res[1] = endPos;
                    endPos = endFlag;
                } else {
                    endCount++;
                    endPos++;
                }
            } else {
                endPos++;
            }
        }
    }
    const errorCode = runingCode.slice(res[0], res[1]);
    const repeatNum = res[1] - res[0];
    return `${errorCode}\n${'^'.repeat(repeatNum > 40 ? 40 : repeatNum)}`;
};

const evaluate = (node, scope, arg) => {
    const thisId = traceId++;
    const error = (err) => {
        // console.log(err, thisId, traceId, traceStack)
        // 栈顶的id等于当前id，说明是当前语句
        if (traceStack[traceStack.length - 1] === thisId && err) {
            console.error(`[naruse-parser] 错误代码\n${findErrorCode(node.end - 3)}`);
            err && console.error('[naruse-parser] 错误信息', err);
            throw new Error('[naruse-parser] 代码执行错误！');
        }
    };
    traceStack.push(thisId);
    const _evalute = evaluate_map[node.type] || error();
    try {
        const res = _evalute(node, scope, arg);
        traceStack.pop();
        return res;
    } catch (e) {
        error(e);
    }
};

// 导出默认对象
const default_api = {
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    encodeURI,
    encodeURIComponent,
    decodeURI,
    decodeURIComponent,
    Infinity,
    NaN,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    Object,
    Boolean,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    Number,
    Math,
    Date,
    String,
    RegExp,
    Array,
    JSON,
    Promise,
};

Object.assign(default_api, babelPolyfill);

export const run = (code, append_api = {}) => {
    runingCode = code;
    traceStack.length = 0;
    const scope = new Scope('block');
    scope.$const('this', this);
    for (const name of Object.getOwnPropertyNames(default_api)) {
        scope.$const(name, default_api[name]);
    }
    for (const name of Object.getOwnPropertyNames(append_api)) {
        scope.$const(name, append_api[name]);
    }
    const $exports = {};
    scope.$const('exports', $exports);
    const parser = new node;
    evaluate(node, scope);
    return $exports;
};

export default run;
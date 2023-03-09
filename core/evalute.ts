import type estree from 'estree'
import {
    Identifier,
    Literal,
    Property,
    Program,
    FunctionDeclaration,
    FunctionExpression,
    ExpressionStatement,
    ObjectPattern,
    ArrayPattern,
    AssignmentPattern,
    ObjectExpression,
    ArrayExpression,
    AssignmentExpression,
    MemberExpression,
    RestElement,
    SpreadElement,
    DoWhileStatement,
    DebuggerStatement,
    ContinueStatement,
    BreakStatement,
    CallExpression,
    YieldExpression,
    ImportBatchSpecifier,
    ImportSpecifier,
    ImportDeclaration,
    ExportSpecifier,
    ExportBatchSpecifier,
    ExportDeclaration,
    ClassDeclaration,
    ClassExpression,
    ClassBody,
    TemplateElement,
    ArrowFunctionExpression,
    TemplateLiteral,
    MethodDefinition,
    SequenceExpression,
    ParenthesizedExpression,
    NewExpression,
    UpdateExpression,
    BinaryExpression,
    LogicalExpression,
    UnaryExpression,
    VariableDeclaration,
    IfStatement,
    ReturnStatement,
    SwitchCase,
    SwitchStatement,
    ThrowStatement,
    TaggedTemplateExpression,
    TryStatement,
    CatchClause,
    WhileStatement,
    EmptyStatement,
    LabeledStatement,
    BlockStatement,
    ForInStatement,
    ForOfStatement,
    ForStatement,
    VariableDeclarator,
    ThisExpression,
    ConditionalExpression,
    ImportExpression
} from '../expressionType/index'
import { createError, errorMessageList, EvaluateError } from './error';
import { BREAK_SIGNAL, CONTINUE_SIGNAL, RETURN_SIGNAL, YIELD_SIGNAL, isGeneratorFunction, isYieldResult, isReturnResult, isContinueResult, isBreakResult, isPromoteStatement, isVarPromoteStatement } from './signal';
import { Scope, Kind, indexGeneratorStackDecorate } from './scope';

let anonymousId = 0;
let thisRunner: { source: string, currentNode: any, traceId: number, traceStack: any[], onError?: (err: EvaluateError) => void };

const illegalFun = [setTimeout, setInterval, clearInterval, clearTimeout];

const isUndefinedOrNull = (val: any) => val === void 0 || val === null;

interface baseMap {
    [key: string]: Function
}

type BodyNodes = (estree.Statement | estree.ModuleDeclaration | estree.Statement)[];


/** 
 * 提炼 for语句中的变量提升
 * k: 语句
 * v: 对应的属性名
 */
const RefineForPromoteNameMap = {
    [ForStatement]: 'init',
    [ForInStatement]: 'left',
    [ForOfStatement]: 'left'
}

/**
 * 提炼非函数声明语句，并执行函数声明语句 与 初始化 var 变量
 */
const refinePromteStatements = (nodes: BodyNodes, scope: Scope): BodyNodes => {
    const nonPromoteList: BodyNodes = [];
    for (const node of nodes) {
        // function 声明语句 提升到作用域顶部直接执行
        if (isPromoteStatement(node)) {
            evaluate(node, scope);
        } else {
            // 如果是 var 则需要先声明变量为 undefined
            if (isVarPromoteStatement(node)) evaluate_map[VariableDeclaration](node, scope, true);
            // for,forin,forof 循环中的 var 声明语句也需要提升
            if (RefineForPromoteNameMap[node.type]) {
                const initNode = node[RefineForPromoteNameMap[node.type]];
                if (isVarPromoteStatement(initNode)) evaluate_map[VariableDeclaration](initNode, scope, true);
            }
            nonPromoteList.push(node);
        }
    }
    return nonPromoteList;
}


const evaluate_map: baseMap = {
    [Program]: function (program: estree.Program, scope: Scope) {
        const list = program.body;
        const nonFunctionList = refinePromteStatements(list, scope);
        for (const node of nonFunctionList) evaluate(node, scope);
    },
    [Identifier]: function (node: estree.Identifier, scope: Scope) {
        if (node.name === 'undefined') {
            return undefined;
        }
        const $var = scope.$find(node.name);
        if ($var) {
            return $var.$get();
        }
        throw createError(errorMessageList.notYetDefined, node.name, node, thisRunner.source);
    },
    [Literal]: function (node: estree.Literal) {
        return node.value;
    },
    [BlockStatement]: (block: estree.BlockStatement, scope: Scope) => {
        return indexGeneratorStackDecorate((stackData) => {
            const new_scope = scope.invasive ? scope : new Scope('block', scope);
            const list = block.body;
            // 非 function 声明语句
            const nonFunctionList = refinePromteStatements(list, new_scope);
            for (; stackData.index < nonFunctionList.length; stackData.index++) {
                const node = nonFunctionList[stackData.index];
                const result = evaluate(node, new_scope);
                if (
                    isYieldResult(scope, result)
                    || isReturnResult(result)
                    || isContinueResult(result)
                    || isBreakResult(result)
                ) return result;
            }
        }, scope);
    },
    [EmptyStatement]: () => { },
    [ExpressionStatement]: function (node: estree.ExpressionStatement, scope: Scope) {
        return evaluate(node.expression, scope);
    },
    [ReturnStatement]: function (node: estree.ReturnStatement, scope: Scope) {
        RETURN_SIGNAL.result = node.argument ? evaluate(node.argument, scope) : undefined;
        return RETURN_SIGNAL;
    },
    [BreakStatement]: () => {
        return BREAK_SIGNAL;
    },
    [ContinueStatement]: () => {
        return CONTINUE_SIGNAL;
    },
    [IfStatement]: function (node: estree.IfStatement, scope: Scope) {
        if (evaluate(node.test, scope)) return evaluate(node.consequent, scope);
        else if (node.alternate) return evaluate(node.alternate, scope);
    },
    [ForStatement]: function (node: estree.ForStatement, scope: Scope) {
        for (
            const new_scope = new Scope('loop', scope),
            // 只有 var 变量才会被提高到上一作用域
            init_val = node.init ? evaluate(node.init, isVarPromoteStatement(node.init) ? scope : new_scope) : null;
            node.test ? evaluate(node.test, new_scope) : true;
            node.update ? evaluate(node.update, new_scope) : void (0)
        ) {
            const result = evaluate(node.body, new_scope);
            if (isReturnResult(result)) return result;
            else if (isContinueResult(result)) continue;
            else if (isBreakResult(result)) break;
        }
    },
    [FunctionDeclaration]: function (node: estree.FunctionDeclaration, scope: Scope) {
        const func = evaluate_map[FunctionExpression](node, scope);
        const { name: func_name } = node.id || { name: `anonymous${anonymousId++}` };
        if (!scope.$var(func_name, func)) {
            throw createError(errorMessageList.duplicateDefinition, func_name, node, thisRunner.source);
        }
        return func;
    },
    [VariableDeclaration]: function (node: estree.VariableDeclaration, scope: Scope, isVarPromote = false) {
        const { kind } = node;
        return indexGeneratorStackDecorate((stackData) => {
            const list = node.declarations;
            for (; stackData.index < list.length; stackData.index++) {
                const declaration = list[stackData.index];
                const { id, init } = declaration;
                // 如果是变量提升语句，需要先声明一个 undefined 变量，等待后续的重新赋值语句
                const value = !isVarPromote && init ? evaluate(init, scope) : undefined;
                // 迭代器变量中断
                if (isYieldResult(scope, value)) return value;
                // 正常流程
                if (id.type === Identifier) {
                    const { name } = id as estree.Identifier;
                    if (!scope.$declar(kind, name, value)) {
                        throw createError(errorMessageList.duplicateDefinition, name, node, thisRunner.source);
                    }
                } else {
                    const result = evaluate_map[id.type](id, scope, kind, value);
                    if (isYieldResult(scope, result)) return result;
                }
            }
        }, scope)

    },
    [ArrayPattern]: function (node: estree.ArrayPattern, scope: Scope, kind?: Kind, value?: any[]) {
        const { elements } = node;
        if (!Array.isArray(value)) {
            throw createError(errorMessageList.deconstructNotArray, value, node, thisRunner.source);
        }
        elements.forEach((element, index) => {
            if (!element) return;
            if (element.type === Identifier) {
                const { name } = element as estree.Identifier;
                if (!scope.$declar(kind as Kind, name, value[index])) {
                    throw createError(errorMessageList.duplicateDefinition, name, node, thisRunner.source);
                }
            } else {
                evaluate_map[element.type](element, scope, kind, value[index]);
            }
        })
    },
    [ObjectPattern]: function (node: estree.ObjectPattern, scope: Scope, kind?: Kind, object?: any) {
        const { properties } = node;
        properties.forEach(property => {
            if (property.type === Property) {
                const { key, value, computed } = property as unknown as estree.Property;
                const newKey = computed ? evaluate(key, scope) : (key as any).name;
                if (value.type === Identifier) {
                    const { name } = value as estree.Identifier;
                    if (!scope.$declar(kind as Kind, name, object[newKey])) {
                        throw createError(errorMessageList.duplicateDefinition, name, node, thisRunner.source);
                    }
                } else {
                    evaluate_map[value.type](value, scope, kind, object[newKey]);
                }
            }
        })
    },
    [AssignmentPattern]: function (node: estree.AssignmentPattern, scope: Scope, kind?: Kind, init?: any) {
        const { left, right } = node;
        const value = init === void 0 ? evaluate(right, scope) : init;
        if (left.type === Identifier) {
            const { name } = left as estree.Identifier;
            if (!scope.$declar(kind as Kind, name, value)) {
                throw createError(errorMessageList.duplicateDefinition, name, node, thisRunner.source);
            }
        } else {
            evaluate_map[left.type](left, scope, kind, value);
        }
    },
    [ThisExpression]: function (node: estree.ThisExpression, scope: Scope) {
        const this_val = scope.$find('this');
        return this_val ? this_val.$get() : null;
    },
    [ArrayExpression]: function (node: estree.ArrayExpression, scope: Scope) {
        return node.elements.map(item => item ? evaluate(item, scope) : null);
    },
    [ObjectExpression]: function (node: estree.ObjectExpression, scope: Scope) {
        const object: Record<any, any> = {};
        for (const property of node.properties) {
            if (property.type === Property) {
                const { kind, computed } = property;
                // fix: { 1: 1 }
                let key;
                if (property.key.type === Literal || computed) {
                    key = evaluate(property.key, scope);
                } else if (property.key.type === Identifier) {
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
            } else {
                throw createError(errorMessageList.notSupportNode, property.type, node, thisRunner.source);
            }
        }
        return object;
    },
    [FunctionExpression]: function (node: estree.FunctionExpression, scope: Scope, isArrowFunction = false) {
        let func;
        if (node.generator) {
            func = function (this: any, ...args: any[]) {
                const new_scope = new Scope('function', scope, true);
                new_scope.invasive = true;
                node.params.forEach((param, index) => {
                    if (param.type === Identifier) {
                        const { name } = param as estree.Identifier;
                        new_scope.$var(name, args[index]);
                    } else {
                        evaluate_map[param.type](param, new_scope, 'var', args[index]);
                    }
                })
                new_scope.$const('this', this);
                new_scope.$const('arguments', arguments);
                let completed = false;
                const next = (arg: any) => {
                    if (completed) return { value: undefined, done: true };
                    new_scope.generatorStack?.pushValue(arg);
                    const result = evaluate(node.body, new_scope);
                    if (isYieldResult(new_scope, result)) {
                        return { value: result.result, done: false };
                    }
                    if (isReturnResult(result)) {
                        completed = true;
                        return { value: result.result, done: true };
                    }
                }
                return { next };
            }
        } else {
            func = function (this: any, ...args: any[]) {
                const new_scope = new Scope('function', scope);
                new_scope.invasive = true;
                node.params.forEach((param, index) => {
                    if (param.type === Identifier) {
                        const { name } = param as estree.Identifier;
                        new_scope.$var(name, args[index]);
                    } else {
                        evaluate_map[param.type](param, new_scope, 'var', args[index]);
                    }
                })
                let result;
                if (isArrowFunction) {
                    const parent_scope = scope.$find('this').$get();
                    new_scope.$const('this', parent_scope ? parent_scope : null);
                    result = evaluate(node.body, new_scope);
                    if (node.body.type !== BlockStatement) {
                        return result;
                    }
                } else {
                    new_scope.$const('this', this);
                    new_scope.$const('arguments', arguments);
                    result = evaluate(node.body, new_scope);
                }
                if (result === RETURN_SIGNAL) {
                    return result.result;
                }
            };
        }
        // 箭头函数的prototype属性指向的是父函数的prototype属性
        if (isArrowFunction) {
            Object.defineProperty(func, "prototype", { value: undefined });
        }

        // 矫正属性
        Object.defineProperty(func, "length", { value: node.params.length });
        // @ts-ignore
        Object.defineProperty(func, "toString", { value: () => thisRunner.source.slice(node.start, node.end), configurable: true });
        return func;
    },
    [UnaryExpression]: function (node: estree.UnaryExpression, scope: Scope) {
        const sk = 'typeof';
        return ({
            '-': () => -evaluate(node.argument, scope),
            '+': () => +evaluate(node.argument, scope),
            '!': () => !evaluate(node.argument, scope),
            '~': () => ~evaluate(node.argument, scope),
            'void': () => void evaluate(node.argument, scope),
            'delete': () => {
                if (node.argument.type === MemberExpression) {
                    const { object, property, computed } = node.argument as estree.MemberExpression;
                    if (computed) {
                        return delete evaluate(object, scope)[evaluate(property, scope)]
                    } else {
                        // @ts-ignore
                        return delete evaluate(object, scope)[(property).name]
                    }
                } else if (node.argument.type === Identifier) {
                    const $this = scope.$find('this')
                    // @ts-ignore
                    if ($this) return $this.$get()[node.argument.name]
                }
            },
            // 部分老版本 babel 会将 typeof 函数修改为同名的 _typeof 函数，导致循环调用最后栈溢出
            // 使用特殊的 key 来区分
            [sk]: () => {
                if (node.argument.type === Identifier) {
                    const $var = scope.$find((node.argument as estree.Identifier).name)
                    return $var ? typeof $var.$get() : 'undefined'
                } else {
                    return typeof evaluate(node.argument, scope)
                }
            },
        })[node.operator]();
    },
    [UpdateExpression]: function (node: estree.UpdateExpression, scope: Scope) {
        const { prefix } = node;
        let $var: { $set: any; $get?: () => any; };
        if (node.argument.type === Identifier) {
            const { name } = node.argument;
            $var = scope.$find(name);
            if (!$var) throw createError(errorMessageList.notYetDefined, name, node, thisRunner.source);
        } else if (node.argument.type === MemberExpression) {
            const { argument } = node;
            const object = evaluate(argument.object, scope);
            const property = argument.computed
                ? evaluate(argument.property, scope)
                : (argument.property).name;
            $var = {
                $set(value: any) {
                    object[property] = value;
                    return true;
                },
                $get() {
                    return object[property];
                },
            };
        }
        return ({
            '--': (v: number) => ($var.$set(v - 1), (prefix ? --v : v--)),
            '++': (v: number) => ($var.$set(v + 1), (prefix ? ++v : v++)),
        })[node.operator](evaluate(node.argument, scope));
    },
    [BinaryExpression]: function (node: estree.BinaryExpression, scope: Scope) {
        return ({
            '==': (a: any, b: any) => a == b,
            '!=': (a: any, b: any) => a != b,
            '===': (a: any, b: any) => a === b,
            '!==': (a: any, b: any) => a !== b,
            '<': (a: number, b: number) => a < b,
            '<=': (a: number, b: number) => a <= b,
            '>': (a: number, b: number) => a > b,
            '>=': (a: number, b: number) => a >= b,
            '+': (a: any, b: any) => a + b,
            '-': (a: number, b: number) => a - b,
            '*': (a: number, b: number) => a * b,
            '**': (a: number, b: number) => a ** b,
            '/': (a: number, b: number) => a / b,
            '%': (a: number, b: number) => a % b,
            '|': (a: number, b: number) => a | b,
            '^': (a: number, b: number) => a ^ b,
            '&': (a: number, b: number) => a & b,
            '<<': (a: number, b: number) => a << b,
            '>>': (a: number, b: number) => a >> b,
            '>>>': (a: number, b: number) => a >>> b,
            in: (a: string, b: any) => a in b,
            instanceof: (a: any, b: any) => a instanceof b,
        })[node.operator](evaluate(node.left, scope), evaluate(node.right, scope));
    },

    [AssignmentExpression]: function (node: estree.AssignmentExpression, scope: Scope) {
        let $var: { $set: any; $get: any; };
        const { left } = node;
        if (left.type === Identifier) {
            const { name } = left as unknown as estree.Identifier;
            const $var_or_not = scope.$find(name);
            if (!$var_or_not) throw createError(errorMessageList.notYetDefined, name, node, thisRunner.source);
            $var = $var_or_not;
        } else if (left.type === MemberExpression) {
            const { object, property, computed } = left as unknown as estree.MemberExpression;
            const newObject = evaluate(object, scope);
            const newProperty = computed
                ? evaluate(property, scope)
                : property.name;
            $var = {
                $set(value: any) {
                    newObject[newProperty] = value;
                    return true;
                },
                $get() {
                    return newObject[newProperty];
                },
            };
        } else {
            throw createError(errorMessageList.notSupportNode, left.type, node, thisRunner.source);
        }

        return ({
            '=': (v: any) => ($var.$set(v), v),
            '+=': (v: any) => ($var.$set($var.$get() + v), $var.$get()),
            '-=': (v: number) => ($var.$set($var.$get() - v), $var.$get()),
            '*=': (v: number) => ($var.$set($var.$get() * v), $var.$get()),
            '**=': (v: number) => ($var.$set($var.$get() ** v), $var.$get()),
            '/=': (v: number) => ($var.$set($var.$get() / v), $var.$get()),
            '%=': (v: number) => ($var.$set($var.$get() % v), $var.$get()),
            '|=': (v: number) => ($var.$set($var.$get() | v), $var.$get()),
            '<<=': (v: number) => ($var.$set($var.$get() << v), $var.$get()),
            '>>=': (v: number) => ($var.$set($var.$get() >> v), $var.$get()),
            '>>>=': (v: number) => ($var.$set($var.$get() >>> v), $var.$get()),
            '^=': (v: number) => ($var.$set($var.$get() ^ v), $var.$get()),
            '&=': (v: number) => ($var.$set($var.$get() & v), $var.$get()),
        })[node.operator](evaluate(node.right, scope));
    },

    [LogicalExpression]: function (node: estree.LogicalExpression, scope: Scope) {
        return ({
            '||': () => evaluate(node.left, scope) || evaluate(node.right, scope),
            '&&': () => evaluate(node.left, scope) && evaluate(node.right, scope),
            '??': () => evaluate(node.left, scope) ?? evaluate(node.right, scope),
        })[node.operator]();
    },

    [MemberExpression]: function (node: estree.MemberExpression, scope: Scope) {
        const { object, property, computed } = node;
        if (computed) {
            return evaluate(object, scope)[evaluate(property, scope)];
        }
        return evaluate(object, scope)[property.name];
    },
    [ConditionalExpression]: function (node: estree.ConditionalExpression, scope: Scope) {
        return (
            evaluate(node.test, scope)
                ? evaluate(node.consequent, scope)
                : evaluate(node.alternate, scope)
        );
    },
    [CallExpression]: function (node: estree.CallExpression, scope: Scope) {
        let this_val = null;
        let func = null;
        // fix: ww().ww().ww()
        if (node.callee.type === MemberExpression) {
            const { object, property, computed } = (node.callee) as estree.MemberExpression;
            this_val = evaluate(object, scope);
            // @ts-ignore
            const funcName = !computed ? property.name : evaluate_map[property.type](property, scope);
            if (isUndefinedOrNull(this_val)) throw createError(errorMessageList.notHasSomeProperty, funcName, node, thisRunner.source);
            func = this_val[funcName];
        } else {
            this_val = scope.$find('this').$get();
            func = evaluate(node.callee, scope);
        }
        if (typeof func !== 'function') throw createError(errorMessageList.notCallableFunction, func, node, thisRunner.source);
        // fix: setTimeout.apply({}, '');
        if (illegalFun.includes(func)) this_val = null;
        return func.apply(this_val, node.arguments.map(arg => evaluate(arg, scope)));
    },
    [NewExpression]: function (node: estree.NewExpression, scope: Scope) {
        const Func = evaluate(node.callee, scope);
        const args = node.arguments.map(arg => evaluate(arg, scope));
        return new Func(...args);
    },
    [SequenceExpression]: function (node: estree.SequenceExpression, scope: Scope) {
        let last;
        for (const expr of node.expressions) {
            last = evaluate(expr, scope);
        }
        return last;
    },
    [ThrowStatement]: function (node: estree.ThrowStatement, scope: Scope) {
        throw evaluate(node.argument, scope)
    },
    [TryStatement]: function (node: estree.TryStatement, scope: Scope) {
        try {
            return evaluate(node.block, scope)
        } catch (err) {
            if (node.handler) {
                const { param } = node.handler
                const new_scope = new Scope('block', scope)
                new_scope.invasive = true
                new_scope.$const(param?.name, err)
                return evaluate(node.handler, new_scope)
            } else {
                throw err
            }
        } finally {
            if (node.finalizer)
                return evaluate(node.finalizer, scope)
        }
    },
    [CatchClause]: function (node: estree.CatchClause, scope: Scope): any {
        return evaluate(node.body, scope)
    },
    [SwitchStatement]: function (node: estree.SwitchStatement, scope: Scope) {
        const discriminant = evaluate(node.discriminant, scope)
        const new_scope = new Scope('switch', scope)

        let matched = false

        for (const $case of node.cases) {

            // 进行匹配相应的 case
            if (!matched &&
                (!$case.test || discriminant === evaluate($case.test, new_scope))) {
                matched = true
            }

            if (matched) {
                const result = evaluate($case, new_scope)
                if (isBreakResult(result)) { break }
                else if (isReturnResult(result) || isContinueResult(result)) { return result }
            }
        }
    },
    [SwitchCase]: function (node: estree.SwitchCase, scope: Scope) {
        for (const stmt of node.consequent) {
            const result = evaluate(stmt, scope)
            if (isReturnResult(result) || isBreakResult(result) || isContinueResult(result)) {
                return result
            }
        }
    },
    [WhileStatement]: function (node: estree.WhileStatement, scope: Scope) {
        while (evaluate(node.test, scope)) {
            const new_scope = new Scope('loop', scope)
            new_scope.invasive = true
            const result = evaluate(node.body, new_scope)

            if (isBreakResult(result)) { break }
            else if (isContinueResult(result)) { continue }
            else if (isReturnResult(result)) { return result }
        }
    },
    [DoWhileStatement]: function (node: estree.DoWhileStatement, scope: Scope) {
        do {
            const new_scope = new Scope('loop', scope)
            new_scope.invasive = true
            const result = evaluate(node.body, new_scope)
            if (result === BREAK_SIGNAL) { break }
            else if (result === CONTINUE_SIGNAL) { continue }
            else if (result === RETURN_SIGNAL) { return result }
        } while (evaluate(node.test, scope))
    },
    [ArrowFunctionExpression]: function (node: estree.ArrowFunctionExpression, scope: Scope) {
        return evaluate_map[FunctionExpression](node, scope, true);
    },
    [ForInStatement]: function (node: estree.ForInStatement, scope: Scope, isForOf: boolean = false) {
        const kind = (<estree.VariableDeclaration>node.left).kind
        const id = (<estree.VariableDeclaration>node.left).declarations[0].id;

        const forInit = (value: any) => {
            const new_scope = new Scope('loop', scope)
            new_scope.invasive = true
            if (id.type === Identifier) {
                const name = (<estree.Identifier>id).name
                new_scope.$declar(kind, name, value)
            } else {
                evaluate_map[id.type](id, new_scope, kind, value)
            }
            return evaluate(node.body, new_scope);
        }

        const init = evaluate(node.right, scope);
        if (isForOf) {
            for (let index = 0; index < init.length; index++) {
                const result = forInit(init[index]);
                if (result === BREAK_SIGNAL) { break }
                else if (result === CONTINUE_SIGNAL) { continue }
                else if (result === RETURN_SIGNAL) { return result }
            }
        } else {
            for (const value in init) {
                const result = forInit(value);
                if (result === BREAK_SIGNAL) { break }
                else if (result === CONTINUE_SIGNAL) { continue }
                else if (result === RETURN_SIGNAL) { return result }
            }
        }
    },
    [TemplateLiteral]: function (node: estree.TemplateLiteral, scope: Scope) {
        const result = node.quasis.map((quasi, index) => {
            if (!quasi.tail) return quasi.value.raw + evaluate(node.expressions[index], scope)
            return quasi.value.raw;
        });
        return result.join('');
    },
    [ImportExpression]: function (node: estree.ImportExpression, scope: Scope) {
        const source = evaluate(node.source, scope)
        const importer = scope.$find('$$import');
        if (!importer) throw createError(errorMessageList.notHasImport, '$$import', node, thisRunner.source);
        return importer.$get()(source);
    },
    [ForOfStatement]: function (node: estree.ForOfStatement, scope: Scope) {
        return evaluate_map[ForInStatement](node, scope, true)
    },
    [YieldExpression]: function (node: estree.YieldExpression, scope: Scope) {
        if (!isGeneratorFunction(scope)) throw createError(errorMessageList.notGeneratorFunction, '', node, thisRunner.source);
        const value = scope.generatorStack?.getValue();
        if (value) return value.value;
        YIELD_SIGNAL.result = evaluate(node.argument, scope);
        return YIELD_SIGNAL;
    }
};

const _evaluate = (node: any, scope: Scope) => {
    const func = evaluate_map[node.type];
    if (!func) throw createError(errorMessageList.notSupportNode, node.type, node, thisRunner.source);
    const res = evaluate_map[node.type](node, scope);
    thisRunner.currentNode = node;
    return res;
}

export const evaluate = (node: any, scope: Scope, runner?: typeof thisRunner) => {
    if (runner) thisRunner = runner;
    const thisId = thisRunner.traceId++;
    thisRunner.traceStack.push(thisId);
    try {
        const res = _evaluate(node, scope);
        thisRunner.traceStack.pop();
        return res;
    } catch (err) {
        // 错误已经冒泡到栈定了，触发错误收集处理
        if (thisRunner.traceStack[0] === thisId) {
            thisRunner.onError(err);
            thisRunner.traceStack.pop();
        }
        // 错误已经处理过了，直接抛出
        if ((err as EvaluateError).isEvaluateError) {
            throw err;
        }
        // 第一级错误，需要包裹处理
        if (thisRunner.traceStack[thisRunner.traceStack.length - 1] === thisId) {
            throw createError(errorMessageList.runTimeError, (err as Error)?.message, node, thisRunner.source)
        }
        throw err;
    }
}

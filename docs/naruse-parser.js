(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.naruseParser = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var Identifier = "Identifier";
    var Literal = "Literal";
    var Program = "Program";
    var Property = "Property";
    var FunctionDeclaration = "FunctionDeclaration";
    var FunctionExpression = "FunctionExpression";
    var ExpressionStatement = "ExpressionStatement";
    var ObjectPattern = "ObjectPattern";
    var ArrayPattern = "ArrayPattern";
    var AssignmentPattern = "AssignmentPattern";
    var ObjectExpression = "ObjectExpression";
    var ArrayExpression = "ArrayExpression";
    var AssignmentExpression = "AssignmentExpression";
    var MemberExpression = "MemberExpression";
    var RestElement = "RestElement";
    var SpreadElement = "SpreadElement";
    var DoWhileStatement = "DoWhileStatement";
    var DebuggerStatement = "DebuggerStatement";
    var ContinueStatement = "ContinueStatement";
    var BreakStatement = "BreakStatement";
    var CallExpression = "CallExpression";
    var YieldExpression = "YieldExpression";
    var ImportBatchSpecifier = "ImportBatchSpecifier";
    var ImportSpecifier = "ImportSpecifier";
    var ImportDeclaration = "ImportDeclaration";
    var ExportSpecifier = "ExportSpecifier";
    var ExportBatchSpecifier = "ExportBatchSpecifier";
    var ExportDeclaration = "ExportDeclaration";
    var ClassDeclaration = "ClassDeclaration";
    var ClassExpression = "ClassExpression";
    var ClassBody = "ClassBody";
    var TemplateElement = "TemplateElement";
    var ArrowFunctionExpression = "ArrowFunctionExpression";
    var TemplateLiteral = "TemplateLiteral";
    var MethodDefinition = "MethodDefinition";
    var SequenceExpression = "SequenceExpression";
    var ParenthesizedExpression = "ParenthesizedExpression";
    var NewExpression = "NewExpression";
    var UpdateExpression = "UpdateExpression";
    var BinaryExpression = "BinaryExpression";
    var LogicalExpression = "LogicalExpression";
    var UnaryExpression = "UnaryExpression";
    var VariableDeclaration = "VariableDeclaration";
    var IfStatement = "IfStatement";
    var ReturnStatement = "ReturnStatement";
    var SwitchCase = "SwitchCase";
    var SwitchStatement = "SwitchStatement";
    var ThrowStatement = "ThrowStatement";
    var TaggedTemplateExpression = "TaggedTemplateExpression";
    var TryStatement = "TryStatement";
    var CatchClause = "CatchClause";
    var WhileStatement = "WhileStatement";
    var EmptyStatement = "EmptyStatement";
    var LabeledStatement = "LabeledStatement";
    var BlockStatement = "BlockStatement";
    var ForInStatement = "ForInStatement";
    var ForOfStatement = "ForOfStatement";
    var ForStatement = "ForStatement";
    var VariableDeclarator = "VariableDeclarator";
    var ThisExpression = "ThisExpression";
    var ConditionalExpression = "ConditionalExpression";
    var ImportExpression = "ImportExpression";

    // 当前执行作用域是否在迭代函数下
    var isGeneratorFunction = function (scope) { return scope.generator; };
    var isYieldResult = function (scope, value) { return isGeneratorFunction(scope) && value === YIELD_SIGNAL; };
    var isReturnResult = function (value) { return value === RETURN_SIGNAL; };
    var isContinueResult = function (value) { return value === CONTINUE_SIGNAL; };
    var isBreakResult = function (value) { return value === BREAK_SIGNAL; };
    /**
     * 是否是函数提升语句
     */
    var isPromoteStatement = function (value) {
        return value.type === FunctionDeclaration;
    };
    /**
     * 是否是变量提升语句
     */
    var isVarPromoteStatement = function (value) {
        return (value === null || value === void 0 ? void 0 : value.type) === VariableDeclaration && value.kind === 'var';
    };
    var BREAK_SIGNAL = {};
    var CONTINUE_SIGNAL = {};
    var RETURN_SIGNAL = { result: undefined };
    var YIELD_SIGNAL = { result: undefined };
    var THIS = 'this';

    var ScopeVar = /** @class */ (function () {
        function ScopeVar(kind, value, reDeclare) {
            if (reDeclare === void 0) { reDeclare = false; }
            this.reDeclare = false;
            this.value = value;
            this.kind = kind;
            this.reDeclare = reDeclare;
        }
        ScopeVar.prototype.$set = function (value) {
            if (this.kind === 'const' && !this.reDeclare) {
                throw new Error('const value can not be changed');
            }
            this.value = value;
            this.reDeclare = false;
            return true;
        };
        ScopeVar.prototype.$get = function () {
            return this.value;
        };
        return ScopeVar;
    }());
    var indexGeneratorStackDecorate = function (fn, scope) {
        var data = { index: 0 };
        var saveData = function () { };
        // 入栈
        if (isGeneratorFunction(scope)) {
            data = scope.generatorStack.getStack();
            saveData = scope.generatorStack.saveStackData.bind(scope.generatorStack);
        }
        var result = fn(data, saveData);
        // 出栈
        if (isGeneratorFunction(scope)) {
            scope.generatorStack.popStack();
        }
        return result;
    };
    /** 用于保存迭代函数的栈 */
    var GeneratorStack = /** @class */ (function () {
        function GeneratorStack() {
            this.runnerStack = [];
            this.yieldBackValues = [];
            this.running = false;
            this.currentIndex = 0;
            this.currentStackIndex = 0;
        }
        GeneratorStack.prototype.pushValue = function (value) {
            if (this.running)
                this.yieldBackValues.push({ value: value });
            this.running = true;
        };
        GeneratorStack.prototype.getValue = function () {
            var value = this.yieldBackValues[this.currentIndex];
            if (value) {
                this.currentIndex++;
                return value;
            }
            this.currentIndex = 0;
        };
        GeneratorStack.prototype.getStack = function () {
            var runner = this.runnerStack[this.currentStackIndex];
            if (runner)
                return runner;
            var newRunner = { index: 0 };
            this.runnerStack.push(runner);
            return newRunner;
        };
        GeneratorStack.prototype.popStack = function () {
            this.currentStackIndex--;
            this.runnerStack.pop();
        };
        GeneratorStack.prototype.saveStackData = function (key, value) {
            this.runnerStack[this.runnerStack.length - 1][key] = value;
        };
        return GeneratorStack;
    }());
    var Scope = /** @class */ (function () {
        function Scope(type, parent, generator) {
            if (generator === void 0) { generator = false; }
            this.content = {};
            this.prefix = '';
            // 标记为侵入式Scope，不用再多构造啦
            this.invasive = false;
            this.type = type;
            this.parent = parent || null;
            this.generator = generator;
            this.generatorStack = new GeneratorStack();
        }
        Scope.prototype.$find = function (raw_name) {
            var name = this.prefix + raw_name;
            if (this.content.hasOwnProperty(name)) {
                return this.content[name];
            }
            else if (this.parent) {
                return this.parent.$find(raw_name);
            }
            return null;
        };
        Scope.prototype.$let = function (raw_name, value) {
            var name = this.prefix + raw_name;
            var $var = this.content[name];
            if (!$var) {
                this.content[name] = new ScopeVar('let', value);
                return true;
            }
            return false;
        };
        Scope.prototype.$const = function (raw_name, value) {
            var name = this.prefix + raw_name;
            var $var = this.content[name];
            if (!$var || ($var instanceof ScopeVar && $var.reDeclare)) {
                this.content[name] = new ScopeVar('const', value);
                return true;
            }
            return false;
        };
        Scope.prototype.$var = function (raw_name, value, canReDeclare) {
            if (canReDeclare === void 0) { canReDeclare = false; }
            var name = this.prefix + raw_name;
            var scope = this.getClosetSomeScope("function" /* ScopeType.Function */);
            var $var = scope.content[name];
            if (!$var) {
                this.content[name] = new ScopeVar('var', value, canReDeclare);
                return true;
                // #fix var 不允许重复声明
            }
            else if ($var instanceof ScopeVar) {
                $var.$set(value);
                return true;
            }
            return false;
        };
        Scope.prototype.$declar = function (kind, raw_name, value, canReDeclare) {
            var _this = this;
            if (canReDeclare === void 0) { canReDeclare = false; }
            return ({
                var: function () { return _this.$var(raw_name, value, canReDeclare); },
                let: function () { return _this.$let(raw_name, value); },
                const: function () { return _this.$const(raw_name, value); },
            })[kind]();
        };
        /**
         * 获取最近的某种类型作用域
         */
        Scope.prototype.getClosetSomeScope = function (type) {
            var scope = this;
            while (scope.parent !== null && scope.type !== type) {
                scope = scope.parent;
            }
            return scope;
        };
        return Scope;
    }());
    /**
     * 获取当前顶层作用域的 runner
     */
    var getScopeRunner = function (scope) {
        return scope.getClosetSomeScope("program" /* ScopeType.Program */).runner;
    };

    var EvaluateError = /** @class */ (function (_super) {
        __extends(EvaluateError, _super);
        function EvaluateError() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isEvaluateError = true;
            return _this;
        }
        return EvaluateError;
    }(Error));
    /** @class */ ((function (_super) {
        __extends(EvaluateSyntaxError, _super);
        function EvaluateSyntaxError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EvaluateSyntaxError;
    })(EvaluateError));
    var EvaluateReferenceError = /** @class */ (function (_super) {
        __extends(EvaluateReferenceError, _super);
        function EvaluateReferenceError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EvaluateReferenceError;
    }(EvaluateError));
    var errorMessageList = {
        notYetDefined: [1000, "未定义的变量: %0", EvaluateReferenceError],
        duplicateDefinition: [1001, "变量重复定义: %0", EvaluateReferenceError],
        notCallableFunction: [1002, "不是可调用的函数: %0", EvaluateReferenceError],
        notSupportNode: [1003, "尚未支持的node类型: %0", EvaluateError],
        notHasSomeProperty: [1004, "对象不存在对应属性: %0", EvaluateReferenceError],
        runTimeError: [1005, "运行错误 %0", EvaluateError],
        deconstructNotArray: [1006, "解构应为一个数组: %0", EvaluateReferenceError],
        deconstructNotObject: [1007, "解构应为一个对象: %0", EvaluateReferenceError],
        notHasImport: [1008, "未初始化函数: %0", EvaluateReferenceError],
        notGeneratorFunction: [1009, "无法在非迭代函数内使用yield: %0", EvaluateReferenceError],
    };
    var createError = function (msg, value, node, scope) {
        var _a;
        var source = (_a = getScopeRunner(scope)) === null || _a === void 0 ? void 0 : _a.source;
        var message = msg[1].replace("%0", String(value));
        if (node && source) {
            var errorNodeLoc = node.loc;
            var errorCode = source.slice(node.start, node.end);
            var errorMsg = "\u9519\u8BEF\u4EE3\u7801: ".concat(errorCode);
            if (errorNodeLoc) {
                errorMsg += " [".concat(errorNodeLoc.start.line, ":").concat(errorNodeLoc.start.column, "-").concat(errorNodeLoc.end.line, ":").concat(errorNodeLoc.end.column, "]");
            }
            message = "".concat(message, " \n ").concat(errorMsg);
        }
        var err = new msg[2](message);
        return err.nodeLoc = node, err;
    };

    var _a, _b;
    var anonymousId = 0;
    var ObjectDefineProperty = Object.defineProperty;
    var illegalFun = [setTimeout, setInterval, clearInterval, clearTimeout];
    var isUndefinedOrNull = function (val) { return val === void 0 || val === null; };
    /**
     * 提炼 for语句中的变量提升
     * k: 语句
     * v: 对应的属性名
     */
    var RefineForPromoteNameMap = (_a = {},
        _a[ForStatement] = 'init',
        _a[ForInStatement] = 'left',
        _a[ForOfStatement] = 'left',
        _a);
    /**
     * 提炼非函数声明语句，并执行函数声明语句 与 初始化 var 变量
     */
    var refinePromteStatements = function (nodes, scope) {
        var nonPromoteList = [];
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            // function 声明语句 提升到作用域顶部直接执行
            if (isPromoteStatement(node)) {
                evaluate(node, scope);
            }
            else {
                // 如果是 var 则需要先声明变量为 undefined
                if (isVarPromoteStatement(node))
                    evaluate_map[VariableDeclaration](node, scope, true);
                // for,forin,forof 循环中的 var 声明语句也需要提升
                if (RefineForPromoteNameMap[node.type]) {
                    var initNode = node[RefineForPromoteNameMap[node.type]];
                    if (isVarPromoteStatement(initNode))
                        evaluate_map[VariableDeclaration](initNode, scope, true);
                }
                nonPromoteList.push(node);
            }
        }
        return nonPromoteList;
    };
    var evaluate_map = (_b = {},
        _b[Program] = function (program, scope) {
            var list = program.body;
            var nonFunctionList = refinePromteStatements(list, scope);
            for (var _i = 0, nonFunctionList_1 = nonFunctionList; _i < nonFunctionList_1.length; _i++) {
                var node = nonFunctionList_1[_i];
                evaluate(node, scope);
            }
        },
        _b[Identifier] = function (node, scope) {
            if (node.name === 'undefined') {
                return undefined;
            }
            var $var = scope.$find(node.name);
            if ($var) {
                return $var.$get();
            }
            throw createError(errorMessageList.notYetDefined, node.name, node, scope);
        },
        _b[Literal] = function (node) {
            return node.value;
        },
        _b[BlockStatement] = function (block, scope) {
            return indexGeneratorStackDecorate(function (stackData) {
                var new_scope = scope.invasive ? scope : new Scope("block" /* ScopeType.Block */, scope);
                var list = block.body;
                // 提炼语句需要提升到父级作用域
                var nonFunctionList = refinePromteStatements(list, new_scope);
                for (; stackData.index < nonFunctionList.length; stackData.index++) {
                    var node = nonFunctionList[stackData.index];
                    var result = evaluate(node, new_scope);
                    if (isYieldResult(scope, result)
                        || isReturnResult(result)
                        || isContinueResult(result)
                        || isBreakResult(result))
                        return result;
                }
            }, scope);
        },
        _b[EmptyStatement] = function () { },
        _b[ExpressionStatement] = function (node, scope) {
            return evaluate(node.expression, scope);
        },
        _b[ReturnStatement] = function (node, scope) {
            RETURN_SIGNAL.result = node.argument ? evaluate(node.argument, scope) : undefined;
            return RETURN_SIGNAL;
        },
        _b[BreakStatement] = function () {
            return BREAK_SIGNAL;
        },
        _b[ContinueStatement] = function () {
            return CONTINUE_SIGNAL;
        },
        _b[IfStatement] = function (node, scope) {
            if (evaluate(node.test, scope))
                return evaluate(node.consequent, scope);
            else if (node.alternate)
                return evaluate(node.alternate, scope);
        },
        _b[ForStatement] = function (node, scope) {
            for (var new_scope = new Scope("loop" /* ScopeType.Loop */, scope), 
            // 只有 var 变量才会被提高到上一作用域
            init_val = node.init ? evaluate(node.init, isVarPromoteStatement(node.init) ? scope : new_scope) : null; node.test ? evaluate(node.test, new_scope) : true; node.update ? evaluate(node.update, new_scope) : void (0)) {
                var result = evaluate(node.body, new_scope);
                if (isReturnResult(result))
                    return result;
                else if (isContinueResult(result))
                    continue;
                else if (isBreakResult(result))
                    break;
            }
        },
        _b[FunctionDeclaration] = function (node, scope) {
            var func = evaluate_map[FunctionExpression](node, scope);
            if (!scope.$var(func.name, func)) {
                throw createError(errorMessageList.duplicateDefinition, func.name, node, scope);
            }
            return func;
        },
        _b[VariableDeclaration] = function (node, scope, isVarPromote) {
            if (isVarPromote === void 0) { isVarPromote = false; }
            var kind = node.kind;
            return indexGeneratorStackDecorate(function (stackData) {
                var list = node.declarations;
                for (; stackData.index < list.length; stackData.index++) {
                    var declaration = list[stackData.index];
                    var id = declaration.id, init = declaration.init;
                    // 如果是变量提升语句，需要先声明一个 undefined 变量，等待后续的重新赋值语句
                    var value = !isVarPromote && init ? evaluate(init, scope) : undefined;
                    // 迭代器变量中断
                    if (isYieldResult(scope, value))
                        return value;
                    // 正常流程
                    if (id.type === Identifier) {
                        var name_1 = id.name;
                        // 如果作用域提升时变量已经存在，则不需要再次声明
                        if (isVarPromote && scope.$find(name_1) !== null)
                            continue;
                        if (!scope.$declar(kind, name_1, value)) {
                            throw createError(errorMessageList.duplicateDefinition, name_1, node, scope);
                        }
                    }
                    else {
                        var result = evaluate_map[id.type](id, scope, kind, value);
                        if (isYieldResult(scope, result))
                            return result;
                    }
                }
            }, scope);
        },
        _b[ArrayPattern] = function (node, scope, kind, value) {
            var elements = node.elements;
            if (!Array.isArray(value)) {
                throw createError(errorMessageList.deconstructNotArray, value, node, scope);
            }
            elements.forEach(function (element, index) {
                if (!element)
                    return;
                if (element.type === Identifier) {
                    var name_2 = element.name;
                    if (!kind)
                        kind = 'var';
                    if (!scope.$declar(kind, name_2, value[index])) {
                        throw createError(errorMessageList.duplicateDefinition, name_2, node, scope);
                    }
                }
                else {
                    evaluate_map[element.type](element, scope, kind, value[index]);
                }
            });
        },
        _b[ObjectPattern] = function (node, scope, kind, object) {
            var properties = node.properties;
            properties.forEach(function (property) {
                if (property.type === Property) {
                    var _a = property, key = _a.key, value = _a.value, computed = _a.computed;
                    var newKey = computed ? evaluate(key, scope) : key.name;
                    if (value.type === Identifier) {
                        var name_3 = value.name;
                        if (!scope.$declar(kind, name_3, object[newKey])) {
                            throw createError(errorMessageList.duplicateDefinition, name_3, node, scope);
                        }
                    }
                    else {
                        evaluate_map[value.type](value, scope, kind, object[newKey]);
                    }
                }
            });
        },
        _b[AssignmentPattern] = function (node, scope, kind, init) {
            var left = node.left, right = node.right;
            var value = init === void 0 ? evaluate(right, scope) : init;
            if (left.type === Identifier) {
                var name_4 = left.name;
                if (!scope.$declar(kind, name_4, value)) {
                    throw createError(errorMessageList.duplicateDefinition, name_4, node, scope);
                }
            }
            else {
                evaluate_map[left.type](left, scope, kind, value);
            }
        },
        _b[ThisExpression] = function (node, scope) {
            var this_val = scope.$find(THIS);
            return this_val ? this_val.$get() : null;
        },
        _b[ArrayExpression] = function (node, scope) {
            return node.elements.map(function (item) { return item ? evaluate(item, scope) : null; });
        },
        _b[ObjectExpression] = function (node, scope) {
            var object = {};
            for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
                var property = _a[_i];
                if (property.type === Property) {
                    var kind = property.kind, computed = property.computed;
                    // fix: { 1: 1 }
                    var key = void 0;
                    if (property.key.type === Literal || computed) {
                        key = evaluate(property.key, scope);
                    }
                    else if (property.key.type === Identifier) {
                        key = property.key.name;
                    }
                    var value = evaluate(property.value, scope);
                    if (kind === 'init') {
                        object[key] = value;
                    }
                    else if (kind === 'set') {
                        ObjectDefineProperty(object, key, { set: value });
                    }
                    else if (kind === 'get') {
                        ObjectDefineProperty(object, key, { get: value });
                    }
                }
                else {
                    throw createError(errorMessageList.notSupportNode, property.type, node, scope);
                }
            }
            return object;
        },
        _b[FunctionExpression] = function (node, scope, isArrowFunction) {
            if (isArrowFunction === void 0) { isArrowFunction = false; }
            var func;
            var func_name = (node.id || { name: "anonymous".concat(anonymousId++) }).name;
            if (node.generator) {
                func = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var new_scope = new Scope("function" /* ScopeType.Function */, scope, true);
                    new_scope.invasive = true;
                    new_scope.$const(THIS, this);
                    new_scope.$const('arguments', arguments);
                    new_scope.$var(func_name, func, true);
                    node.params.forEach(function (param, index) {
                        if (param.type === Identifier) {
                            var name_5 = param.name;
                            new_scope.$var(name_5, args[index]);
                        }
                        else {
                            evaluate_map[param.type](param, new_scope, 'var', args[index]);
                        }
                    });
                    var completed = false;
                    var next = function (arg) {
                        var _a;
                        if (completed)
                            return { value: undefined, done: true };
                        (_a = new_scope.generatorStack) === null || _a === void 0 ? void 0 : _a.pushValue(arg);
                        var result = evaluate(node.body, new_scope);
                        if (isYieldResult(new_scope, result)) {
                            return { value: result.result, done: false };
                        }
                        if (isReturnResult(result)) {
                            completed = true;
                            return { value: result.result, done: true };
                        }
                    };
                    return { next: next };
                };
            }
            else {
                func = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var new_scope = new Scope("function" /* ScopeType.Function */, scope);
                    new_scope.invasive = true;
                    // fix: 修复在非 block 作用域中使用函数名调用函数时，函数名指向错误的问题
                    // fix: 修复了当函数中出现与函数名相同的的形参时会导致形参会取到当前函数
                    new_scope.$var(func_name, func, true);
                    node.params.forEach(function (param, index) {
                        if (param.type === Identifier) {
                            var name_6 = param.name;
                            new_scope.$var(name_6, args[index]);
                        }
                        else {
                            evaluate_map[param.type](param, new_scope, 'var', args[index]);
                        }
                    });
                    var result;
                    if (isArrowFunction) {
                        var parent_scope = scope.$find(THIS).$get();
                        new_scope.$const(THIS, parent_scope ? parent_scope : null);
                        result = evaluate(node.body, new_scope);
                        if (node.body.type !== BlockStatement) {
                            return result;
                        }
                    }
                    else {
                        new_scope.$const(THIS, this);
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
                ObjectDefineProperty(func, "prototype", { value: undefined });
            }
            // 矫正属性
            ObjectDefineProperty(func, "length", { value: node.params.length });
            // @ts-ignore
            ObjectDefineProperty(func, "toString", { value: function () { return getScopeRunner(scope).source.slice(node.start, node.end); }, configurable: true });
            // 矫正name属性
            ObjectDefineProperty(func, "name", { value: func_name, configurable: true });
            return func;
        },
        _b[UnaryExpression] = function (node, scope) {
            var _a;
            var sk = 'typeof';
            return (_a = {
                    '-': function () { return -evaluate(node.argument, scope); },
                    '+': function () { return +evaluate(node.argument, scope); },
                    '!': function () { return !evaluate(node.argument, scope); },
                    '~': function () { return ~evaluate(node.argument, scope); },
                    'void': function () { return void evaluate(node.argument, scope); },
                    'delete': function () {
                        if (node.argument.type === MemberExpression) {
                            var _a = node.argument, object = _a.object, property = _a.property, computed = _a.computed;
                            if (computed) {
                                return delete evaluate(object, scope)[evaluate(property, scope)];
                            }
                            else {
                                // @ts-ignore
                                return delete evaluate(object, scope)[(property).name];
                            }
                        }
                        else if (node.argument.type === Identifier) {
                            var $this = scope.$find(THIS);
                            // @ts-ignore
                            if ($this)
                                return $this.$get()[node.argument.name];
                        }
                    }
                },
                // 部分老版本 babel 会将 typeof 函数修改为同名的 _typeof 函数，导致循环调用最后栈溢出
                // 使用特殊的 key 来区分
                _a[sk] = function () {
                    if (node.argument.type === Identifier) {
                        var $var = scope.$find(node.argument.name);
                        return $var ? typeof $var.$get() : 'undefined';
                    }
                    else {
                        return typeof evaluate(node.argument, scope);
                    }
                },
                _a)[node.operator]();
        },
        _b[UpdateExpression] = function (node, scope) {
            var prefix = node.prefix;
            var $var;
            if (node.argument.type === Identifier) {
                var name_7 = node.argument.name;
                $var = scope.$find(name_7);
                if (!$var)
                    throw createError(errorMessageList.notYetDefined, name_7, node, scope);
            }
            else if (node.argument.type === MemberExpression) {
                var argument = node.argument;
                var object_1 = evaluate(argument.object, scope);
                var property_1 = argument.computed
                    ? evaluate(argument.property, scope)
                    : (argument.property).name;
                $var = {
                    $set: function (value) {
                        object_1[property_1] = value;
                        return true;
                    },
                    $get: function () {
                        return object_1[property_1];
                    },
                };
            }
            return ({
                '--': function (v) { return ($var.$set(v - 1), (prefix ? --v : v--)); },
                '++': function (v) { return ($var.$set(v + 1), (prefix ? ++v : v++)); },
            })[node.operator](evaluate(node.argument, scope));
        },
        _b[BinaryExpression] = function (node, scope) {
            return ({
                '==': function (a, b) { return a == b; },
                '!=': function (a, b) { return a != b; },
                '===': function (a, b) { return a === b; },
                '!==': function (a, b) { return a !== b; },
                '<': function (a, b) { return a < b; },
                '<=': function (a, b) { return a <= b; },
                '>': function (a, b) { return a > b; },
                '>=': function (a, b) { return a >= b; },
                '+': function (a, b) { return a + b; },
                '-': function (a, b) { return a - b; },
                '*': function (a, b) { return a * b; },
                '**': function (a, b) { return Math.pow(a, b); },
                '/': function (a, b) { return a / b; },
                '%': function (a, b) { return a % b; },
                '|': function (a, b) { return a | b; },
                '^': function (a, b) { return a ^ b; },
                '&': function (a, b) { return a & b; },
                '<<': function (a, b) { return a << b; },
                '>>': function (a, b) { return a >> b; },
                '>>>': function (a, b) { return a >>> b; },
                in: function (a, b) { return a in b; },
                instanceof: function (a, b) { return a instanceof b; },
            })[node.operator](evaluate(node.left, scope), evaluate(node.right, scope));
        },
        _b[AssignmentExpression] = function (node, scope) {
            var $var;
            var left = node.left;
            if (left.type === Identifier) {
                var name_8 = left.name;
                var $var_or_not = scope.$find(name_8);
                if (!$var_or_not)
                    throw createError(errorMessageList.notYetDefined, name_8, node, scope);
                $var = $var_or_not;
            }
            else if (left.type === MemberExpression) {
                var _a = left, object = _a.object, property = _a.property, computed = _a.computed;
                var newObject_1 = evaluate(object, scope);
                var newProperty_1 = computed
                    ? evaluate(property, scope)
                    : property.name;
                $var = {
                    $set: function (value) {
                        newObject_1[newProperty_1] = value;
                        return true;
                    },
                    $get: function () {
                        return newObject_1[newProperty_1];
                    },
                };
            }
            else {
                throw createError(errorMessageList.notSupportNode, left.type, node, scope);
            }
            return ({
                '=': function (v) { return ($var.$set(v), v); },
                '+=': function (v) { return ($var.$set($var.$get() + v), $var.$get()); },
                '-=': function (v) { return ($var.$set($var.$get() - v), $var.$get()); },
                '*=': function (v) { return ($var.$set($var.$get() * v), $var.$get()); },
                '**=': function (v) { return ($var.$set(Math.pow($var.$get(), v)), $var.$get()); },
                '/=': function (v) { return ($var.$set($var.$get() / v), $var.$get()); },
                '%=': function (v) { return ($var.$set($var.$get() % v), $var.$get()); },
                '|=': function (v) { return ($var.$set($var.$get() | v), $var.$get()); },
                '<<=': function (v) { return ($var.$set($var.$get() << v), $var.$get()); },
                '>>=': function (v) { return ($var.$set($var.$get() >> v), $var.$get()); },
                '>>>=': function (v) { return ($var.$set($var.$get() >>> v), $var.$get()); },
                '^=': function (v) { return ($var.$set($var.$get() ^ v), $var.$get()); },
                '&=': function (v) { return ($var.$set($var.$get() & v), $var.$get()); },
            })[node.operator](evaluate(node.right, scope));
        },
        _b[LogicalExpression] = function (node, scope) {
            return ({
                '||': function () { return evaluate(node.left, scope) || evaluate(node.right, scope); },
                '&&': function () { return evaluate(node.left, scope) && evaluate(node.right, scope); },
                '??': function () { var _a; return (_a = evaluate(node.left, scope)) !== null && _a !== void 0 ? _a : evaluate(node.right, scope); },
            })[node.operator]();
        },
        _b[MemberExpression] = function (node, scope) {
            var object = node.object, property = node.property, computed = node.computed;
            if (computed) {
                return evaluate(object, scope)[evaluate(property, scope)];
            }
            return evaluate(object, scope)[property.name];
        },
        _b[ConditionalExpression] = function (node, scope) {
            return (evaluate(node.test, scope)
                ? evaluate(node.consequent, scope)
                : evaluate(node.alternate, scope));
        },
        _b[CallExpression] = function (node, scope) {
            var this_val = null;
            var func = null;
            // fix: ww().ww().ww()
            if (node.callee.type === MemberExpression) {
                var _a = (node.callee), object = _a.object, property = _a.property, computed = _a.computed;
                this_val = evaluate(object, scope);
                // @ts-ignore
                var funcName = !computed ? property.name : evaluate_map[property.type](property, scope);
                if (isUndefinedOrNull(this_val))
                    throw createError(errorMessageList.notHasSomeProperty, funcName, node, scope);
                func = this_val[funcName];
            }
            else {
                this_val = scope.$find(THIS).$get();
                func = evaluate(node.callee, scope);
            }
            if (typeof func !== 'function')
                throw createError(errorMessageList.notCallableFunction, func, node, scope);
            // fix: setTimeout.apply({}, '');
            if (illegalFun.includes(func))
                this_val = null;
            return func.apply(this_val, node.arguments.map(function (arg) { return evaluate(arg, scope); }));
        },
        _b[NewExpression] = function (node, scope) {
            var Func = evaluate(node.callee, scope);
            var args = node.arguments.map(function (arg) { return evaluate(arg, scope); });
            return new (Func.bind.apply(Func, __spreadArray([void 0], args, false)))();
        },
        _b[SequenceExpression] = function (node, scope) {
            var last;
            for (var _i = 0, _a = node.expressions; _i < _a.length; _i++) {
                var expr = _a[_i];
                last = evaluate(expr, scope);
            }
            return last;
        },
        _b[ThrowStatement] = function (node, scope) {
            throw evaluate(node.argument, scope);
        },
        _b[TryStatement] = function (node, scope) {
            try {
                return evaluate(node.block, scope);
            }
            catch (err) {
                if (node.handler) {
                    var param = node.handler.param;
                    var new_scope = new Scope("block" /* ScopeType.Block */, scope);
                    new_scope.invasive = true;
                    new_scope.$const(param === null || param === void 0 ? void 0 : param.name, err);
                    return evaluate(node.handler, new_scope);
                }
                else {
                    throw err;
                }
            }
            finally {
                // fix: 当 finally 中存在 return 时 会覆盖 try 里的返回值，导致返回值错误
                if (node.finalizer) {
                    var res = evaluate(node.finalizer, scope);
                    if (isReturnResult(res))
                        return res;
                }
            }
        },
        _b[CatchClause] = function (node, scope) {
            return evaluate(node.body, scope);
        },
        _b[SwitchStatement] = function (node, scope) {
            var discriminant = evaluate(node.discriminant, scope);
            var new_scope = new Scope("switch" /* ScopeType.Switch */, scope);
            var matched = false;
            for (var _i = 0, _a = node.cases; _i < _a.length; _i++) {
                var $case = _a[_i];
                // 进行匹配相应的 case
                if (!matched &&
                    (!$case.test || discriminant === evaluate($case.test, new_scope))) {
                    matched = true;
                }
                if (matched) {
                    var result = evaluate($case, new_scope);
                    if (isBreakResult(result)) {
                        break;
                    }
                    else if (isReturnResult(result) || isContinueResult(result)) {
                        return result;
                    }
                }
            }
        },
        _b[SwitchCase] = function (node, scope) {
            for (var _i = 0, _a = node.consequent; _i < _a.length; _i++) {
                var stmt = _a[_i];
                var result = evaluate(stmt, scope);
                if (isReturnResult(result) || isBreakResult(result) || isContinueResult(result)) {
                    return result;
                }
            }
        },
        _b[WhileStatement] = function (node, scope) {
            while (evaluate(node.test, scope)) {
                var new_scope = new Scope("loop" /* ScopeType.Loop */, scope);
                new_scope.invasive = true;
                var result = evaluate(node.body, new_scope);
                if (isBreakResult(result)) {
                    break;
                }
                else if (isContinueResult(result)) {
                    continue;
                }
                else if (isReturnResult(result)) {
                    return result;
                }
            }
        },
        _b[DoWhileStatement] = function (node, scope) {
            do {
                var new_scope = new Scope("loop" /* ScopeType.Loop */, scope);
                new_scope.invasive = true;
                var result = evaluate(node.body, new_scope);
                if (result === BREAK_SIGNAL) {
                    break;
                }
                else if (result === CONTINUE_SIGNAL) {
                    continue;
                }
                else if (result === RETURN_SIGNAL) {
                    return result;
                }
            } while (evaluate(node.test, scope));
        },
        _b[ArrowFunctionExpression] = function (node, scope) {
            return evaluate_map[FunctionExpression](node, scope, true);
        },
        _b[ForInStatement] = function (node, scope, isForOf) {
            if (isForOf === void 0) { isForOf = false; }
            var kind = node.left.kind;
            var id = kind ? node.left.declarations[0].id : node.left;
            var forInit = function (value) {
                var new_scope = new Scope("loop" /* ScopeType.Loop */, scope);
                new_scope.invasive = true;
                if (id.type === Identifier) {
                    var name_9 = id.name;
                    // fix: 修复了 in 或者 of 可能提前声明变量的问题
                    // let i; for (i in [1, 2, 3]) {  };
                    var newKind = kind || 'var';
                    new_scope.$declar(newKind, name_9, value);
                }
                else {
                    evaluate_map[id.type](id, new_scope, kind, value);
                }
                return evaluate(node.body, new_scope);
            };
            var init = evaluate(node.right, scope);
            if (isForOf) {
                for (var index = 0; index < init.length; index++) {
                    var result = forInit(init[index]);
                    if (isBreakResult(result)) {
                        break;
                    }
                    else if (isContinueResult(result)) {
                        continue;
                    }
                    else if (isReturnResult(result)) {
                        return result;
                    }
                }
            }
            else {
                for (var value in init) {
                    var result = forInit(value);
                    if (isBreakResult(result)) {
                        break;
                    }
                    else if (isContinueResult(result)) {
                        continue;
                    }
                    else if (isReturnResult(result)) {
                        return result;
                    }
                }
            }
        },
        _b[TemplateLiteral] = function (node, scope) {
            var result = node.quasis.map(function (quasi, index) {
                if (!quasi.tail)
                    return quasi.value.raw + evaluate(node.expressions[index], scope);
                return quasi.value.raw;
            });
            return result.join('');
        },
        _b[ImportExpression] = function (node, scope) {
            var source = evaluate(node.source, scope);
            var importer = scope.$find('$$import');
            if (!importer)
                throw createError(errorMessageList.notHasImport, '$$import', node, scope);
            return importer.$get()(source);
        },
        _b[ForOfStatement] = function (node, scope) {
            return evaluate_map[ForInStatement](node, scope, true);
        },
        _b[YieldExpression] = function (node, scope) {
            var _a;
            if (!isGeneratorFunction(scope))
                throw createError(errorMessageList.notGeneratorFunction, '', node, scope);
            var value = (_a = scope.generatorStack) === null || _a === void 0 ? void 0 : _a.getValue();
            if (value)
                return value.value;
            YIELD_SIGNAL.result = evaluate(node.argument, scope);
            return YIELD_SIGNAL;
        },
        _b);
    var _evaluate = function (node, scope) {
        var func = evaluate_map[node.type];
        if (!func)
            throw createError(errorMessageList.notSupportNode, node.type, node, scope);
        var res = evaluate_map[node.type](node, scope);
        return res;
    };
    var evaluate = function (node, scope) {
        var runner = getScopeRunner(scope);
        var thisId = runner.traceId++;
        runner.traceStack.push(thisId);
        try {
            return _evaluate(node, scope);
        }
        catch (err) {
            // 错误已经冒泡到栈定了，触发错误收集处理
            if (runner.traceStack[0] === thisId) {
                runner.onError(err);
            }
            // 错误已经处理过了，直接抛出
            if (err.isEvaluateError) {
                throw err;
            }
            throw createError(errorMessageList.runTimeError, err === null || err === void 0 ? void 0 : err.message, node, scope);
        }
        finally {
            runner.traceStack.pop();
        }
    };

    // this module is clone from acorn@0.12.0 with some modifications
    // The main exported interface (under `self.acorn` when in the
    // browser) is a `parse` function that takes a code string and
    // returns an abstract syntax tree as specified by [Mozilla parser
    // API][api], with the caveat that inline XML is not recognized.
    //
    // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
    function getNewAcorn() {
        var acorn = {};
        acorn.version = "0.12.x";
        var options, input, inputLen, sourceFile;
        acorn.parse = function (inpt, opts) {
            input = String(inpt);
            inputLen = input.length;
            setOptions(opts);
            initTokenState();
            var startPos = options.locations ? [tokPos, curPosition()] : tokPos;
            initParserState();
            return parseTopLevel(options.program || startNodeAt(startPos));
        };
        // A second optional argument can be given to further configure
        // the parser process. These options are recognized:
        var defaultOptions = acorn.defaultOptions = {
            // `ecmaVersion` indicates the ECMAScript version to parse. Must
            // be either 3, or 5, or 6. This influences support for strict
            // mode, the set of reserved words, support for getters and
            // setters and other features.
            ecmaVersion: 5,
            // Turn on `strictSemicolons` to prevent the parser from doing
            // automatic semicolon insertion.
            strictSemicolons: false,
            // When `allowTrailingCommas` is false, the parser will not allow
            // trailing commas in array and object literals.
            allowTrailingCommas: true,
            // By default, reserved words are not enforced. Enable
            // `forbidReserved` to enforce them. When this option has the
            // value "everywhere", reserved words and keywords can also not be
            // used as property names.
            forbidReserved: false,
            // When enabled, a return at the top level is not considered an
            // error.
            allowReturnOutsideFunction: false,
            // When enabled, import/export statements are not constrained to
            // appearing at the top of the program.
            allowImportExportEverywhere: false,
            // When enabled, hashbang directive in the beginning of file
            // is allowed and treated as a line comment.
            allowHashBang: false,
            // When `locations` is on, `loc` properties holding objects with
            // `start` and `end` properties in `{line, column}` form (with
            // line being 1-based and column 0-based) will be attached to the
            // nodes.
            locations: false,
            // Nodes have their start and end characters offsets recorded in
            // `start` and `end` properties (directly on the node, rather than
            // the `loc` object, which holds line/column data. To also add a
            // [semi-standardized][range] `range` property holding a `[start,
            // end]` array with the same numbers, set the `ranges` option to
            // `true`.
            //
            // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
            ranges: false,
            // It is possible to parse multiple files into a single AST by
            // passing the tree produced by parsing the first file as
            // `program` option in subsequent parses. This will add the
            // toplevel forms of the parsed file to the `Program` (top) node
            // of an existing parse tree.
            program: null,
            // When `locations` is on, you can pass this to record the source
            // file in every node's `loc` object.
            sourceFile: null,
            // This value, if given, is stored in every node, whether
            // `locations` is on or off.
            directSourceFile: null,
            // When enabled, parenthesized expressions are represented by
            // (non-standard) ParenthesizedExpression nodes
            preserveParens: false
        };
        // This function tries to parse a single expression at a given
        // offset in a string. Useful for parsing mixed-language formats
        // that embed JavaScript expressions.
        acorn.parseExpressionAt = function (inpt, pos, opts) {
            input = String(inpt);
            inputLen = input.length;
            setOptions(opts);
            initTokenState(pos);
            initParserState();
            return parseExpression();
        };
        function setOptions(opts) {
            options = {};
            for (var opt in defaultOptions)
                options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
            sourceFile = options.sourceFile || null;
            isKeyword = options.ecmaVersion >= 6 ? isEcma6Keyword : isEcma5AndLessKeyword;
        }
        // The `getLineInfo` function is mostly useful when the
        // `locations` option is off (for performance reasons) and you
        // want to find the line/column position for a given character
        // offset. `input` should be the code string that the offset refers
        // into.
        var getLineInfo = function (input, offset) {
            for (var line = 1, cur = 0;;) {
                lineBreak.lastIndex = cur;
                var match = lineBreak.exec(input);
                if (match && match.index < offset) {
                    ++line;
                    cur = match.index + match[0].length;
                }
                else
                    break;
            }
            return {
                line: line,
                column: offset - cur
            };
        };
        function Token() {
            this.type = tokType;
            this.value = tokVal;
            this.start = tokStart;
            this.end = tokEnd;
            if (options.locations) {
                this.loc = new SourceLocation();
                this.loc.end = tokEndLoc;
            }
            if (options.ranges)
                this.range = [tokStart, tokEnd];
        }
        // Acorn is organized as a tokenizer and a recursive-descent parser.
        // The `tokenize` export provides an interface to the tokenizer.
        // Because the tokenizer is optimized for being efficiently used by
        // the Acorn parser itself, this interface is somewhat crude and not
        // very modular. Performing another parse or call to `tokenize` will
        // reset the internal state, and invalidate existing tokenizers.
        acorn.tokenize = function (inpt, opts) {
            input = String(inpt);
            inputLen = input.length;
            setOptions(opts);
            initTokenState();
            skipSpace();
            function getToken() {
                lastEnd = tokEnd;
                readToken();
                return new Token();
            }
            getToken.jumpTo = function (pos, exprAllowed) {
                tokPos = pos;
                if (options.locations) {
                    tokCurLine = 1;
                    tokLineStart = lineBreak.lastIndex = 0;
                    var match;
                    while ((match = lineBreak.exec(input)) && match.index < pos) {
                        ++tokCurLine;
                        tokLineStart = match.index + match[0].length;
                    }
                }
                tokExprAllowed = !!exprAllowed;
                skipSpace();
            };
            getToken.current = function () {
                return new Token();
            };
            if (typeof Symbol !== 'undefined') {
                getToken[Symbol.iterator] = function () {
                    return {
                        next: function () {
                            var token = getToken();
                            return {
                                done: token.type === _eof,
                                value: token
                            };
                        }
                    };
                };
            }
            getToken.options = options;
            return getToken;
        };
        // State is kept in (closure-)global variables. We already saw the
        // `options`, `input`, and `inputLen` variables above.
        // The current position of the tokenizer in the input.
        var tokPos;
        // The start and end offsets of the current token.
        var tokStart, tokEnd;
        // When `options.locations` is true, these hold objects
        // containing the tokens start and end line/column pairs.
        var tokStartLoc, tokEndLoc;
        // The type and value of the current token. Token types are objects,
        // named by variables against which they can be compared, and
        // holding properties that describe them (indicating, for example,
        // the precedence of an infix operator, and the original name of a
        // keyword token). The kind of value that's held in `tokVal` depends
        // on the type of the token. For literals, it is the literal value,
        // for operators, the operator name, and so on.
        var tokType;
        var tokVal;
        // Internal state for the tokenizer. To distinguish between division
        // operators and regular expressions, it remembers whether the last
        // token was one that is allowed to be followed by an expression. In
        // some cases, notably after ')' or '}' tokens, the situation
        // depends on the context before the matching opening bracket, so
        // tokContext keeps a stack of information about current bracketed
        // forms.
        var tokContext, tokExprAllowed;
        // When `options.locations` is true, these are used to keep
        // track of the current line, and know when a new line has been
        // entered.
        var tokCurLine, tokLineStart;
        // These store the position of the previous token, which is useful
        // when finishing a node and assigning its `end` position.
        var lastStart, lastEnd, lastEndLoc;
        // This is the parser's state. `inFunction` is used to reject
        // `return` statements outside of functions, `inGenerator` to
        // reject `yield`s outside of generators, `labels` to verify
        // that `break` and `continue` have somewhere to jump to, and
        // `strict` indicates whether strict mode is on.
        var inFunction, inGenerator, labels, strict;
        function initParserState() {
            lastStart = lastEnd = tokPos;
            if (options.locations)
                lastEndLoc = curPosition();
            inFunction = inGenerator = false;
            labels = [];
            skipSpace();
            readToken();
        }
        // This function is used to raise exceptions on parse errors. It
        // takes an offset integer (into the current `input`) to indicate
        // the location of the error, attaches the position to the end
        // of the error message, and then raises a `SyntaxError` with that
        // message.
        var ParserError = /** @class */ (function (_super) {
            __extends(ParserError, _super);
            function ParserError(message, pos, loc, raisedAt) {
                var _this_1 = _super.call(this, message) || this;
                _this_1.pos = pos;
                _this_1.loc = loc;
                _this_1.raisedAt = raisedAt;
                return _this_1;
            }
            return ParserError;
        }(SyntaxError));
        function raise(pos, message) {
            if (pos instanceof Error) {
                throw pos;
            }
            var loc = getLineInfo(input, pos);
            message += " (" + loc.line + ":" + loc.column + ")";
            throw new ParserError(message, pos, loc, tokPos);
        }
        // Reused empty array added for node fields that are always empty.
        var empty = [];
        // ## Token types
        // The assignment of fine-grained, information-carrying type objects
        // allows the tokenizer to store the information it has about a
        // token in a way that is very cheap for the parser to look up.
        // All token type variables start with an underscore, to make them
        // easy to recognize.
        // These are the general types. The `type` property is only used to
        // make them recognizeable when debugging.
        var _num = {
            type: "num"
        }, _regexp = {
            type: "regexp"
        }, _string = {
            type: "string"
        };
        var _name = {
            type: "name"
        }, _eof = {
            type: "eof"
        };
        // Keyword tokens. The `keyword` property (also used in keyword-like
        // operators) indicates that the token originated from an
        // identifier-like word, which is used when parsing property names.
        //
        // The `beforeExpr` property is used to disambiguate between regular
        // expressions and divisions. It is set on all token types that can
        // be followed by an expression (thus, a slash after them would be a
        // regular expression).
        //
        // `isLoop` marks a keyword as starting a loop, which is important
        // to know when parsing a label, in order to allow or disallow
        // continue jumps to that label.
        var _break = {
            keyword: "break"
        }, _case = {
            keyword: "case",
            beforeExpr: true
        }, _catch = {
            keyword: "catch"
        };
        var _continue = {
            keyword: "continue"
        }, _debugger = {
            keyword: "debugger"
        }, _default = {
            keyword: "default"
        };
        var _do = {
            keyword: "do",
            isLoop: true
        }, _else = {
            keyword: "else",
            beforeExpr: true
        };
        var _finally = {
            keyword: "finally"
        }, _for = {
            keyword: "for",
            isLoop: true
        }, _function = {
            keyword: "function"
        };
        var _if = {
            keyword: "if"
        }, _return = {
            keyword: "return",
            beforeExpr: true
        }, _switch = {
            keyword: "switch"
        };
        var _throw = {
            keyword: "throw",
            beforeExpr: true
        }, _try = {
            keyword: "try"
        }, _var = {
            keyword: "var"
        };
        var _let = {
            keyword: "let"
        }, _const = {
            keyword: "const"
        };
        var _while = {
            keyword: "while",
            isLoop: true
        }, _with = {
            keyword: "with"
        }, _new = {
            keyword: "new",
            beforeExpr: true
        };
        var _this = {
            keyword: "this"
        };
        var _class = {
            keyword: "class"
        }, _extends = {
            keyword: "extends",
            beforeExpr: true
        };
        var _export = {
            keyword: "export"
        }, _import = {
            keyword: "import"
        };
        var _yield = {
            keyword: "yield",
            beforeExpr: true
        };
        // The keywords that denote values.
        var _null = {
            keyword: "null",
            atomValue: null
        }, _true = {
            keyword: "true",
            atomValue: true
        };
        var _false = {
            keyword: "false",
            atomValue: false
        };
        // Some keywords are treated as regular operators. `in` sometimes
        // (when parsing `for`) needs to be tested against specifically, so
        // we assign a variable name to it for quick comparing.
        var _in = {
            keyword: "in",
            binop: 7,
            beforeExpr: true
        };
        // Map keyword names to token types.
        var keywordTypes = {
            "break": _break,
            "case": _case,
            "catch": _catch,
            "continue": _continue,
            "debugger": _debugger,
            "default": _default,
            "do": _do,
            "else": _else,
            "finally": _finally,
            "for": _for,
            "function": _function,
            "if": _if,
            "return": _return,
            "switch": _switch,
            "throw": _throw,
            "try": _try,
            "var": _var,
            "let": _let,
            "const": _const,
            "while": _while,
            "with": _with,
            "null": _null,
            "true": _true,
            "false": _false,
            "new": _new,
            "in": _in,
            "instanceof": {
                keyword: "instanceof",
                binop: 7,
                beforeExpr: true
            },
            "this": _this,
            "typeof": {
                keyword: "typeof",
                prefix: true,
                beforeExpr: true
            },
            "void": {
                keyword: "void",
                prefix: true,
                beforeExpr: true
            },
            "delete": {
                keyword: "delete",
                prefix: true,
                beforeExpr: true
            },
            "class": _class,
            "extends": _extends,
            "export": _export,
            "import": _import,
            "yield": _yield
        };
        // Punctuation token types. Again, the `type` property is purely for debugging.
        var _bracketL = {
            type: "[",
            beforeExpr: true
        }, _bracketR = {
            type: "]"
        }, _braceL = {
            type: "{",
            beforeExpr: true
        };
        var _braceR = {
            type: "}"
        }, _parenL = {
            type: "(",
            beforeExpr: true
        }, _parenR = {
            type: ")"
        };
        var _comma = {
            type: ",",
            beforeExpr: true
        }, _semi = {
            type: ";",
            beforeExpr: true
        };
        var _colon = {
            type: ":",
            beforeExpr: true
        }, _dot = {
            type: "."
        }, _question = {
            type: "?",
            beforeExpr: true
        };
        var _arrow = {
            type: "=>",
            beforeExpr: true
        }, _template = {
            type: "template"
        };
        var _ellipsis = {
            type: "...",
            beforeExpr: true
        };
        var _backQuote = {
            type: "`"
        }, _dollarBraceL = {
            type: "${",
            beforeExpr: true
        };
        // Operators. These carry several kinds of properties to help the
        // parser use them properly (the presence of these properties is
        // what categorizes them as operators).
        //
        // `binop`, when present, specifies that this operator is a binary
        // operator, and will refer to its precedence.
        //
        // `prefix` and `postfix` mark the operator as a prefix or postfix
        // unary operator. `isUpdate` specifies that the node produced by
        // the operator should be of type UpdateExpression rather than
        // simply UnaryExpression (`++` and `--`).
        //
        // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
        // binary operators with a very low precedence, that should result
        // in AssignmentExpression nodes.
        var _slash = {
            binop: 10,
            beforeExpr: true
        }, _eq = {
            isAssign: true,
            beforeExpr: true
        };
        var _assign = {
            isAssign: true,
            beforeExpr: true
        };
        var _incDec = {
            postfix: true,
            prefix: true,
            isUpdate: true
        }, _prefix = {
            prefix: true,
            beforeExpr: true
        };
        var _logicalOR = {
            binop: 1,
            beforeExpr: true
        };
        var _logicalAND = {
            binop: 2,
            beforeExpr: true
        };
        var _bitwiseOR = {
            binop: 3,
            beforeExpr: true
        };
        var _bitwiseXOR = {
            binop: 4,
            beforeExpr: true
        };
        var _bitwiseAND = {
            binop: 5,
            beforeExpr: true
        };
        var _equality = {
            binop: 6,
            beforeExpr: true
        };
        var _relational = {
            binop: 7,
            beforeExpr: true
        };
        var _bitShift = {
            binop: 8,
            beforeExpr: true
        };
        var _plusMin = {
            binop: 9,
            prefix: true,
            beforeExpr: true
        };
        var _modulo = {
            binop: 10,
            beforeExpr: true
        };
        // '*' may be multiply or have special meaning in ES6
        var _star = {
            binop: 10,
            beforeExpr: true
        };
        // Provide access to the token types for external users of the
        // tokenizer.
        acorn.tokTypes = {
            bracketL: _bracketL,
            bracketR: _bracketR,
            braceL: _braceL,
            braceR: _braceR,
            parenL: _parenL,
            parenR: _parenR,
            comma: _comma,
            semi: _semi,
            colon: _colon,
            dot: _dot,
            ellipsis: _ellipsis,
            question: _question,
            slash: _slash,
            eq: _eq,
            name: _name,
            eof: _eof,
            num: _num,
            regexp: _regexp,
            string: _string,
            arrow: _arrow,
            template: _template,
            star: _star,
            assign: _assign,
            backQuote: _backQuote,
            dollarBraceL: _dollarBraceL
        };
        for (var kw in keywordTypes)
            acorn.tokTypes["_" + kw] = keywordTypes[kw];
        // This is a trick taken from Esprima. It turns out that, on
        // non-Chrome browsers, to check whether a string is in a set, a
        // predicate containing a big ugly `switch` statement is faster than
        // a regular expression, and on Chrome the two are about on par.
        // This function uses `eval` (non-lexical) to produce such a
        // predicate from a space-separated string of words.
        //
        // It starts by sorting the words by length.
        function makePredicate(words) {
            var newWords = String(words).split(" ");
            return function (str) { return newWords.includes(str); };
        }
        // The ECMAScript 3 reserved word list.
        var isReservedWord3 = makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile");
        // ECMAScript 5 reserved words.
        var isReservedWord5 = makePredicate("class enum extends super const export import");
        // The additional reserved words in strict mode.
        var isStrictReservedWord = makePredicate("implements interface let package private protected public static yield");
        // The forbidden variable names in strict mode.
        var isStrictBadIdWord = makePredicate("eval arguments");
        // And the keywords.
        var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
        var isEcma5AndLessKeyword = makePredicate(ecma5AndLessKeywords);
        var isEcma6Keyword = makePredicate(ecma5AndLessKeywords + " let const class extends export import yield");
        var isKeyword = isEcma5AndLessKeyword;
        // ## Character categories
        // Big ugly regular expressions that match characters in the
        // whitespace, identifier, and identifier-start categories. These
        // are only applied when a character is found to actually have a
        // code point above 128.
        // Generated by `tools/generate-identifier-regex.js`.
        var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
        var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
        var nonASCIIidentifierChars = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19B0-\u19C0\u19C8\u19C9\u19D0-\u19D9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F1\uA900-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
        var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
        var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
        // Whether a single character denotes a newline.
        var newline = /[\n\r\u2028\u2029]/;
        function isNewLine(code) {
            return code === 10 || code === 13 || code === 0x2028 || code == 0x2029;
        }
        // Matches a whole line break (where CRLF is considered a single
        // line break). Used to count lines.
        var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;
        // Test whether a given character code starts an identifier.
        var isIdentifierStart = function (code) {
            if (code < 65)
                return code === 36;
            if (code < 91)
                return true;
            if (code < 97)
                return code === 95;
            if (code < 123)
                return true;
            return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
        };
        // Test whether a given character is part of an identifier.
        var isIdentifierChar = function (code) {
            if (code < 48)
                return code === 36;
            if (code < 58)
                return true;
            if (code < 65)
                return false;
            if (code < 91)
                return true;
            if (code < 97)
                return code === 95;
            if (code < 123)
                return true;
            return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
        };
        // ## Tokenizer
        // These are used when `options.locations` is on, for the
        // `tokStartLoc` and `tokEndLoc` properties.
        function Position(line, col) {
            this.line = line;
            this.column = col;
        }
        Position.prototype.offset = function (n) {
            return new Position(this.line, this.column + n);
        };
        function curPosition() {
            return new Position(tokCurLine, tokPos - tokLineStart);
        }
        // Reset the token state. Used at the start of a parse.
        function initTokenState(pos) {
            if (pos) {
                tokPos = pos;
                tokLineStart = Math.max(0, input.lastIndexOf("\n", pos));
                tokCurLine = input.slice(0, tokLineStart).split(newline).length;
            }
            else {
                tokCurLine = 1;
                tokPos = tokLineStart = 0;
            }
            tokType = _eof;
            tokContext = [b_stat];
            tokExprAllowed = true;
            strict = false;
            if (tokPos === 0 && options.allowHashBang && input.slice(0, 2) === '#!') {
                skipLineComment(2);
            }
        }
        // The algorithm used to determine whether a regexp can appear at a
        // given point in the program is loosely based on sweet.js' approach.
        // See https://github.com/mozilla/sweet.js/wiki/design
        var b_stat = {
            token: "{",
            isExpr: false
        }, b_expr = {
            token: "{",
            isExpr: true
        }, b_tmpl = {
            token: "${",
            isExpr: true
        };
        var p_stat = {
            token: "(",
            isExpr: false
        }, p_expr = {
            token: "(",
            isExpr: true
        };
        var q_tmpl = {
            token: "`",
            isExpr: true
        }, f_expr = {
            token: "function",
            isExpr: true
        };
        function curTokContext() {
            return tokContext[tokContext.length - 1];
        }
        function braceIsBlock(prevType) {
            var parent;
            if (prevType === _colon && (parent = curTokContext()).token == "{")
                return !parent.isExpr;
            if (prevType === _return)
                return newline.test(input.slice(lastEnd, tokStart));
            if (prevType === _else || prevType === _semi || prevType === _eof)
                return true;
            if (prevType == _braceL)
                return curTokContext() === b_stat;
            return !tokExprAllowed;
        }
        // Called at the end of every token. Sets `tokEnd`, `tokVal`, and
        // maintains `tokContext` and `tokExprAllowed`, and skips the space
        // after the token, so that the next one's `tokStart` will point at
        // the right position.
        function finishToken(type, val) {
            tokEnd = tokPos;
            if (options.locations)
                tokEndLoc = curPosition();
            var prevType = tokType, preserveSpace = false;
            tokType = type;
            tokVal = val;
            // Update context info
            if (type === _parenR || type === _braceR) {
                var out = tokContext.pop();
                if (out === b_tmpl) {
                    preserveSpace = true;
                }
                else if (out === b_stat && curTokContext() === f_expr) {
                    tokContext.pop();
                    tokExprAllowed = false;
                }
                else {
                    tokExprAllowed = !(out && out.isExpr);
                }
            }
            else if (type === _braceL) {
                tokContext.push(braceIsBlock(prevType) ? b_stat : b_expr);
                tokExprAllowed = true;
            }
            else if (type === _dollarBraceL) {
                tokContext.push(b_tmpl);
                tokExprAllowed = true;
            }
            else if (type == _parenL) {
                var statementParens = prevType === _if || prevType === _for || prevType === _with || prevType === _while;
                tokContext.push(statementParens ? p_stat : p_expr);
                tokExprAllowed = true;
            }
            else if (type == _incDec) ;
            else if (type.keyword && prevType == _dot) {
                tokExprAllowed = false;
            }
            else if (type == _function) {
                if (curTokContext() !== b_stat) {
                    tokContext.push(f_expr);
                }
                tokExprAllowed = false;
            }
            else if (type === _backQuote) {
                if (curTokContext() === q_tmpl) {
                    tokContext.pop();
                }
                else {
                    tokContext.push(q_tmpl);
                    preserveSpace = true;
                }
                tokExprAllowed = false;
            }
            else {
                tokExprAllowed = type.beforeExpr;
            }
            if (!preserveSpace)
                skipSpace();
        }
        function skipBlockComment() {
            var start = tokPos, end = input.indexOf("*/", tokPos += 2);
            if (end === -1)
                raise(tokPos - 2, "Unterminated comment");
            tokPos = end + 2;
            if (options.locations) {
                lineBreak.lastIndex = start;
                var match;
                while ((match = lineBreak.exec(input)) && match.index < tokPos) {
                    ++tokCurLine;
                    tokLineStart = match.index + match[0].length;
                }
            }
        }
        function skipLineComment(startSkip) {
            var ch = input.charCodeAt(tokPos += startSkip);
            while (tokPos < inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
                ++tokPos;
                ch = input.charCodeAt(tokPos);
            }
        }
        // Called at the start of the parse and after every token. Skips
        // whitespace and comments, and.
        function skipSpace() {
            while (tokPos < inputLen) {
                var ch = input.charCodeAt(tokPos);
                if (ch === 32) { // ' '
                    ++tokPos;
                }
                else if (ch === 13) {
                    ++tokPos;
                    var next = input.charCodeAt(tokPos);
                    if (next === 10) {
                        ++tokPos;
                    }
                    if (options.locations) {
                        ++tokCurLine;
                        tokLineStart = tokPos;
                    }
                }
                else if (ch === 10 || ch === 8232 || ch === 8233) {
                    ++tokPos;
                    if (options.locations) {
                        ++tokCurLine;
                        tokLineStart = tokPos;
                    }
                }
                else if (ch > 8 && ch < 14) {
                    ++tokPos;
                }
                else if (ch === 47) { // '/'
                    var next = input.charCodeAt(tokPos + 1);
                    if (next === 42) { // '*'
                        skipBlockComment();
                    }
                    else if (next === 47) { // '/'
                        skipLineComment(2);
                    }
                    else
                        break;
                }
                else if (ch === 160) { // '\xa0'
                    ++tokPos;
                }
                else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
                    ++tokPos;
                }
                else {
                    break;
                }
            }
        }
        // ### Token reading
        // This is the function that is called to fetch the next token. It
        // is somewhat obscure, because it works in character codes rather
        // than characters, and because operator parsing has been inlined
        // into it.
        //
        // All in the name of speed.
        //
        function readToken_dot() {
            var next = input.charCodeAt(tokPos + 1);
            if (next >= 48 && next <= 57)
                return readNumber(true);
            var next2 = input.charCodeAt(tokPos + 2);
            if (options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
                tokPos += 3;
                return finishToken(_ellipsis);
            }
            else {
                ++tokPos;
                return finishToken(_dot);
            }
        }
        function readToken_slash() {
            var next = input.charCodeAt(tokPos + 1);
            if (tokExprAllowed) {
                ++tokPos;
                return readRegexp();
            }
            if (next === 61)
                return finishOp(_assign, 2);
            return finishOp(_slash, 1);
        }
        function readToken_mult_modulo(code) {
            var next = input.charCodeAt(tokPos + 1);
            if (next === 61)
                return finishOp(_assign, 2);
            return finishOp(code === 42 ? _star : _modulo, 1);
        }
        function readToken_pipe_amp(code) {
            var next = input.charCodeAt(tokPos + 1);
            if (next === code)
                return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
            if (next === 61)
                return finishOp(_assign, 2);
            return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
        }
        function readToken_caret() {
            var next = input.charCodeAt(tokPos + 1);
            if (next === 61)
                return finishOp(_assign, 2);
            return finishOp(_bitwiseXOR, 1);
        }
        function readToken_plus_min(code) {
            var next = input.charCodeAt(tokPos + 1);
            if (next === code) {
                if (next == 45 && input.charCodeAt(tokPos + 2) == 62 &&
                    newline.test(input.slice(lastEnd, tokPos))) {
                    // A `-->` line comment
                    skipLineComment(3);
                    skipSpace();
                    return readToken();
                }
                return finishOp(_incDec, 2);
            }
            if (next === 61)
                return finishOp(_assign, 2);
            return finishOp(_plusMin, 1);
        }
        function readToken_lt_gt(code) {
            var next = input.charCodeAt(tokPos + 1);
            var size = 1;
            if (next === code) {
                size = code === 62 && input.charCodeAt(tokPos + 2) === 62 ? 3 : 2;
                if (input.charCodeAt(tokPos + size) === 61)
                    return finishOp(_assign, size + 1);
                return finishOp(_bitShift, size);
            }
            if (next == 33 && code == 60 && input.charCodeAt(tokPos + 2) == 45 &&
                input.charCodeAt(tokPos + 3) == 45) {
                // `<!--`, an XML-style comment that should be interpreted as a line comment
                skipLineComment(4);
                skipSpace();
                return readToken();
            }
            if (next === 61)
                size = input.charCodeAt(tokPos + 2) === 61 ? 3 : 2;
            return finishOp(_relational, size);
        }
        function readToken_eq_excl(code) {
            var next = input.charCodeAt(tokPos + 1);
            if (next === 61)
                return finishOp(_equality, input.charCodeAt(tokPos + 2) === 61 ? 3 : 2);
            if (code === 61 && next === 62 && options.ecmaVersion >= 6) { // '=>'
                tokPos += 2;
                return finishToken(_arrow);
            }
            return finishOp(code === 61 ? _eq : _prefix, 1);
        }
        function getTokenFromCode(code) {
            switch (code) {
                // The interpretation of a dot depends on whether it is followed
                // by a digit or another two dots.
                case 46: // '.'
                    return readToken_dot();
                // Punctuation tokens.
                case 40:
                    ++tokPos;
                    return finishToken(_parenL);
                case 41:
                    ++tokPos;
                    return finishToken(_parenR);
                case 59:
                    ++tokPos;
                    return finishToken(_semi);
                case 44:
                    ++tokPos;
                    return finishToken(_comma);
                case 91:
                    ++tokPos;
                    return finishToken(_bracketL);
                case 93:
                    ++tokPos;
                    return finishToken(_bracketR);
                case 123:
                    ++tokPos;
                    return finishToken(_braceL);
                case 125:
                    ++tokPos;
                    return finishToken(_braceR);
                case 58:
                    ++tokPos;
                    return finishToken(_colon);
                case 63:
                    ++tokPos;
                    return finishToken(_question);
                case 96: // '`'
                    if (options.ecmaVersion >= 6) {
                        ++tokPos;
                        return finishToken(_backQuote);
                    }
                    else {
                        return false;
                    }
                case 48: // '0'
                    var next = input.charCodeAt(tokPos + 1);
                    if (next === 120 || next === 88)
                        return readRadixNumber(16); // '0x', '0X' - hex number
                    if (options.ecmaVersion >= 6) {
                        if (next === 111 || next === 79)
                            return readRadixNumber(8); // '0o', '0O' - octal number
                        if (next === 98 || next === 66)
                            return readRadixNumber(2); // '0b', '0B' - binary number
                    }
                // Anything else beginning with a digit is an integer, octal
                // number, or float.
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57: // 1-9
                    return readNumber(false);
                // Quotes produce strings.
                case 34:
                case 39: // '"', "'"
                    return readString(code);
                // Operators are parsed inline in tiny state machines. '=' (61) is
                // often referred to. `finishOp` simply skips the amount of
                // characters it is given as second argument, and returns a token
                // of the type given by its first argument.
                case 47: // '/'
                    return readToken_slash();
                case 37:
                case 42: // '%*'
                    return readToken_mult_modulo(code);
                case 124:
                case 38: // '|&'
                    return readToken_pipe_amp(code);
                case 94: // '^'
                    return readToken_caret();
                case 43:
                case 45: // '+-'
                    return readToken_plus_min(code);
                case 60:
                case 62: // '<>'
                    return readToken_lt_gt(code);
                case 61:
                case 33: // '=!'
                    return readToken_eq_excl(code);
                case 126: // '~'
                    return finishOp(_prefix, 1);
            }
            return false;
        }
        function readToken() {
            tokStart = tokPos;
            if (options.locations)
                tokStartLoc = curPosition();
            if (tokPos >= inputLen)
                return finishToken(_eof);
            if (curTokContext() === q_tmpl) {
                return readTmplToken();
            }
            var code = input.charCodeAt(tokPos);
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            if (isIdentifierStart(code) || code === 92 /* '\' */)
                return readWord();
            var tok = getTokenFromCode(code);
            if (tok === false) {
                // If we are here, we either found a non-ASCII identifier
                // character, or something that's entirely disallowed.
                var ch = String.fromCharCode(code);
                if (ch === "\\" || nonASCIIidentifierStart.test(ch))
                    return readWord();
                raise(tokPos, "Unexpected character '" + ch + "'");
            }
            return tok;
        }
        function finishOp(type, size) {
            var str = input.slice(tokPos, tokPos + size);
            tokPos += size;
            finishToken(type, str);
        }
        var regexpUnicodeSupport = false;
        try {
            new RegExp("\uffff", "u");
            regexpUnicodeSupport = true;
        }
        catch (e) { }
        // Parse a regular expression. Some context-awareness is necessary,
        // since a '/' inside a '[]' set does not end the expression.
        function readRegexp() {
            var content = "", escaped, inClass, start = tokPos;
            for (;;) {
                if (tokPos >= inputLen)
                    raise(start, "Unterminated regular expression");
                var ch = input.charAt(tokPos);
                if (newline.test(ch))
                    raise(start, "Unterminated regular expression");
                if (!escaped) {
                    if (ch === "[")
                        inClass = true;
                    else if (ch === "]" && inClass)
                        inClass = false;
                    else if (ch === "/" && !inClass)
                        break;
                    escaped = ch === "\\";
                }
                else
                    escaped = false;
                ++tokPos;
            }
            var content = input.slice(start, tokPos);
            ++tokPos;
            // Need to use `readWord1` because '\uXXXX' sequences are allowed
            // here (don't ask).
            var mods = readWord1();
            var tmp = content;
            if (mods) {
                var validFlags = /^[gmsiy]*$/;
                if (options.ecmaVersion >= 6)
                    validFlags = /^[gmsiyu]*$/;
                if (!validFlags.test(mods))
                    raise(start, "Invalid regular expression flag");
                if (mods.indexOf('u') >= 0 && !regexpUnicodeSupport) {
                    // Replace each astral symbol and every Unicode code point
                    // escape sequence that represents such a symbol with a single
                    // ASCII symbol to avoid throwing on regular expressions that
                    // are only valid in combination with the `/u` flag.
                    tmp = tmp
                        .replace(/\\u\{([0-9a-fA-F]{5,6})\}/g, "x")
                        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
                }
            }
            // Detect invalid regular expressions.
            try {
                new RegExp(tmp);
            }
            catch (e) {
                if (e instanceof SyntaxError)
                    raise(start, "Error parsing regular expression: " + e.message);
                raise(e);
            }
            // Get a regular expression object for this pattern-flag pair, or `null` in
            // case the current environment doesn't support the flags it uses.
            try {
                var value = new RegExp(content, mods);
            }
            catch (err) {
                value = null;
            }
            // @ts-ignore
            return finishToken(_regexp, {
                pattern: content,
                flags: mods,
                value: value
            });
        }
        // Read an integer in the given radix. Return null if zero digits
        // were read, the integer value otherwise. When `len` is given, this
        // will return `null` unless the integer has exactly `len` digits.
        function readInt(radix, len) {
            var start = tokPos, total = 0;
            for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
                var code = input.charCodeAt(tokPos), val;
                if (code >= 97)
                    val = code - 97 + 10; // a
                else if (code >= 65)
                    val = code - 65 + 10; // A
                else if (code >= 48 && code <= 57)
                    val = code - 48; // 0-9
                else
                    val = Infinity;
                if (val >= radix)
                    break;
                ++tokPos;
                total = total * Number(radix) + val;
            }
            if (tokPos === start || len != null && tokPos - start !== len)
                return null;
            return total;
        }
        function readRadixNumber(radix) {
            tokPos += 2; // 0x
            var val = readInt(radix);
            if (val == null)
                raise(tokStart + 2, "Expected number in radix " + radix);
            if (isIdentifierStart(input.charCodeAt(tokPos)))
                raise(tokPos, "Identifier directly after number");
            return finishToken(_num, val);
        }
        // Read an integer, octal integer, or floating-point number.
        function readNumber(startsWithDot) {
            var start = tokPos, isFloat = false, octal = input.charCodeAt(tokPos) === 48;
            if (!startsWithDot && readInt(10) === null)
                raise(start, "Invalid number");
            if (input.charCodeAt(tokPos) === 46) {
                ++tokPos;
                readInt(10);
                isFloat = true;
            }
            var next = input.charCodeAt(tokPos);
            if (next === 69 || next === 101) { // 'eE'
                next = input.charCodeAt(++tokPos);
                if (next === 43 || next === 45)
                    ++tokPos; // '+-'
                if (readInt(10) === null)
                    raise(start, "Invalid number");
                isFloat = true;
            }
            if (isIdentifierStart(input.charCodeAt(tokPos)))
                raise(tokPos, "Identifier directly after number");
            var str = input.slice(start, tokPos), val;
            if (isFloat)
                val = parseFloat(str);
            else if (!octal || str.length === 1)
                val = parseInt(str, 10);
            else if (/[89]/.test(str) || strict)
                raise(start, "Invalid number");
            else
                val = parseInt(str, 8);
            return finishToken(_num, val);
        }
        // Read a string value, interpreting backslash-escapes.
        function readCodePoint() {
            var ch = input.charCodeAt(tokPos), code;
            if (ch === 123) {
                if (options.ecmaVersion < 6)
                    unexpected();
                ++tokPos;
                code = readHexChar(input.indexOf('}', tokPos) - tokPos);
                ++tokPos;
                if (code > 0x10FFFF)
                    unexpected();
            }
            else {
                code = readHexChar(4);
            }
            // UTF-16 Encoding
            if (code <= 0xFFFF) {
                return String.fromCharCode(code);
            }
            var cu1 = ((code - 0x10000) >> 10) + 0xD800;
            var cu2 = ((code - 0x10000) & 1023) + 0xDC00;
            return String.fromCharCode(cu1, cu2);
        }
        function readString(quote) {
            var out = "", chunkStart = ++tokPos;
            for (;;) {
                if (tokPos >= inputLen)
                    raise(tokStart, "Unterminated string constant");
                var ch = input.charCodeAt(tokPos);
                if (ch === quote)
                    break;
                if (ch === 92) { // '\'
                    out += input.slice(chunkStart, tokPos);
                    out += readEscapedChar();
                    chunkStart = tokPos;
                }
                else {
                    if (isNewLine(ch))
                        raise(tokStart, "Unterminated string constant");
                    ++tokPos;
                }
            }
            out += input.slice(chunkStart, tokPos++);
            return finishToken(_string, out);
        }
        // Reads template string tokens.
        function readTmplToken() {
            var out = "", chunkStart = tokPos;
            for (;;) {
                if (tokPos >= inputLen)
                    raise(tokStart, "Unterminated template");
                var ch = input.charCodeAt(tokPos);
                if (ch === 96 || ch === 36 && input.charCodeAt(tokPos + 1) === 123) { // '`', '${'
                    if (tokPos === tokStart && tokType === _template) {
                        if (ch === 36) {
                            tokPos += 2;
                            return finishToken(_dollarBraceL);
                        }
                        else {
                            ++tokPos;
                            return finishToken(_backQuote);
                        }
                    }
                    out += input.slice(chunkStart, tokPos);
                    return finishToken(_template, out);
                }
                if (ch === 92) { // '\'
                    out += input.slice(chunkStart, tokPos);
                    out += readEscapedChar();
                    chunkStart = tokPos;
                }
                else if (isNewLine(ch)) {
                    out += input.slice(chunkStart, tokPos);
                    ++tokPos;
                    if (ch === 13 && input.charCodeAt(tokPos) === 10) {
                        ++tokPos;
                        out += "\n";
                    }
                    else {
                        out += String.fromCharCode(ch);
                    }
                    if (options.locations) {
                        ++tokCurLine;
                        tokLineStart = tokPos;
                    }
                    chunkStart = tokPos;
                }
                else {
                    ++tokPos;
                }
            }
        }
        // Used to read escaped characters
        function readEscapedChar() {
            var ch = input.charCodeAt(++tokPos);
            var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
            if (octal)
                octal = octal[0];
            while (octal && parseInt(octal, 8) > 255)
                octal = octal.slice(0, -1);
            if (octal === "0")
                octal = null;
            ++tokPos;
            if (octal) {
                if (strict)
                    raise(tokPos - 2, "Octal literal in strict mode");
                tokPos += octal.length - 1;
                return String.fromCharCode(parseInt(octal, 8));
            }
            else {
                switch (ch) {
                    case 110:
                        return "\n"; // 'n' -> '\n'
                    case 114:
                        return "\r"; // 'r' -> '\r'
                    case 120:
                        return String.fromCharCode(readHexChar(2)); // 'x'
                    case 117:
                        return readCodePoint(); // 'u'
                    case 116:
                        return "\t"; // 't' -> '\t'
                    case 98:
                        return "\b"; // 'b' -> '\b'
                    case 118:
                        return "\u000b"; // 'v' -> '\u000b'
                    case 102:
                        return "\f"; // 'f' -> '\f'
                    case 48:
                        return "\0"; // 0 -> '\0'
                    case 13:
                        if (input.charCodeAt(tokPos) === 10)
                            ++tokPos; // '\r\n'
                    case 10: // ' \n'
                        if (options.locations) {
                            tokLineStart = tokPos;
                            ++tokCurLine;
                        }
                        return "";
                    default:
                        return String.fromCharCode(ch);
                }
            }
        }
        // Used to read character escape sequences ('\x', '\u', '\U').
        function readHexChar(len) {
            var n = readInt(16, len);
            if (n === null)
                raise(tokStart, "Bad character escape sequence");
            return n;
        }
        // Used to signal to callers of `readWord1` whether the word
        // contained any escape sequences. This is needed because words with
        // escape sequences must not be interpreted as keywords.
        var containsEsc;
        // Read an identifier, and return it as a string. Sets `containsEsc`
        // to whether the word contained a '\u' escape.
        //
        // Incrementally adds only escaped chars, adding other chunks as-is
        // as a micro-optimization.
        function readWord1() {
            containsEsc = false;
            var word = "", first = true, chunkStart = tokPos;
            while (tokPos < inputLen) {
                var ch = input.charCodeAt(tokPos);
                if (isIdentifierChar(ch)) {
                    ++tokPos;
                }
                else if (ch === 92) { // "\"
                    containsEsc = true;
                    word += input.slice(chunkStart, tokPos);
                    if (input.charCodeAt(++tokPos) != 117) // "u"
                        raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
                    ++tokPos;
                    var esc = readHexChar(4);
                    var escStr = String.fromCharCode(esc);
                    if (!escStr)
                        raise(tokPos - 1, "Invalid Unicode escape");
                    if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc)))
                        raise(tokPos - 4, "Invalid Unicode escape");
                    word += escStr;
                    chunkStart = tokPos;
                }
                else {
                    break;
                }
                first = false;
            }
            return word + input.slice(chunkStart, tokPos);
        }
        // Read an identifier or keyword token. Will check for reserved
        // words when necessary.
        function readWord() {
            var word = readWord1();
            var type = _name;
            if (!containsEsc && isKeyword(word))
                type = keywordTypes[word];
            return finishToken(type, word);
        }
        // ## Parser
        // A recursive descent parser operates by defining functions for all
        // syntactic elements, and recursively calling those, each function
        // advancing the input stream and returning an AST node. Precedence
        // of constructs (for example, the fact that `!x[1]` means `!(x[1])`
        // instead of `(!x)[1]` is handled by the fact that the parser
        // function that parses unary prefix operators is called first, and
        // in turn calls the function that parses `[]` subscripts — that
        // way, it'll receive the node for `x[1]` already parsed, and wraps
        // *that* in the unary operator node.
        //
        // Acorn uses an [operator precedence parser][opp] to handle binary
        // operator precedence, because it is much more compact than using
        // the technique outlined above, which uses different, nesting
        // functions to specify precedence, for all of the ten binary
        // precedence levels that JavaScript defines.
        //
        // [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser
        // ### Parser utilities
        // Continue to the next token.
        function next() {
            lastStart = tokStart;
            lastEnd = tokEnd;
            lastEndLoc = tokEndLoc;
            readToken();
        }
        // Enter strict mode. Re-reads the next number or string to
        // please pedantic tests ("use strict"; 010; -- should fail).
        function setStrict(strct) {
            strict = strct;
            if (tokType !== _num && tokType !== _string)
                return;
            tokPos = tokStart;
            if (options.locations) {
                while (tokPos < tokLineStart) {
                    tokLineStart = input.lastIndexOf("\n", tokLineStart - 2) + 1;
                    --tokCurLine;
                }
            }
            skipSpace();
            readToken();
        }
        // Start an AST node, attaching a start offset.
        function Node() {
            this.type = null;
            this.start = tokStart;
            this.end = null;
        }
        function SourceLocation() {
            this.start = tokStartLoc;
            this.end = null;
            if (sourceFile !== null)
                this.source = sourceFile;
        }
        function startNode() {
            var node = new Node();
            if (options.locations)
                node.loc = new SourceLocation();
            if (options.directSourceFile)
                node.sourceFile = options.directSourceFile;
            if (options.ranges)
                node.range = [tokStart, 0];
            return node;
        }
        // Sometimes, a node is only started *after* the token stream passed
        // its start position. The functions below help storing a position
        // and creating a node from a previous position.
        function storeCurrentPos() {
            return options.locations ? [tokStart, tokStartLoc] : tokStart;
        }
        function startNodeAt(pos) {
            var node = new Node(), start = pos;
            if (options.locations) {
                node.loc = new SourceLocation();
                node.loc.start = start[1];
                start = pos[0];
            }
            node.start = start;
            if (options.directSourceFile)
                node.sourceFile = options.directSourceFile;
            if (options.ranges)
                node.range = [start, 0];
            return node;
        }
        // Finish an AST node, adding `type` and `end` properties.
        function finishNode(node, type) {
            node.type = type;
            node.end = lastEnd;
            if (options.locations)
                node.loc.end = lastEndLoc;
            if (options.ranges)
                node.range[1] = lastEnd;
            return node;
        }
        // Finish node at given position
        function finishNodeAt(node, type, pos) {
            if (options.locations) {
                node.loc.end = pos[1];
                pos = pos[0];
            }
            node.type = type;
            node.end = pos;
            if (options.ranges)
                node.range[1] = pos;
            return node;
        }
        // Test whether a statement node is the string literal `"use strict"`.
        function isUseStrict(stmt) {
            return options.ecmaVersion >= 5 && stmt.type === ExpressionStatement &&
                stmt.expression.type === Literal && stmt.expression.value === "use strict";
        }
        // Predicate that tests whether the next token is of the given
        // type, and if yes, consumes it as a side effect.
        function eat(type) {
            if (tokType === type) {
                next();
                return true;
            }
            else {
                return false;
            }
        }
        // Tests whether parsed token is a contextual keyword.
        function isContextual(name) {
            return tokType === _name && tokVal === name;
        }
        // Consumes contextual keyword if possible.
        function eatContextual(name) {
            return tokVal === name && eat(_name);
        }
        // Asserts that following token is given contextual keyword.
        function expectContextual(name) {
            if (!eatContextual(name))
                unexpected();
        }
        // Test whether a semicolon can be inserted at the current position.
        function canInsertSemicolon() {
            return !options.strictSemicolons &&
                (tokType === _eof || tokType === _braceR || newline.test(input.slice(lastEnd, tokStart)));
        }
        // Consume a semicolon, or, failing that, see if we are allowed to
        // pretend that there is a semicolon at this position.
        function semicolon() {
            if (!eat(_semi) && !canInsertSemicolon())
                unexpected();
        }
        // Expect a token of a given type. If found, consume it, otherwise,
        // raise an unexpected token error.
        function expect(type) {
            eat(type) || unexpected();
        }
        // Raise an unexpected token error.
        function unexpected(pos) {
            raise(pos != null ? pos : tokStart, "Unexpected token");
        }
        // Checks if hash object has a property.
        function has(obj, propName) {
            return Object.prototype.hasOwnProperty.call(obj, propName);
        }
        // Convert existing expression atom to assignable pattern
        // if possible.
        function toAssignable(node, isBinding) {
            if (options.ecmaVersion >= 6 && node) {
                switch (node.type) {
                    case Identifier:
                    case ObjectPattern:
                    case ArrayPattern:
                    case AssignmentPattern:
                        break;
                    case ObjectExpression:
                        node.type = ObjectPattern;
                        for (var i = 0; i < node.properties.length; i++) {
                            var prop = node.properties[i];
                            if (prop.kind !== "init")
                                raise(prop.key.start, "Object pattern can't contain getter or setter");
                            toAssignable(prop.value, isBinding);
                        }
                        break;
                    case ArrayExpression:
                        node.type = ArrayPattern;
                        toAssignableList(node.elements, isBinding);
                        break;
                    case AssignmentExpression:
                        if (node.operator === "=") {
                            node.type = AssignmentPattern;
                        }
                        else {
                            raise(node.left.end, "Only '=' operator can be used for specifying default value.");
                        }
                        break;
                    case MemberExpression:
                        if (!isBinding)
                            break;
                    default:
                        raise(node.start, "Assigning to rvalue");
                }
            }
            return node;
        }
        // Convert list of expression atoms to binding list.
        function toAssignableList(exprList, isBinding) {
            if (exprList.length) {
                for (var i = 0; i < exprList.length - 1; i++) {
                    toAssignable(exprList[i], isBinding);
                }
                var last = exprList[exprList.length - 1];
                switch (last.type) {
                    case RestElement:
                        break;
                    case SpreadElement:
                        last.type = RestElement;
                        var arg = last.argument;
                        toAssignable(arg, isBinding);
                        if (arg.type !== Identifier && arg.type !== MemberExpression && arg.type !== ArrayPattern)
                            unexpected(arg.start);
                        break;
                    default:
                        toAssignable(last, isBinding);
                }
            }
            return exprList;
        }
        // Parses spread element.
        function parseSpread(refShorthandDefaultPos) {
            var node = startNode();
            next();
            node.argument = parseMaybeAssign(refShorthandDefaultPos);
            return finishNode(node, SpreadElement);
        }
        function parseRest() {
            var node = startNode();
            next();
            node.argument = tokType === _name || tokType === _bracketL ? parseBindingAtom() : unexpected();
            return finishNode(node, RestElement);
        }
        // Parses lvalue (assignable) atom.
        function parseBindingAtom() {
            if (options.ecmaVersion < 6)
                return parseIdent();
            switch (tokType) {
                case _name:
                    return parseIdent();
                case _bracketL:
                    var node = startNode();
                    next();
                    node.elements = parseBindingList(_bracketR, true);
                    return finishNode(node, ArrayPattern);
                case _braceL:
                    return parseObj(true);
                default:
                    unexpected();
            }
        }
        function parseBindingList(close, allowEmpty) {
            var elts = [], first = true;
            while (!eat(close)) {
                first ? first = false : expect(_comma);
                if (tokType === _ellipsis) {
                    elts.push(parseRest());
                    expect(close);
                    break;
                }
                elts.push(allowEmpty && tokType === _comma ? null : parseMaybeDefault());
            }
            return elts;
        }
        // Parses assignment pattern around given atom if possible.
        function parseMaybeDefault(startPos, left) {
            startPos = startPos || storeCurrentPos();
            left = left || parseBindingAtom();
            if (!eat(_eq))
                return left;
            var node = startNodeAt(startPos);
            node.operator = "=";
            node.left = left;
            node.right = parseMaybeAssign();
            return finishNode(node, AssignmentPattern);
        }
        // Verify that argument names are not repeated, and it does not
        // try to bind the words `eval` or `arguments`.
        function checkFunctionParam(param, nameHash) {
            switch (param.type) {
                case Identifier:
                    if (isStrictReservedWord(param.name) || isStrictBadIdWord(param.name))
                        raise(param.start, "Defining '" + param.name + "' in strict mode");
                    if (has(nameHash, param.name))
                        raise(param.start, "Argument name clash in strict mode");
                    nameHash[param.name] = true;
                    break;
                case ObjectPattern:
                    for (var i = 0; i < param.properties.length; i++)
                        checkFunctionParam(param.properties[i].value, nameHash);
                    break;
                case ArrayPattern:
                    for (var i = 0; i < param.elements.length; i++) {
                        var elem = param.elements[i];
                        if (elem)
                            checkFunctionParam(elem, nameHash);
                    }
                    break;
                case RestElement:
                    return checkFunctionParam(param.argument, nameHash);
            }
        }
        // Check if property name clashes with already added.
        // Object/class getters and setters are not allowed to clash —
        // either with each other or with an init property — and in
        // strict mode, init properties are also not allowed to be repeated.
        function checkPropClash(prop, propHash) {
            if (options.ecmaVersion >= 6)
                return;
            var key = prop.key, name;
            switch (key.type) {
                case Identifier:
                    name = key.name;
                    break;
                case Literal:
                    name = String(key.value);
                    break;
                default:
                    return;
            }
            var kind = prop.kind || "init", other;
            if (has(propHash, name)) {
                other = propHash[name];
                var isGetSet = kind !== "init";
                if ((strict || isGetSet) && other[kind] || !(+isGetSet ^ other.init))
                    raise(key.start, "Redefinition of property");
            }
            else {
                other = propHash[name] = {
                    init: false,
                    get: false,
                    set: false
                };
            }
            other[kind] = true;
        }
        // Verify that a node is an lval — something that can be assigned
        // to.
        function checkLVal(expr, isBinding) {
            switch (expr.type) {
                case Identifier:
                    if (strict && (isStrictBadIdWord(expr.name) || isStrictReservedWord(expr.name)))
                        raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
                    break;
                case MemberExpression:
                    if (isBinding)
                        raise(expr.start, "Binding to member expression");
                    break;
                case ObjectPattern:
                    for (var i = 0; i < expr.properties.length; i++)
                        checkLVal(expr.properties[i].value, isBinding);
                    break;
                case ArrayPattern:
                    for (var i = 0; i < expr.elements.length; i++) {
                        var elem = expr.elements[i];
                        if (elem)
                            checkLVal(elem, isBinding);
                    }
                    break;
                case AssignmentPattern:
                    checkLVal(expr.left);
                    break;
                case RestElement:
                    checkLVal(expr.argument);
                    break;
                default:
                    raise(expr.start, "Assigning to rvalue");
            }
        }
        // ### Statement parsing
        // Parse a program. Initializes the parser, reads any number of
        // statements, and wraps them in a Program node.  Optionally takes a
        // `program` argument.  If present, the statements will be appended
        // to its body instead of creating a new node.
        function parseTopLevel(node) {
            var first = true;
            if (!node.body)
                node.body = [];
            while (tokType !== _eof) {
                var stmt = parseStatement(true, true);
                node.body.push(stmt);
                if (first && isUseStrict(stmt))
                    setStrict(true);
                first = false;
            }
            next();
            return finishNode(node, Program);
        }
        var loopLabel = {
            kind: "loop"
        }, switchLabel = {
            kind: "switch"
        };
        // Parse a single statement.
        //
        // If expecting a statement and finding a slash operator, parse a
        // regular expression literal. This is to handle cases like
        // `if (foo) /blah/.exec(foo);`, where looking at the previous token
        // does not help.
        function parseStatement(declaration, topLevel) {
            var starttype = tokType, node = startNode();
            // Most types of statements are recognized by the keyword they
            // start with. Many are trivial to parse, some require a bit of
            // complexity.
            switch (starttype) {
                case _break:
                case _continue:
                    return parseBreakContinueStatement(node, starttype.keyword);
                case _debugger:
                    return parseDebuggerStatement(node);
                case _do:
                    return parseDoStatement(node);
                case _for:
                    return parseForStatement(node);
                case _function:
                    if (!declaration && options.ecmaVersion >= 6)
                        unexpected();
                    return parseFunctionStatement(node);
                case _class:
                    if (!declaration)
                        unexpected();
                    return parseClass(node, true);
                case _if:
                    return parseIfStatement(node);
                case _return:
                    return parseReturnStatement(node);
                case _switch:
                    return parseSwitchStatement(node);
                case _throw:
                    return parseThrowStatement(node);
                case _try:
                    return parseTryStatement(node);
                case _let:
                case _const:
                    if (!declaration)
                        unexpected(); // NOTE: falls through to _var
                case _var:
                    return parseVarStatement(node, starttype.keyword);
                case _while:
                    return parseWhileStatement(node);
                case _with:
                    return parseWithStatement();
                case _braceL:
                    return parseBlock(); // no point creating a function for this
                case _semi:
                    return parseEmptyStatement(node);
                case _export:
                case _import:
                    if (!topLevel && !options.allowImportExportEverywhere)
                        raise(tokStart, "'import' and 'export' may only appear at the top level");
                    return starttype === _import ? parseImport(node) : parseExport(node);
                // If the statement does not start with a statement keyword or a
                // brace, it's an ExpressionStatement or LabeledStatement. We
                // simply start parsing an expression, and afterwards, if the
                // next token is a colon and the expression was a simple
                // Identifier node, we switch to interpreting it as a label.
                default:
                    var maybeName = tokVal, expr = parseExpression();
                    if (starttype === _name && expr.type === Identifier && eat(_colon))
                        return parseLabeledStatement(node, maybeName, expr);
                    else
                        return parseExpressionStatement(node, expr);
            }
        }
        function parseBreakContinueStatement(node, keyword) {
            var isBreak = keyword == _break.keyword;
            next();
            if (eat(_semi) || canInsertSemicolon())
                node.label = null;
            else if (tokType !== _name)
                unexpected();
            else {
                node.label = parseIdent();
                semicolon();
            }
            // Verify that there is an actual destination to break or
            // continue to.
            for (var i = 0; i < labels.length; ++i) {
                var lab = labels[i];
                if (node.label == null || lab.name === node.label.name) {
                    if (lab.kind != null && (isBreak || lab.kind === "loop"))
                        break;
                    if (node.label && isBreak)
                        break;
                }
            }
            if (i === labels.length)
                raise(node.start, "Unsyntactic " + keyword);
            return finishNode(node, isBreak ? BreakStatement : ContinueStatement);
        }
        function parseDebuggerStatement(node) {
            next();
            semicolon();
            return finishNode(node, DebuggerStatement);
        }
        function parseDoStatement(node) {
            next();
            labels.push(loopLabel);
            node.body = parseStatement(false);
            labels.pop();
            expect(_while);
            node.test = parseParenExpression();
            if (options.ecmaVersion >= 6)
                eat(_semi);
            else
                semicolon();
            return finishNode(node, DoWhileStatement);
        }
        // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
        // loop is non-trivial. Basically, we have to parse the init `var`
        // statement or expression, disallowing the `in` operator (see
        // the second parameter to `parseExpression`), and then check
        // whether the next token is `in` or `of`. When there is no init
        // part (semicolon immediately after the opening parenthesis), it
        // is a regular `for` loop.
        function parseForStatement(node) {
            next();
            labels.push(loopLabel);
            expect(_parenL);
            if (tokType === _semi)
                return parseFor(node, null);
            if (tokType === _var || tokType === _let) {
                var init = startNode(), varKind = tokType.keyword, isLet = tokType === _let;
                next();
                parseVar(init, true, varKind);
                finishNode(init, VariableDeclaration);
                if ((tokType === _in || (options.ecmaVersion >= 6 && isContextual("of"))) && init.declarations.length === 1 &&
                    !(isLet && init.declarations[0].init))
                    return parseForIn(node, init);
                return parseFor(node, init);
            }
            var refShorthandDefaultPos = {
                start: 0
            };
            var init = parseExpression(true, refShorthandDefaultPos);
            if (tokType === _in || (options.ecmaVersion >= 6 && isContextual("of"))) {
                toAssignable(init);
                checkLVal(init);
                return parseForIn(node, init);
            }
            else if (refShorthandDefaultPos.start) {
                unexpected(refShorthandDefaultPos.start);
            }
            return parseFor(node, init);
        }
        function parseFunctionStatement(node) {
            next();
            return parseFunction(node, true);
        }
        function parseIfStatement(node) {
            next();
            node.test = parseParenExpression();
            node.consequent = parseStatement(false);
            node.alternate = eat(_else) ? parseStatement(false) : null;
            return finishNode(node, IfStatement);
        }
        function parseReturnStatement(node) {
            if (!inFunction && !options.allowReturnOutsideFunction)
                raise(tokStart, "'return' outside of function");
            next();
            // In `return` (and `break`/`continue`), the keywords with
            // optional arguments, we eagerly look for a semicolon or the
            // possibility to insert one.
            if (eat(_semi) || canInsertSemicolon())
                node.argument = null;
            else {
                node.argument = parseExpression();
                semicolon();
            }
            return finishNode(node, ReturnStatement);
        }
        function parseSwitchStatement(node) {
            next();
            node.discriminant = parseParenExpression();
            node.cases = [];
            expect(_braceL);
            labels.push(switchLabel);
            // Statements under must be grouped (by label) in SwitchCase
            // nodes. `cur` is used to keep the node that we are currently
            // adding statements to.
            for (var cur, sawDefault; tokType != _braceR;) {
                if (tokType === _case || tokType === _default) {
                    var isCase = tokType === _case;
                    if (cur)
                        finishNode(cur, SwitchCase);
                    node.cases.push(cur = startNode());
                    cur.consequent = [];
                    next();
                    if (isCase)
                        cur.test = parseExpression();
                    else {
                        if (sawDefault)
                            raise(lastStart, "Multiple default clauses");
                        sawDefault = true;
                        cur.test = null;
                    }
                    expect(_colon);
                }
                else {
                    if (!cur)
                        unexpected();
                    cur.consequent.push(parseStatement(true));
                }
            }
            if (cur)
                finishNode(cur, SwitchCase);
            next(); // Closing brace
            labels.pop();
            return finishNode(node, SwitchStatement);
        }
        function parseThrowStatement(node) {
            next();
            if (newline.test(input.slice(lastEnd, tokStart)))
                raise(lastEnd, "Illegal newline after throw");
            node.argument = parseExpression();
            semicolon();
            return finishNode(node, ThrowStatement);
        }
        function parseTryStatement(node) {
            next();
            node.block = parseBlock();
            node.handler = null;
            if (tokType === _catch) {
                var clause = startNode();
                next();
                expect(_parenL);
                clause.param = parseBindingAtom();
                checkLVal(clause.param, true);
                expect(_parenR);
                clause.guard = null;
                clause.body = parseBlock();
                node.handler = finishNode(clause, CatchClause);
            }
            node.guardedHandlers = empty;
            node.finalizer = eat(_finally) ? parseBlock() : null;
            if (!node.handler && !node.finalizer)
                raise(node.start, "Missing catch or finally clause");
            return finishNode(node, TryStatement);
        }
        function parseVarStatement(node, kind) {
            next();
            parseVar(node, false, kind);
            semicolon();
            return finishNode(node, VariableDeclaration);
        }
        function parseWhileStatement(node) {
            next();
            node.test = parseParenExpression();
            labels.push(loopLabel);
            node.body = parseStatement(false);
            labels.pop();
            return finishNode(node, WhileStatement);
        }
        function parseWithStatement() {
            raise(tokStart, "with now allow");
        }
        function parseEmptyStatement(node) {
            next();
            return finishNode(node, EmptyStatement);
        }
        function parseLabeledStatement(node, maybeName, expr) {
            for (var i = 0; i < labels.length; ++i)
                if (labels[i].name === maybeName)
                    raise(expr.start, "Label '" + maybeName + "' is already declared");
            var kind = tokType.isLoop ? "loop" : tokType === _switch ? "switch" : null;
            labels.push({
                name: maybeName,
                kind: kind
            });
            node.body = parseStatement(true);
            labels.pop();
            node.label = expr;
            return finishNode(node, LabeledStatement);
        }
        function parseExpressionStatement(node, expr) {
            node.expression = expr;
            semicolon();
            return finishNode(node, ExpressionStatement);
        }
        // Used for constructs like `switch` and `if` that insist on
        // parentheses around their expression.
        function parseParenExpression() {
            expect(_parenL);
            var val = parseExpression();
            expect(_parenR);
            return val;
        }
        // Parse a semicolon-enclosed block of statements, handling `"use
        // strict"` declarations when `allowStrict` is true (used for
        // function bodies).
        function parseBlock(allowStrict) {
            var node = startNode(), first = true, oldStrict;
            node.body = [];
            expect(_braceL);
            while (!eat(_braceR)) {
                var stmt = parseStatement(true);
                node.body.push(stmt);
                if (first && allowStrict && isUseStrict(stmt)) {
                    oldStrict = strict;
                    setStrict(strict = true);
                }
                first = false;
            }
            if (oldStrict === false)
                setStrict(false);
            return finishNode(node, BlockStatement);
        }
        // Parse a regular `for` loop. The disambiguation code in
        // `parseStatement` will already have parsed the init statement or
        // expression.
        function parseFor(node, init) {
            node.init = init;
            expect(_semi);
            node.test = tokType === _semi ? null : parseExpression();
            expect(_semi);
            node.update = tokType === _parenR ? null : parseExpression();
            expect(_parenR);
            node.body = parseStatement(false);
            labels.pop();
            return finishNode(node, ForStatement);
        }
        // Parse a `for`/`in` and `for`/`of` loop, which are almost
        // same from parser's perspective.
        function parseForIn(node, init) {
            var type = tokType === _in ? ForInStatement : ForOfStatement;
            next();
            node.left = init;
            node.right = parseExpression();
            expect(_parenR);
            node.body = parseStatement(false);
            labels.pop();
            return finishNode(node, type);
        }
        // Parse a list of variable declarations.
        function parseVar(node, noIn, kind) {
            node.declarations = [];
            node.kind = kind;
            for (;;) {
                var decl = startNode();
                decl.id = parseBindingAtom();
                checkLVal(decl.id, true);
                decl.init = eat(_eq) ? parseMaybeAssign(noIn) : (kind === _const.keyword ? unexpected() : null);
                node.declarations.push(finishNode(decl, VariableDeclarator));
                if (!eat(_comma))
                    break;
            }
            return node;
        }
        // ### Expression parsing
        // These nest, from the most general expression type at the top to
        // 'atomic', nondivisible expression types at the bottom. Most of
        // the functions will simply let the function(s) below them parse,
        // and, *if* the syntactic construct they handle is present, wrap
        // the AST node that the inner parser gave them in another node.
        // Parse a full expression. The optional arguments are used to
        // forbid the `in` operator (in for loops initalization expressions)
        // and provide reference for storing '=' operator inside shorthand
        // property assignment in contexts where both object expression
        // and object pattern might appear (so it's possible to raise
        // delayed syntax error at correct position).
        function parseExpression(noIn, refShorthandDefaultPos) {
            var start = storeCurrentPos();
            var expr = parseMaybeAssign(noIn, refShorthandDefaultPos);
            if (tokType === _comma) {
                var node = startNodeAt(start);
                node.expressions = [expr];
                while (eat(_comma))
                    node.expressions.push(parseMaybeAssign(noIn, refShorthandDefaultPos));
                return finishNode(node, SequenceExpression);
            }
            return expr;
        }
        // Parse an assignment expression. This includes applications of
        // operators like `+=`.
        function parseMaybeAssign(noIn, refShorthandDefaultPos) {
            var failOnShorthandAssign;
            if (!refShorthandDefaultPos) {
                refShorthandDefaultPos = {
                    start: 0
                };
                failOnShorthandAssign = true;
            }
            else {
                failOnShorthandAssign = false;
            }
            var start = storeCurrentPos();
            var left = parseMaybeConditional(noIn, refShorthandDefaultPos);
            if (tokType.isAssign) {
                var node = startNodeAt(start);
                node.operator = tokVal;
                node.left = tokType === _eq ? toAssignable(left) : left;
                refShorthandDefaultPos.start = 0; // reset because shorthand default was used correctly
                checkLVal(left);
                next();
                node.right = parseMaybeAssign(noIn);
                return finishNode(node, AssignmentExpression);
            }
            else if (failOnShorthandAssign && refShorthandDefaultPos.start) {
                unexpected(refShorthandDefaultPos.start);
            }
            return left;
        }
        // Parse a ternary conditional (`?:`) operator.
        function parseMaybeConditional(noIn, refShorthandDefaultPos) {
            var start = storeCurrentPos();
            var expr = parseExprOps(noIn, refShorthandDefaultPos);
            if (refShorthandDefaultPos && refShorthandDefaultPos.start)
                return expr;
            if (eat(_question)) {
                var node = startNodeAt(start);
                node.test = expr;
                node.consequent = parseMaybeAssign();
                expect(_colon);
                node.alternate = parseMaybeAssign(noIn);
                return finishNode(node, ConditionalExpression);
            }
            return expr;
        }
        // Start the precedence parser.
        function parseExprOps(noIn, refShorthandDefaultPos) {
            var start = storeCurrentPos();
            var expr = parseMaybeUnary(refShorthandDefaultPos);
            if (refShorthandDefaultPos && refShorthandDefaultPos.start)
                return expr;
            return parseExprOp(expr, start, -1, noIn);
        }
        // Parse binary operators with the operator precedence parsing
        // algorithm. `left` is the left-hand side of the operator.
        // `minPrec` provides context that allows the function to stop and
        // defer further parser to one of its callers when it encounters an
        // operator that has a lower precedence than the set it is parsing.
        function parseExprOp(left, leftStart, minPrec, noIn) {
            var prec = tokType.binop;
            if (prec != null && (!noIn || tokType !== _in)) {
                if (prec > minPrec) {
                    var node = startNodeAt(leftStart);
                    node.left = left;
                    node.operator = tokVal;
                    var op = tokType;
                    next();
                    var start = storeCurrentPos();
                    node.right = parseExprOp(parseMaybeUnary(), start, prec, noIn);
                    finishNode(node, (op === _logicalOR || op === _logicalAND) ? LogicalExpression : BinaryExpression);
                    return parseExprOp(node, leftStart, minPrec, noIn);
                }
            }
            return left;
        }
        // Parse unary operators, both prefix and postfix.
        function parseMaybeUnary(refShorthandDefaultPos) {
            if (tokType.prefix) {
                var node = startNode(), update = tokType.isUpdate;
                node.operator = tokVal;
                node.prefix = true;
                next();
                node.argument = parseMaybeUnary();
                if (refShorthandDefaultPos && refShorthandDefaultPos.start)
                    unexpected(refShorthandDefaultPos.start);
                if (update)
                    checkLVal(node.argument);
                else if (strict && node.operator === "delete" &&
                    node.argument.type === Identifier)
                    raise(node.start, "Deleting local variable in strict mode");
                return finishNode(node, update ? UpdateExpression : UnaryExpression);
            }
            var start = storeCurrentPos();
            var expr = parseExprSubscripts(refShorthandDefaultPos);
            if (refShorthandDefaultPos && refShorthandDefaultPos.start)
                return expr;
            while (tokType.postfix && !canInsertSemicolon()) {
                var node = startNodeAt(start);
                node.operator = tokVal;
                node.prefix = false;
                node.argument = expr;
                checkLVal(expr);
                next();
                expr = finishNode(node, UpdateExpression);
            }
            return expr;
        }
        // Parse call, dot, and `[]`-subscript expressions.
        function parseExprSubscripts(refShorthandDefaultPos) {
            var start = storeCurrentPos();
            var expr = parseExprAtom(refShorthandDefaultPos);
            if (refShorthandDefaultPos && refShorthandDefaultPos.start)
                return expr;
            return parseSubscripts(expr, start);
        }
        function parseSubscripts(base, start, noCalls) {
            if (eat(_dot)) {
                var node = startNodeAt(start);
                node.object = base;
                node.property = parseIdent(true);
                node.computed = false;
                return parseSubscripts(finishNode(node, MemberExpression), start, noCalls);
            }
            else if (eat(_bracketL)) {
                var node = startNodeAt(start);
                node.object = base;
                node.property = parseExpression();
                node.computed = true;
                expect(_bracketR);
                return parseSubscripts(finishNode(node, MemberExpression), start, noCalls);
            }
            else if (!noCalls && eat(_parenL)) {
                var node = startNodeAt(start);
                node.callee = base;
                node.arguments = parseExprList(_parenR, false);
                return parseSubscripts(finishNode(node, CallExpression), start, noCalls);
            }
            else if (tokType === _backQuote) {
                var node = startNodeAt(start);
                node.tag = base;
                node.quasi = parseTemplate();
                return parseSubscripts(finishNode(node, TaggedTemplateExpression), start, noCalls);
            }
            return base;
        }
        // Parse an atomic expression — either a single token that is an
        // expression, an expression started by a keyword like `function` or
        // `new`, or an expression wrapped in punctuation like `()`, `[]`,
        // or `{}`.
        function parseExprAtom(refShorthandDefaultPos) {
            switch (tokType) {
                case _this:
                    var node = startNode();
                    next();
                    return finishNode(node, ThisExpression);
                case _yield:
                    if (inGenerator)
                        return parseYield();
                case _name:
                    var start = storeCurrentPos();
                    var id = parseIdent(tokType !== _name);
                    if (!canInsertSemicolon() && eat(_arrow)) {
                        return parseArrowExpression(startNodeAt(start), [id]);
                    }
                    return id;
                case _regexp:
                    var node = startNode();
                    node.regex = {
                        pattern: tokVal.pattern,
                        flags: tokVal.flags
                    };
                    node.value = tokVal.value;
                    node.raw = input.slice(tokStart, tokEnd);
                    next();
                    return finishNode(node, Literal);
                case _num:
                case _string:
                    var node = startNode();
                    node.value = tokVal;
                    node.raw = input.slice(tokStart, tokEnd);
                    next();
                    return finishNode(node, Literal);
                case _null:
                case _true:
                case _false:
                    var node = startNode();
                    node.value = tokType.atomValue;
                    node.raw = tokType.keyword;
                    next();
                    return finishNode(node, Literal);
                case _parenL:
                    return parseParenAndDistinguishExpression();
                case _bracketL:
                    var node = startNode();
                    next();
                    node.elements = parseExprList(_bracketR, true, true, refShorthandDefaultPos);
                    return finishNode(node, ArrayExpression);
                case _braceL:
                    return parseObj(false, refShorthandDefaultPos);
                case _function:
                    var node = startNode();
                    next();
                    return parseFunction(node, false);
                case _class:
                    return parseClass(startNode(), false);
                case _new:
                    return parseNew();
                case _backQuote:
                    return parseTemplate();
                case _import:
                    return parseImportExpression();
                default:
                    unexpected();
            }
        }
        function parseImportExpression() {
            var node = startNode();
            next();
            node.source = parseExprAtom();
            return finishNode(node, ImportExpression);
        }
        function parseParenAndDistinguishExpression() {
            var start = storeCurrentPos(), val;
            if (options.ecmaVersion >= 6) {
                next();
                var innerStart = storeCurrentPos(), exprList = [], first = true;
                var refShorthandDefaultPos = {
                    start: 0
                }, spreadStart, innerParenStart;
                while (tokType !== _parenR) {
                    first ? first = false : expect(_comma);
                    if (tokType === _ellipsis) {
                        spreadStart = tokStart;
                        exprList.push(parseRest());
                        break;
                    }
                    else {
                        if (tokType === _parenL && !innerParenStart) {
                            innerParenStart = tokStart;
                        }
                        exprList.push(parseMaybeAssign(false, refShorthandDefaultPos));
                    }
                }
                var innerEnd = storeCurrentPos();
                expect(_parenR);
                if (!canInsertSemicolon() && eat(_arrow)) {
                    if (innerParenStart)
                        unexpected(innerParenStart);
                    return parseArrowExpression(startNodeAt(start), exprList);
                }
                if (!exprList.length)
                    unexpected(lastStart);
                if (spreadStart)
                    unexpected(spreadStart);
                if (refShorthandDefaultPos.start)
                    unexpected(refShorthandDefaultPos.start);
                if (exprList.length > 1) {
                    val = startNodeAt(innerStart);
                    val.expressions = exprList;
                    finishNodeAt(val, SequenceExpression, innerEnd);
                }
                else {
                    val = exprList[0];
                }
            }
            else {
                val = parseParenExpression();
            }
            if (options.preserveParens) {
                var par = startNodeAt(start);
                par.expression = val;
                return finishNode(par, ParenthesizedExpression);
            }
            else {
                return val;
            }
        }
        // New's precedence is slightly tricky. It must allow its argument
        // to be a `[]` or dot subscript expression, but not a call — at
        // least, not without wrapping it in parentheses. Thus, it uses the
        function parseNew() {
            var node = startNode();
            next();
            var start = storeCurrentPos();
            node.callee = parseSubscripts(parseExprAtom(), start, true);
            if (eat(_parenL))
                node.arguments = parseExprList(_parenR, false);
            else
                node.arguments = empty;
            return finishNode(node, NewExpression);
        }
        // Parse template expression.
        function parseTemplateElement() {
            var elem = startNode();
            elem.value = {
                raw: input.slice(tokStart, tokEnd),
                cooked: tokVal
            };
            next();
            elem.tail = tokType === _backQuote;
            return finishNode(elem, TemplateElement);
        }
        function parseTemplate() {
            var node = startNode();
            next();
            node.expressions = [];
            var curElt = parseTemplateElement();
            node.quasis = [curElt];
            while (!curElt.tail) {
                expect(_dollarBraceL);
                node.expressions.push(parseExpression());
                expect(_braceR);
                node.quasis.push(curElt = parseTemplateElement());
            }
            next();
            return finishNode(node, TemplateLiteral);
        }
        // Parse an object literal or binding pattern.
        function parseObj(isPattern, refShorthandDefaultPos) {
            var node = startNode(), first = true, propHash = {};
            node.properties = [];
            next();
            while (!eat(_braceR)) {
                if (!first) {
                    expect(_comma);
                    if (options.allowTrailingCommas && eat(_braceR))
                        break;
                }
                else
                    first = false;
                var prop = startNode(), isGenerator, start;
                if (options.ecmaVersion >= 6) {
                    prop.method = false;
                    prop.shorthand = false;
                    if (isPattern || refShorthandDefaultPos) {
                        start = storeCurrentPos();
                    }
                    if (!isPattern) {
                        isGenerator = eat(_star);
                    }
                }
                parsePropertyName(prop);
                if (eat(_colon)) {
                    prop.value = isPattern ? parseMaybeDefault() : parseMaybeAssign(false, refShorthandDefaultPos);
                    prop.kind = "init";
                }
                else if (options.ecmaVersion >= 6 && tokType === _parenL) {
                    if (isPattern)
                        unexpected();
                    prop.kind = "init";
                    prop.method = true;
                    prop.value = parseMethod(isGenerator);
                }
                else if (options.ecmaVersion >= 5 && !prop.computed && prop.key.type === Identifier &&
                    (prop.key.name === "get" || prop.key.name === "set") &&
                    (tokType != _comma && tokType != _braceR)) {
                    if (isGenerator || isPattern)
                        unexpected();
                    prop.kind = prop.key.name;
                    parsePropertyName(prop);
                    prop.value = parseMethod(false);
                }
                else if (options.ecmaVersion >= 6 && !prop.computed && prop.key.type === Identifier) {
                    prop.kind = "init";
                    if (isPattern) {
                        prop.value = parseMaybeDefault(start, prop.key);
                    }
                    else if (tokType === _eq && refShorthandDefaultPos) {
                        if (!refShorthandDefaultPos.start)
                            refShorthandDefaultPos.start = tokStart;
                        prop.value = parseMaybeDefault(start, prop.key);
                    }
                    else {
                        prop.value = prop.key;
                    }
                    prop.shorthand = true;
                }
                else
                    unexpected();
                checkPropClash(prop, propHash);
                node.properties.push(finishNode(prop, "Property"));
            }
            return finishNode(node, isPattern ? ObjectPattern : ObjectExpression);
        }
        function parsePropertyName(prop) {
            if (options.ecmaVersion >= 6) {
                if (eat(_bracketL)) {
                    prop.computed = true;
                    prop.key = parseExpression();
                    expect(_bracketR);
                    return;
                }
                else {
                    prop.computed = false;
                }
            }
            prop.key = (tokType === _num || tokType === _string) ? parseExprAtom() : parseIdent(true);
        }
        // Initialize empty function node.
        function initFunction(node) {
            node.id = null;
            if (options.ecmaVersion >= 6) {
                node.generator = false;
                node.expression = false;
            }
        }
        // Parse a function declaration or literal (depending on the
        // `isStatement` parameter).
        function parseFunction(node, isStatement, allowExpressionBody) {
            initFunction(node);
            if (options.ecmaVersion >= 6) {
                node.generator = eat(_star);
            }
            if (isStatement || tokType === _name) {
                node.id = parseIdent();
            }
            expect(_parenL);
            node.params = parseBindingList(_parenR, false);
            parseFunctionBody(node, allowExpressionBody);
            return finishNode(node, isStatement ? FunctionDeclaration : FunctionExpression);
        }
        // Parse object or class method.
        function parseMethod(isGenerator) {
            var node = startNode();
            initFunction(node);
            expect(_parenL);
            node.params = parseBindingList(_parenR, false);
            var allowExpressionBody;
            if (options.ecmaVersion >= 6) {
                node.generator = isGenerator;
                allowExpressionBody = true;
            }
            else {
                allowExpressionBody = false;
            }
            parseFunctionBody(node, allowExpressionBody);
            return finishNode(node, FunctionExpression);
        }
        // Parse arrow function expression with given parameters.
        function parseArrowExpression(node, params) {
            initFunction(node);
            node.params = toAssignableList(params, true);
            parseFunctionBody(node, true);
            return finishNode(node, ArrowFunctionExpression);
        }
        // Parse function body and check parameters.
        function parseFunctionBody(node, allowExpression) {
            var isExpression = allowExpression && tokType !== _braceL;
            if (isExpression) {
                node.body = parseMaybeAssign();
                node.expression = true;
            }
            else {
                // Start a new scope with regard to labels and the `inFunction`
                // flag (restore them to their old value afterwards).
                var oldInFunc = inFunction, oldInGen = inGenerator, oldLabels = labels;
                inFunction = true;
                inGenerator = node.generator;
                labels = [];
                node.body = parseBlock(true);
                node.expression = false;
                inFunction = oldInFunc;
                inGenerator = oldInGen;
                labels = oldLabels;
            }
            // If this is a strict mode function, verify that argument names
            // are not repeated, and it does not try to bind the words `eval`
            // or `arguments`.
            if (strict || !isExpression && node.body.body.length && isUseStrict(node.body.body[0])) {
                var nameHash = {};
                if (node.id)
                    checkFunctionParam(node.id, {});
                for (var i = 0; i < node.params.length; i++)
                    checkFunctionParam(node.params[i], nameHash);
            }
        }
        // Parse a class declaration or literal (depending on the
        // `isStatement` parameter).
        function parseClass(node, isStatement) {
            next();
            node.id = tokType === _name ? parseIdent() : isStatement ? unexpected() : null;
            node.superClass = eat(_extends) ? parseExprSubscripts() : null;
            var classBody = startNode();
            classBody.body = [];
            expect(_braceL);
            while (!eat(_braceR)) {
                if (eat(_semi))
                    continue;
                var method = startNode();
                var isGenerator = eat(_star);
                parsePropertyName(method);
                if (tokType !== _parenL && !method.computed && method.key.type === Identifier &&
                    method.key.name === "static") {
                    if (isGenerator)
                        unexpected();
                    method['static'] = true;
                    isGenerator = eat(_star);
                    parsePropertyName(method);
                }
                else {
                    method['static'] = false;
                }
                if (tokType !== _parenL && !method.computed && method.key.type === Identifier &&
                    (method.key.name === "get" || method.key.name === "set")) {
                    if (isGenerator)
                        unexpected();
                    method.kind = method.key.name;
                    parsePropertyName(method);
                }
                else {
                    method.kind = "";
                }
                method.value = parseMethod(isGenerator);
                classBody.body.push(finishNode(method, MethodDefinition));
            }
            node.body = finishNode(classBody, ClassBody);
            return finishNode(node, isStatement ? ClassDeclaration : ClassExpression);
        }
        // Parses a comma-separated list of expressions, and returns them as
        // an array. `close` is the token type that ends the list, and
        // `allowEmpty` can be turned on to allow subsequent commas with
        // nothing in between them to be parsed as `null` (which is needed
        // for array literals).
        function parseExprList(close, allowTrailingComma, allowEmpty, refShorthandDefaultPos) {
            var elts = [], first = true;
            while (!eat(close)) {
                if (!first) {
                    expect(_comma);
                    if (allowTrailingComma && options.allowTrailingCommas && eat(close))
                        break;
                }
                else
                    first = false;
                if (allowEmpty && tokType === _comma) {
                    elts.push(null);
                }
                else {
                    if (tokType === _ellipsis)
                        elts.push(parseSpread(refShorthandDefaultPos));
                    else
                        elts.push(parseMaybeAssign(false, refShorthandDefaultPos));
                }
            }
            return elts;
        }
        // Parse the next token as an identifier. If `liberal` is true (used
        // when parsing properties), it will also convert keywords into
        // identifiers.
        function parseIdent(liberal) {
            var node = startNode();
            if (liberal && options.forbidReserved == "everywhere")
                liberal = false;
            if (tokType === _name) {
                if (!liberal &&
                    (options.forbidReserved &&
                        (options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(tokVal) ||
                        strict && isStrictReservedWord(tokVal)) &&
                    input.slice(tokStart, tokEnd).indexOf("\\") == -1)
                    raise(tokStart, "The keyword '" + tokVal + "' is reserved");
                node.name = tokVal;
            }
            else if (liberal && tokType.keyword) {
                node.name = tokType.keyword;
            }
            else {
                unexpected();
            }
            next();
            return finishNode(node, Identifier);
        }
        // Parses module export declaration.
        function parseExport(node) {
            next();
            // export var|const|let|function|class ...;
            if (tokType === _var || tokType === _const || tokType === _let || tokType === _function || tokType === _class) {
                node.declaration = parseStatement(true);
                node['default'] = false;
                node.specifiers = null;
                node.source = null;
            }
            else 
            // export default ...;
            if (eat(_default)) {
                var expr = parseMaybeAssign();
                if (expr.id) {
                    switch (expr.type) {
                        case FunctionExpression:
                            expr.type = FunctionDeclaration;
                            break;
                        case ClassExpression:
                            expr.type = ClassDeclaration;
                            break;
                    }
                }
                node.declaration = expr;
                node['default'] = true;
                node.specifiers = null;
                node.source = null;
                semicolon();
            }
            else {
                // export * from '...';
                // export { x, y as z } [from '...'];
                var isBatch = tokType === _star;
                node.declaration = null;
                node['default'] = false;
                node.specifiers = parseExportSpecifiers();
                if (eatContextual("from")) {
                    node.source = tokType === _string ? parseExprAtom() : unexpected();
                }
                else {
                    if (isBatch)
                        unexpected();
                    node.source = null;
                }
                semicolon();
            }
            return finishNode(node, ExportDeclaration);
        }
        // Parses a comma-separated list of module acorn.
        function parseExportSpecifiers() {
            var nodes = [], first = true;
            if (tokType === _star) {
                // export * from '...'
                var node = startNode();
                next();
                nodes.push(finishNode(node, ExportBatchSpecifier));
            }
            else {
                // export { x, y as z } [from '...']
                expect(_braceL);
                while (!eat(_braceR)) {
                    if (!first) {
                        expect(_comma);
                        if (options.allowTrailingCommas && eat(_braceR))
                            break;
                    }
                    else
                        first = false;
                    var node = startNode();
                    node.id = parseIdent(tokType === _default);
                    node.name = eatContextual("as") ? parseIdent(true) : null;
                    nodes.push(finishNode(node, ExportSpecifier));
                }
            }
            return nodes;
        }
        // Parses import declaration.
        function parseImport(node) {
            next();
            // import '...';
            if (tokType === _string) {
                node.specifiers = [];
                node.source = parseExprAtom();
                node.kind = "";
            }
            else {
                node.specifiers = parseImportSpecifiers();
                expectContextual("from");
                node.source = tokType === _string ? parseExprAtom() : unexpected();
            }
            semicolon();
            return finishNode(node, ImportDeclaration);
        }
        // Parses a comma-separated list of module imports.
        function parseImportSpecifiers() {
            var nodes = [], first = true;
            if (tokType === _name) {
                // import defaultObj, { x, y as z } from '...'
                var node = startNode();
                node.id = parseIdent();
                checkLVal(node.id, true);
                node.name = null;
                node['default'] = true;
                nodes.push(finishNode(node, ImportSpecifier));
                if (!eat(_comma))
                    return nodes;
            }
            if (tokType === _star) {
                var node = startNode();
                next();
                expectContextual("as");
                node.name = parseIdent();
                checkLVal(node.name, true);
                nodes.push(finishNode(node, ImportBatchSpecifier));
                return nodes;
            }
            expect(_braceL);
            while (!eat(_braceR)) {
                if (!first) {
                    expect(_comma);
                    if (options.allowTrailingCommas && eat(_braceR))
                        break;
                }
                else
                    first = false;
                var node = startNode();
                node.id = parseIdent(true);
                node.name = eatContextual("as") ? parseIdent() : null;
                checkLVal(node.name || node.id, true);
                node['default'] = false;
                nodes.push(finishNode(node, ImportSpecifier));
            }
            return nodes;
        }
        // Parses yield expression inside generator.
        function parseYield() {
            var node = startNode();
            next();
            if (eat(_semi) || canInsertSemicolon()) {
                node.delegate = false;
                node.argument = null;
            }
            else {
                node.delegate = eat(_star);
                node.argument = parseMaybeAssign();
            }
            return finishNode(node, YieldExpression);
        }
        return acorn;
    }
    getNewAcorn();

    // 导出默认对象
    var default_api = {
        console: console,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        encodeURI: encodeURI,
        encodeURIComponent: encodeURIComponent,
        decodeURI: decodeURI,
        decodeURIComponent: decodeURIComponent,
        Infinity: Infinity,
        NaN: NaN,
        isFinite: isFinite,
        isNaN: isNaN,
        parseFloat: parseFloat,
        parseInt: parseInt,
        Object: Object,
        Boolean: Boolean,
        Error: Error,
        EvalError: EvalError,
        RangeError: RangeError,
        ReferenceError: ReferenceError,
        SyntaxError: SyntaxError,
        TypeError: TypeError,
        URIError: URIError,
        Number: Number,
        Math: Math,
        Date: Date,
        String: String,
        RegExp: RegExp,
        Array: Array,
        JSON: JSON,
        Promise: Promise,
    };
    if (typeof Symbol !== 'undefined') {
        default_api['Symbol'] = Symbol;
    }
    var Runner = /** @class */ (function () {
        function Runner() {
            this.source = '';
            this.traceId = 0;
            this.traceStack = [];
            this.currentNode = null;
            this.ast = null;
            this.mainScope = new Scope("program" /* ScopeType.Program */);
        }
        /** 错误收集中心 */
        Runner.prototype.onError = function (err) {
            // console.error(err);
        };
        Runner.prototype.run = function (code, injectObject, onError) {
            if (injectObject === void 0) { injectObject = {}; }
            this.source = code;
            this.onError = onError || this.onError;
            this.initScope(injectObject);
            this.parserAst(code);
            try {
                evaluate(this.ast, this.mainScope);
            }
            catch (err) {
                throw err;
            }
            return this.mainScope.$find('exports').value;
        };
        Runner.prototype.initScope = function (injectObject) {
            var _this = this;
            var exports = {};
            this.mainScope = new Scope("program" /* ScopeType.Program */);
            this.mainScope.$var('exports', exports);
            this.mainScope.$const(THIS, this);
            Object.keys(default_api).forEach(function (name) {
                _this.mainScope.$var(name, default_api[name]);
            });
            Object.keys(injectObject).forEach(function (name) {
                _this.mainScope.$var(name, injectObject[name]);
            });
            this.mainScope.runner = this;
        };
        Runner.prototype.parserAst = function (code) {
            this.ast = getNewAcorn().parse(code, { locations: true, ecmaVersion: 6 });
            return this.ast;
        };
        return Runner;
    }());

    var run = function (code, injectObject, onError) {
        var runner = new Runner();
        return runner.run(code, injectObject, onError);
    };

    exports.Runner = Runner;
    exports.default = run;
    exports.run = run;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

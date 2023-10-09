import { evaluate } from "./evalute";
import { getNewAcorn } from '../acorn/index'
import { Scope, ScopeType } from "./scope";
import { THIS } from "./signal";

type InJectObject = Record<string, any>;

// 导出默认对象
const default_api: InJectObject = {
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

if (typeof Symbol !== 'undefined') {
    default_api['Symbol'] = Symbol;
}

export class Runner {
    public source: string = '';
    public traceId = 0;
    public traceStack = [];
    public currentNode: any = null;

    private ast = null;
    private mainScope: Scope = new Scope(ScopeType.Program);

    /** 错误收集中心 */
    public onError (err: Error) {
        // console.error(err);
    }

    public run (code: string, injectObject: InJectObject = {}, onError?: (err: Error) => void) {
        this.source = code;
        this.onError = onError || this.onError;
        this.initScope(injectObject);
        this.parserAst(code);
        try {
            evaluate(this.ast, this.mainScope);
        } catch (err) {
            throw err;
        }
        return this.mainScope.$find('exports').value;
    }

    public initScope (injectObject: InJectObject) {
        const exports = {};
        this.mainScope = new Scope(ScopeType.Program);
        this.mainScope.$var('exports', exports);
        this.mainScope.$const(THIS, this);
        Object.keys(default_api).forEach((name) => {
            this.mainScope.$var(name, default_api[name]);
        })
        Object.keys(injectObject).forEach((name) => {
            this.mainScope.$var(name, injectObject[name]);
        })
        this.mainScope.runner = this;
    }

    public parserAst (code: string) {
        this.ast = getNewAcorn().parse(code, { locations: true, ecmaVersion: 6 });
        return this.ast;
    }
}

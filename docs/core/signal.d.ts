import { Scope } from "./scope";
import estree from 'estree';
export declare const isGeneratorFunction: (scope: Scope) => boolean;
export declare const isYieldResult: (scope: Scope, value: any) => boolean;
export declare const isReturnResult: (value: any) => boolean;
export declare const isContinueResult: (value: any) => boolean;
export declare const isBreakResult: (value: any) => boolean;
/**
 * 是否是函数提升语句
 */
export declare const isPromoteStatement: (value: estree.Node) => boolean;
/**
 * 是否是变量提升语句
 */
export declare const isVarPromoteStatement: (value: estree.Node) => boolean;
export declare const BREAK_SIGNAL: {};
export declare const CONTINUE_SIGNAL: {};
export declare const RETURN_SIGNAL: {
    result: any;
};
export declare const YIELD_SIGNAL: {
    result: any;
};

import { Scope } from "./scope";
import { FunctionDeclaration, VariableDeclaration } from "../expressionType/index";
import estree from 'estree';


// 当前执行作用域是否在迭代函数下
export const isGeneratorFunction = (scope: Scope) => scope.generator;

export const isYieldResult = (scope: Scope, value: any) => isGeneratorFunction(scope) && value === YIELD_SIGNAL

export const isReturnResult = (value: any) => value === RETURN_SIGNAL;
export const isContinueResult = (value: any) => value === CONTINUE_SIGNAL;
export const isBreakResult = (value: any) => value === BREAK_SIGNAL;

/**
 * 是否是函数提升语句
 */
export const isPromoteStatement = (value: estree.Node) => {
    return value.type === FunctionDeclaration;
};

/**
 * 是否是变量提升语句
 */
export const isVarPromoteStatement = (value: estree.Node) => {
    return value?.type === VariableDeclaration && value.kind === 'var';
};


export const BREAK_SIGNAL = {};
export const CONTINUE_SIGNAL = {};
export const RETURN_SIGNAL = { result: undefined };
export const YIELD_SIGNAL = { result: undefined };

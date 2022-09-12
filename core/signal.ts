import { Scope } from "./scope";


// 当前执行作用域是否在迭代函数下
export const isGeneratorFunction = (scope: Scope) => scope.generator;

export const isYieldResult = (scope: Scope, value: any) => isGeneratorFunction(scope) && value === YIELD_SIGNAL

export const isReturnResult = (value: any) => value === RETURN_SIGNAL;
export const isContinueResult = (value: any) => value === CONTINUE_SIGNAL;
export const isBreakResult = (value: any) => value === BREAK_SIGNAL;


export const BREAK_SIGNAL = {};
export const CONTINUE_SIGNAL = {};
export const RETURN_SIGNAL = { result: undefined };
export const YIELD_SIGNAL = { result: undefined };

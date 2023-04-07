import { Scope, getScopeRunner } from "./scope";

export class EvaluateError extends Error {
    public isEvaluateError = true;
    public nodeLoc?: { start: number; end: number, loc: { start: { line: number; column: number }; end: { line: number; column: number } } };
}
export class EvaluateSyntaxError extends EvaluateError { }
export class EvaluateReferenceError extends EvaluateError { }

type ErrorMessageList = [
    number,
    string,
    new (msg: string) => EvaluateError,
]


export const errorMessageList: Record<string, ErrorMessageList> = {
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
}

export const createError = (msg: ErrorMessageList, value: any, node?: any, scope?: Scope) => {
    const source = getScopeRunner(scope)?.source;
    let message = msg[1].replace("%0", String(value));
    if (node && source) {
        const errorNodeLoc = node.loc;
        let errorCode = source.slice(node.start, node.end);
        let errorMsg = `错误代码: ${errorCode}`
        if (errorNodeLoc) {
            errorMsg += ` [${errorNodeLoc.start.line}:${errorNodeLoc.start.column}-${errorNodeLoc.end.line}:${errorNodeLoc.end.column}]`;
        }
        message = `${message} \n ${errorMsg}`;
    }
    const err = new msg[2](message);
    return err.nodeLoc = node, err;
}
declare type InJectObject = Record<string, any>;
export declare class Runner {
    source: string;
    traceId: number;
    traceStack: any[];
    currentNode: any;
    private ast;
    private mainScope;
    /** 错误收集中心 */
    onError(err: Error): void;
    run(code: string, injectObject?: InJectObject, onError?: (err: Error) => void): any;
    initScope(injectObject: InJectObject): void;
    parserAst(code: string): any;
}
export {};

import type { Runner } from "./run";
export declare type Kind = 'const' | 'var' | 'let';
export declare class ScopeVar {
    value: any;
    kind: Kind;
    reDeclare: boolean;
    constructor(kind: Kind, value: any, reDeclare?: boolean);
    $set(value: any): boolean;
    $get(): any;
}
interface indexGeneratorStackDecorateData {
    index: number;
    [k: string]: any;
}
export declare type indexGeneratorStackDecorateFunction = (data: indexGeneratorStackDecorateData, saveData: (k: any, value: any) => void) => any;
export declare const indexGeneratorStackDecorate: (fn: indexGeneratorStackDecorateFunction, scope: Scope) => any;
/** 用于保存迭代函数的栈 */
export declare class GeneratorStack {
    private runnerStack;
    private yieldBackValues;
    private running;
    private currentIndex;
    private currentStackIndex;
    pushValue(value: any): void;
    getValue(): {
        value: any;
    };
    getStack(): indexGeneratorStackDecorateData;
    popStack(): void;
    saveStackData(key: string, value: any): void;
}
export declare const enum ScopeType {
    Program = "program",
    Function = "function",
    Block = "block",
    Loop = "loop",
    Switch = "switch"
}
export declare class Scope {
    type: ScopeType;
    parent: Scope | null;
    content: Record<string, any>;
    prefix: string;
    invasive: boolean;
    generator: boolean;
    generatorStack: GeneratorStack;
    /** 在顶层绑定运行的 runner */
    runner?: Runner;
    constructor(type: ScopeType, parent?: Scope, generator?: boolean);
    $find(raw_name: string): any;
    $let(raw_name: string, value: any): boolean;
    $const(raw_name: string, value: unknown): boolean;
    $var(raw_name: string, value: any, canReDeclare?: boolean): boolean;
    $declar(kind: Kind, raw_name: any, value: any, canReDeclare?: boolean): boolean;
    /**
     * 获取最近的某种类型作用域
     */
    getClosetSomeScope(type: ScopeType): Scope;
}
/**
 * 获取当前顶层作用域的 runner
 */
export declare const getScopeRunner: (scope: Scope) => Runner;
export {};

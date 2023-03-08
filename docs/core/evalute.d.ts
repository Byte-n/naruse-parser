import { EvaluateError } from './error';
import { Scope } from './scope';
declare let thisRunner: {
    source: string;
    currentNode: any;
    traceId: number;
    traceStack: any[];
    onError?: (err: EvaluateError) => void;
};
export declare const evaluate: (node: any, scope: Scope, runner?: typeof thisRunner) => any;
export {};

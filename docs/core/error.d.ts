export declare class EvaluateError extends Error {
    isEvaluateError: boolean;
    nodeLoc?: {
        start: number;
        end: number;
        loc: {
            start: {
                line: number;
                column: number;
            };
            end: {
                line: number;
                column: number;
            };
        };
    };
}
export declare class EvaluateSyntaxError extends EvaluateError {
}
export declare class EvaluateReferenceError extends EvaluateError {
}
declare type ErrorMessageList = [
    number,
    string,
    new (msg: string) => EvaluateError
];
export declare const errorMessageList: Record<string, ErrorMessageList>;
export declare const createError: (msg: ErrorMessageList, value: any, node?: any, source?: string) => EvaluateError;
export {};

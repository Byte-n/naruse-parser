declare function getNewAcorn(): {
    version?: string;
    parse?: (inpt: any, opts: any) => any;
    parseExpressionAt?: (inpt: any, pos: any, opts: any) => any;
    tokenize?: (inpt: any, opts: any) => any;
    tokTypes?: any;
    defaultOptions?: any;
};
declare const acorn: {
    version?: string;
    parse?: (inpt: any, opts: any) => any;
    parseExpressionAt?: (inpt: any, pos: any, opts: any) => any;
    tokenize?: (inpt: any, opts: any) => any;
    tokTypes?: any;
    defaultOptions?: any;
};
export { getNewAcorn, acorn };
export default acorn;

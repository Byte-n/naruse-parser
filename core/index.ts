import { Runner } from './run';

export const run = (code: string, injectObject: Record<string, any>, onError?: (e: Error) => void ) => {
    const runner = new Runner();
    return runner.run(code, injectObject, onError);
}

export { Runner };
export default run;
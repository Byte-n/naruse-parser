import { Runner } from './run';

export const run = (code: string, injectObject: any) => {
    const runner = new Runner();
    return runner.run(code, injectObject);
}
export default run;
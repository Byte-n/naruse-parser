import {
    run
} from '../../dist/dev.esm.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect
} from 'chai';

describe('错误收集测试', () => {
    it('onError 同步错误收集', () => {
        const onError = (error) => {
            expect(error.message.includes('未定义的变量: a')).to.equal(true);
        };
        expect(() => {
            run(`a = 1;`,{}, onError)
        }).to.throw();
    });

    // it('onError 异步错误收集', async (done) => {
    //     const onError = (error) => {
    //         expect(error.message.includes('未定义的变量: a')).to.equal(true);
    //     };
        
    //     // expect(async () => {
    //         run(`setTimeout(() => {a = 1;}, 0);`,{}, onError);
    //         await new Promise((resolve) => {
    //             setTimeout(() => {
    //                 resolve();
    //             }, 100);
    //         });
    //     // }).to.throw();
    //     done(1000);
    // });
});
import {
    run,
    Runner
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
            run(`a = 1;`, {}, onError)
        }).to.throw();
    });

    it('onError 错误收集-多次(超时为失败)', (done) => {
        let i = 0;
        const onError = (error) => {
            if (i === 0) {
                i++;
                return;
            }
            done();
        };
        let runner = new Runner();
        expect(() => {
            try {
                runner.run(`a = 1;`, {}, onError);
            } catch (error) {
                runner.run(`b = 1;`, {}, onError);
            }
        }).to.throw();
    });

    it('报错内容正常显示', () => {
        let a = 1;
        const onError = (error) => {
            a = 2;
            expect(error.message.includes('未定义的变量: a')).to.equal(true);
        };
        expect(() => {
            run(`a = 1;`, {}, onError)
        }).to.throw();
        expect(a).to.equal(2);
    })

    it('报错行数与列数正常显示', () => {
        let a = 1;
        const onError = (error) => {
            a = 2;
            expect(error.message.includes('未定义的变量: a')).to.equal(true);
            expect(error.message.includes('a = 1')).to.equal(true);
            expect(error.message.includes('[1:0-1:5]')).to.equal(true);
        };
        expect(() => {
            run(`a = 1;`, {}, onError)
        }).to.throw();
        expect(a).to.equal(2);
    })

    it('多个 runner 同时交叉运行时，错误应该展示正常', async () => {
        const e = await new Promise((done) => {
            const runner = new Runner();
            const runner2 = new Runner();
            runner.run(`setTimeout(() => {
                    try {
                        a = 2;
                    } catch (e) {
                        done(e);
                    }
                 }, 10)`, { done })
            runner2.run(`const a = 1;`);
        });
        expect(e.message.includes('未定义的变量: a')).to.equal(true);
        expect(e.message.includes('a = 2')).to.equal(true);
        expect(e.message.includes('[3:24-3:29]')).to.equal(true);
    })

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
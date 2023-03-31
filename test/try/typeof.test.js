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

describe('try 相关测试', () => {
    it('基本 try 测试', () => {
        const exports = run(`
            const ww = () => {
                try {
                    return 1;
                } catch (e) {
                    return 2;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(1);
    });

    it('try catch 测试', () => {
        const exports = run(`
            const ww = () => {
                try {
                    throw new Error('123');
                } catch (e) {
                    return 2;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(2);
    })

    it('try catch finally 测试', () => {
        const exports = run(`
            const ww = () => {
                try {
                    throw new Error('123');
                } catch (e) {
                    return 2;
                } finally {
                    return 3;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(3);
    });

    it('try catch finally 测试2', () => {
        const exports = run(`
            const ww = () => {
                try {
                    return 1;
                } catch (e) {
                    return 2;
                } finally {
                    return 3;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(3);
    });

    it('try catch finally 测试3', () => {
        const exports = run(`
            const ww = () => {
                try {
                    return 1;
                } catch (e) {
                    return 2;
                } finally {
                    var a = 1;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(1);
    });

    it('try catch finally 测试4', () => {
        const exports = run(`
            const ww = () => {
                try {
                    throw new Error('123');
                } catch (e) {
                    return 2;
                } finally {
                    var a = 1;
                    return 3;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(3);
    });

    it('try catch finally 测试5', () => {
        const exports = run(`
            const ww = () => {
                try {
                    throw new Error('123');
                } catch (e) {
                    return 2;
                } finally {
                    var a = 1;
                }
            }
            exports.ww = ww();
        `);
        const {
            ww
        } = exports;
        expect(ww).equal(2);
    });
});
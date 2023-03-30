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

describe('声明变量', () => {
    it('let', () => {
        const exports = run(`
        let cc = 123;
        cc = 321;
        exports.cc = cc;
        `);
        const {
            cc,
            c2
        } = exports;
        expect(cc).to.equal(321);
    });
    it('const', () => {
        const exports = run(`
        const cc = 123;
        exports.cc = cc;
        `);
        const {
            cc,
        } = exports;
        expect(cc).to.equal(123);
    });

    it('var', () => {
        const exports = run(`
        var cc = 123;
        cc = 321;
        exports.cc = cc;
        `);
        const {
            cc,
        } = exports;
        expect(cc).to.equal(321);
    });

    it('change const value should throw error', () => {
        expect(() => {
            run(`
            const cc = 123;
            cc = 321;
            `);
        }).to.throw();
    });

    it('allow var reset value', () => {
        const exports = run(`
        var cc = 123;
        var cc = 321;
        exports.cc = cc;
        `);
        const {
            cc,
        } = exports;
        expect(cc).to.equal(321);
    });

    it('use var in forStatment will promote', () => {
        const exports = run(`
        function __spreadArray(to, from, pack) {
            if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
            return to.concat(ar || Array.prototype.slice.call(from));
        }
        exports.__spreadArray = __spreadArray;
        `);
        const {
            __spreadArray,
        } = exports;
        expect(__spreadArray).to.be.a('function');
        expect(__spreadArray([1, 2], [3, 4])).to.deep.equal([1, 2, 3, 4]);
    })

    it('test var variable will be lifted', () => {
        const exports = run(`
        exports.a = a;
        var a = 1;
        exports.b = a;
        `);
        const {
            a,
            b,
        } = exports;
        expect(a).to.equal(undefined);
        expect(b).to.equal(1);
    })

    it('for of loop var will be lifted', () => {
        const exports = run(`
        var a = 1;
        for (var i of [1, 2, 3]) {
            a = i;
        }
        exports.a = a;
        `);
        const {
            a,
        } = exports;
        expect(a).to.equal(3);
    });

    it('for in loop var will be lifted', () => {
        const exports = run(`
        var a = 1;
        for (var i in [1, 2, 3]) {
            a = i;
        }
        exports.a = a;
        `);
        const {
            a,
        } = exports;
        expect(a).to.equal('2');
    });

    it('提前函数使用后面声明的变量', () => {
        const exports = run(`
        function a() {
            return b;
        }
        var b = 1;
        exports.a = a();
        `);
        const {
            a,
        } = exports;
        expect(a).to.equal(1);
    });
});
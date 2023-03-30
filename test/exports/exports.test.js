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

describe('exports 循环测试', () => {
    it('变量注入测试', () => {
        const exports = run(`
        exports.a = a;
        exports.b = b;
        `, { a: 1, b:2  });
        const {
            a,b
        } = exports;
        expect(a).to.deep.equal(1);
        expect(b).to.deep.equal(2);
    });
    
    it('变量注入后使用 var 重新定义变量', () => {
        const exports = run(`
            var a = typeof a === 'undefined' ? 2 : a;
            var b = typeof b === 'undefined' ? 3 : b;
            exports.a = a;
            exports.b = b;
        `, { a: 1, b:2  });
        const {
            a,b
        } = exports;
        expect(a).to.eq(1);
        expect(b).to.eq(2);
    })

    it('exports 赋值测试', () => {
        const exports = run(`
        exports = { a: 1 };
        `);
        expect(exports).to.deep.equal({ a: 1 });
    });

});
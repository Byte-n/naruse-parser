import {
    run
} from '../../index.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect
} from 'chai';

describe('函数相关测试', () => {

    it('函数传值测试', () => {
        const exports = run(`
            function qq (a, b, c) {
                return [a, b, c];
            }
            exports.qq = qq;
            `);
        const {
            qq
        } = exports;
        expect(qq(1, 2, 3)).to.deep.equal([1, 2, 3]);
    })

    it('箭头函数this指向问题', () => {
        const exports = run(`
        function qwe () {
            const qq = () => {
                this.cc = 123;
            };
            qq();
        }
        
        exports.qwe = qwe;
        `);
        const {
            qwe
        } = exports;
        const n = new qwe();
        expect(n.cc).to.equal(123);
    });

    it('箭头函数不存在构造函数', () => {
        const exports = run(`
        const ww = () => {}
        
        exports.qwe = ww;
        `);
        const {
            qwe
        } = exports;
        expect(qwe.prototype).to.equal(undefined);
    });

    it('单行箭头函数', () => {
        const exports = run(`
        const ww = () => '123';
        
        exports.qwe = ww();
        `);
        const {
            qwe
        } = exports;
        expect(qwe).to.equal('123');
    });

    it('箭头函数无法被bind改变指向', () => {
        const exports = run(`
        function qwe () {
            const qq = (c) => {
                this.cc = c;
            };
            this.qq = qq;
        }
        exports.qwe = qwe;
        `);
        const {
            qwe
        } = exports;
        const c = new qwe();
        expect(c.cc).to.equal(undefined);
        c.qq(123);
        expect(c.cc).to.equal(123);
        c.qq.bind({ qwe: 123 })(321);
        expect(c.cc).to.equal(321);
    })

    it('函数toString', () => {
        const func1 = run(`
        function qwe () {
            console.log(1);
        }
        const qq = () => { console.log('qq') };
        exports.qwe = qwe;
        exports.qq = qq;
  `);
        expect(func1.qwe.toString()).to.equal(`function qwe () {
            console.log(1);
        }`);

        expect(func1.qq.toString()).to.equal(`() => { console.log('qq') }`);
    });

    it('函数length', () => {
        const func1 = run(`
        function qwe (a,b,c) {
        }
        exports.qwe = qwe;
  `);
        expect(func1.qwe.length).to.equal(3);
    });
});
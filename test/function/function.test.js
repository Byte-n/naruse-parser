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

    it('函数声明提升', () => {
        const func1 = run(`
        let cc = qwe;
        function qwe () {
            return 123;
        }
        exports.qwe = qwe;
    `);
        expect(func1.qwe()).to.equal(123);
    });

    it('function 函数在非 block 域中创建后， block 内部访问不到该函数', () => {
        const func1 = run(`
        var w = a => a;
        let i = 0;
        w(function qwe () {
            exports.qwe = qwe;
         })();
    `);
        expect(func1.qwe).not.to.equal(undefined);
    })

    it('当函数中出现与函数名相同的的形参时会导致形参会取到当前函数', () => {
        const exports = run(`
           function a (a) {
              exports.a = a;
           }
           a();
        `)
        const { a } = exports;
        expect(a).to.equal(undefined);
    })


    it('当函数内使用 const 创建新的与函数名相同的变量时导致重复定义错误', () => {
        const exports = run(`
           function a () {
              const a = 1234;
              exports.a = a;
           }
           a();
        `)
        const { a } = exports;
        expect(a).to.equal(1234);
    });

    it('当函数内使用 const 创建与形参相同的变量时应该报错', () => {
        expect(() => {
            const exports = run(`
           function a (a) {
              const a = 1234;
              exports.a = a;
           }
           a();
        `)
        }).to.throw();
    })

    it('函数内获取当前函数名变量默认为当前函数', () => {
        const exports = run(`
           function a () {
              exports.a = a;
           }
           a();
           exports.b = a;
        `)
        const { a, b } = exports;
        expect(a).to.equal(b);
    })

    it('函数内获取当前函数名变量默认为当前函数', () => {
        const exports = run(`
            const cc =  function qwer () { exports.qwer = qwer }; 
            var qwer =123;
            exports.a = qwer;
            cc();
            exports.b = qwer;
        `)
        const { a, b, qwer } = exports;
        expect(a).to.equal(123);
        expect(b).to.equal(123);
        expect(qwer).to.not.equal(123);
    })
});
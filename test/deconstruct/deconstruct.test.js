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

describe('es6 解构测试', () => {

    it('数组声明解构测试', () => {
        const exports = run(`
        const [ a, b, c ] = [ 1, 2, 3 ];
        const [ d, e, f ] = [ 4, 5, 6 ];
        const [ , , i ] = [ 7, 8, 9 ];

        const [ g, h, [ o ] ] = [ 10, 11, [ 12 ] ];

        let [x = 1, y = x] = [];

        exports.arr = [ a, b, c, d, e, f, i ];
        exports.arr2 = [ g, h, o ];
        exports.arr3 = [x, y];
            `);
        const {
            arr,
            arr2,
            arr3
        } = exports;
        expect(arr.length).to.equal(7);
        expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 9]);

        expect(arr2.length).to.equal(3);
        expect(arr2).to.deep.equal([10, 11, 12]);

        expect(arr3.length).to.equal(2);
        expect(arr3).to.deep.equal([1, 1]);
    })

    it('对象解构测试', () => {
        const exports = run(`
        const { a, b, c } = { a: 1, b: 2, c: 3 };

        const { d, e, f } = { d: 4, e: 5, f: 6 };

        const { g, h, i } = { g: 7, h: 8, i: 9 };

        exports.arr = [ a, b, c, d, e, f, i];

        const { aa: [ccc = 321] = 123 } = { aa: [  ] };
        const { bb: [bbb = 321] = [ 111 ] } = {   };

        exports.arr2 = [ ccc, bbb ];

        const { p: { q: r } } = { p: { q: 456 } };

        exports.arr3 = [ r ];

            `);
        const {
            arr,
            arr2,
            arr3
        } = exports;
        expect(arr.length).to.equal(7);
        expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 9]);

        expect(arr2.length).to.equal(2);
        expect(arr2).to.deep.equal([321, 111]);

        expect(arr3.length).to.equal(1);
        expect(arr3).to.deep.equal([456]);

    });

});
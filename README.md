# naruse-parser
This is a javascript interpreter for naruse code run in different platform

gzip后只有18kb，基于 TypeScript 编写的 JavaScript 解释器，运行于es的环境，支持完整的es5特性与大部分的es6特性，完整的错误提示系统，

编译器是基于`acorn`的`0.12.0`改造后的版本。
解释器是fork于[jsjs](https://github.com/bramblex/jsjs)。

## 使用场景
+  最初的目的是为了以最小体积在内部产品线的热更新组件，配合`naruse`框架在不同的平台进行热更新。

## 安装

```shell
npm i naruse-parser -S
```

## 使用

```javascript
import run from 'naruse-parser';

const exports = run(`
exports.name = 'naruse';
console.log(exports.name);
`);

// naruse

```

## 参数

```ts
interface Options {
	// 外部注入变量
	injectObject?: {} | null;
}

```

## 支持特性

相关特性可以看[这里](https://babeljs.io/docs/en/learn/)，并不一定全部实现。但常用的都会实现的。

- [x] 块级作用域
  - [x] let
  - [x] const
- [ ] Class
  - [ ] 基础声明
  - [ ] extends
  - [ ] class fields
  - [ ] static property
- [x] 箭头函数
  - [x] 基础执行支持
  - [x] context绑定
- [x] 解构
  - [x] 对象解构
  - [x] 数组解构
  - [x] 函数实参解构
- [ ] Rest element
  - [ ] ObjectPattern
  - [ ] ArrayPattern
  - [ ] 函数形参rest
- [x] Map + Set + WeakMap + WeakSet 由外部提供支持，不支持环境请自行导入`polyfill`
- [x] for-of for-in
- [x] Template Strings
- [x] Computed property
- [ ] Symbols
- [ ] Generators (doing)
- [ ] async/await
  - [ ] Async generator functions 不支持


## License
Mozilla Public License Version 2.0

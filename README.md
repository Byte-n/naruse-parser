# naruse-parser
This is a javascript interpreter for naruse code run in different platform

gzip后只有18kb，基于 TypeScript 编写的 JavaScript 解释器，运行于es的环境，支持完整的es5特性与大部分的es6特性，完整的错误提示系统，

编译器是基于`acorn`的`0.12.0`改造后的版本。
解释器是fork于[jsjs](https://github.com/bramblex/jsjs)。

## 使用场景
+  某些限制动态执行JS代码的地方热更新产品。
+  希望能够安全的运行某些JS代码。(推荐配合Proxy使用，能够完全沙箱隔离)
+  学习研究使用。
+  ES5 环境不需要编译直接执行 ES6 代码。（部分支持）

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
/**
 * @parma code 传入的代码片段
 * @parma injectObject 注入的全局变量
 * @parma onError 全局错误收集中心
 */
declare const run: (code: string, injectObject: Record<string, any>, onError?: (e: Error) => void) => any;

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

## 进一步优化速度与体积
- [ ] 热更新只传输 ast
- [ ] ast 压缩传输
- [ ] 加速ast解析

## History
#### 0.0.9
+ #FIX: 修复 for 循环返回值错误的问题
+ #FIX: 修复在某些版本的 babel 中会将 typeof 编译为同名函数，导致运行栈溢出
+ #FEAT: 新增全局错误收集中心
#### 0.0.8
+ #CHORE: 更换入口文件位置与新增TS提示
#### 0.0.7
+ #FEAT: const 重新赋值改为报错
+ #FEAT: acorn 切换为TS
+ #FIX: 修复FOR循环无法使用

#### 0.0.6
+ #CHORE: update readme
#### 0.0.5
+ #FIX:  "const" string cannot be changed
+ #FEAT: support pnpm

## License
Mozilla Public License Version 2.0
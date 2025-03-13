# 前端优质源码

| 序号 | 名称                                          | 描述                      |
| :--: | :-------------------------------------------- | :------------------------ |
|  01  | [arrify](#arrify)                             | 将各种类型转换为数组      |
|  02  | [yocto-queue](#yocto-queue)                   | 轻量级链表队列实现        |
|  03  | [Vue2 工具函数](#vue2-源码方法)               | Vue2 常用工具方法集合     |
|  04  | [axios 工具函数](#axios)                      | axios 请求库工具函数      |
|  05  | [await-to-js](#await-to-js)                   | 优雅处理 async/await 错误 |
|  06  | [promisify](#promisify)                       | 回调函数转 Promise        |
|  07  | [underscore 防抖](#underscore-防抖)           | 函数防抖实现              |
|  08  | [mitt 发布订阅](#mitt、tiny-emitter-发布订阅) | 极简事件发布订阅          |
|  09  | [p-limit](#p-limit-限制并发数)                | Promise 并发控制          |
|  10  | [classNames](#classnames)                     | 类名拼接工具              |
|  10  | [koa-compose](#koa-compose)                   | 洋葱模型                  |

## arrify

https://github.com/sindresorhus/arrify

### 迭代器协议的核心 ​

1. Symbol.iterator 是一个预定义的 Symbol 值，用于定义对象的默认迭代器。任何实现了 [Symbol.iterator]() 方法的对象都被称为 ​ 可迭代对象 ​（Iterable）。该方法必须返回一个 ​ 迭代器对象 ​（Iterator），迭代器对象需实现 next() 方法，返回 { value: any, done: boolean } 的结构。

2. 迭代过程解析 ​
   - 当对可迭代对象使用 for...of 或展开运算符 ... 时，会隐式调用 [Symbol.iterator]() 获取迭代器。
   - 每次调用迭代器的 next() 方法，指针会移动到下一个元素，直到 done: true

### Symbol.iterator 的应用场景

1. 内置可迭代对象

- 数组、字符串、Map、Set​ 等原生支持迭代：

```js
const arr = [1, 2, 3]
const iterator = arr[Symbol.iterator]()
console.log(iterator.next()) // { value: 1, done: false }[1](@ref)
```

- ​ 字符串的字符遍历：

```js
const str = 'hi'
for (const char of str) {
  /* 依次输出 'h', 'i' */
}
```

2. 自定义迭代器

通过实现 [Symbol.iterator]() 方法，可以让普通对象支持迭代：

```js
const obj = {
  data: [10, 20, 30],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => ({
        value: this.data[index++],
        done: index > this.data.length,
      }),
    }
  },
}
for (const num of obj) {
  /* 输出 10, 20, 30 */
}
```

3. 生成器函数

生成器函数（function\*）会自动返回迭代器，yield 控制暂停和恢复：

```js
function* gen() {
  yield 1
  yield 2
}
const it = gen()
console.log(it.next()) // { value: 1, done: false }
```

### 代码中 Symbol.iterator 的关键作用

```js
export default function arrify(value) {
  if (value === null || value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    return [value]
  }

  if (typeof value[Symbol.iterator] === 'function') {
    return [...value]
  }

  return [value]
}
```

- ​ 逻辑解析：
  检查传入的 value 是否实现了 Symbol.iterator 方法。若存在，则通过展开运算符 ... 消费迭代器，将可迭代对象转换为数组。
- 兼容性处理：
  这一设计使得函数能处理所有实现了迭代器协议的数据结构，包括：
  内置对象（数组、字符串、Map、Set 等）
  自定义迭代器对象
  生成器函数返回的迭代器

---

## yocto-queue

https://github.com/sindresorhus/yocto-queue

### 队列实现原理

这是一个基于链表实现的轻量级队列数据结构，采用现代 JavaScript 特性，具有高效的性能特点。

### 核心实现

1. 节点结构

```javascript
class Node {
  value // 存储节点的值
  next // 指向下一个节点的引用

  constructor(value) {
    this.value = value
  }
}
```

2. 队列类设计

```javascript
class Queue {
  #head // 队列头部指针
  #tail // 队列尾部指针
  #size // 队列大小计数器
}
```

### 关键方法实现

1. 入队操作（enqueue）

```javascript
enqueue(value) {
    const node = new Node(value);
    if (this.#head) {
        this.#tail.next = node;
        this.#tail = node;
    } else {
        this.#head = node;
        this.#tail = node;
    }
    this.#size++;
}
```

2. 出队操作（dequeue）

```javascript
dequeue() {
    const current = this.#head;
    if (!current) {
        return;
    }
    this.#head = this.#head.next;
    this.#size--;
    return current.value;
}
```

3. 迭代器支持

```javascript
* [Symbol.iterator]() {const queue = new Queue();

// 添加元素
queue.enqueue('任务1');
queue.enqueue('任务2');
queue.enqueue('任务3');

// 获取队列大小
console.log(queue.size);  // 输出: 3

// 查看队首元素
console.log(queue.peek());  // 输出: '任务1'

// 移除并返回队首元素
console.log(queue.dequeue());  // 输出: '任务1'

// 遍历队列
for (const item of queue) {
    console.log(item);  // 依次输出: '任务2', '任务3'
}
    let current = this.#head;
    while (current) {
        yield current.value;
        current = current.next;
    }
}
```

4. 性能优化

- 通过维护尾指针（#tail）避免每次入队时遍历整个链表
- 所有核心操作（入队、出队）都是 O(1) 时间复杂度

### 使用示例

```ts
const queue = new Queue()

// 添加元素
queue.enqueue('任务1')
queue.enqueue('任务2')
queue.enqueue('任务3')

// 获取队列大小
console.log(queue.size) // 输出: 3

// 查看队首元素
console.log(queue.peek()) // 输出: '任务1'

// 移除并返回队首元素
console.log(queue.dequeue()) // 输出: '任务1'

// 遍历队列
for (const item of queue) {
  console.log(item) // 依次输出: '任务2', '任务3'
}
```

### 应用场景

1. 任务队列管理
2. 事件处理系统
3. 消息缓冲处理
4. 广度优先搜索（BFS）
5. 打印任务管理

### 优势特点

1. 使用私有字段（#）确保数据封装
2. 支持迭代器接口，方便遍历
3. 实现简洁，代码易于维护
4. 性能优化，操作效率高
5. 符合 FIFO（先进先出）原则

## Vue2 源码方法

https://github.com/vuejs/vue/blob/dev/dist/vue.js#L14-L379

### 类型检查函数

```js
// 检查值是否为 undefined 或 null
function isUndef(v) {
  return v === null || v === undefined
}
console.log(isUndef(null)) // true
console.log(isUndef(undefined)) // true
console.log(isUndef(0)) // false

// 检查值是否已定义（非 undefined 且非 null）
function isDef(v) {
  return v !== undefined && v !== null
}
console.log(isDef(123)) // true
console.log(isDef('')) // true
console.log(isDef(null)) // false

// 检查值是否为 true
function isTrue(v) {
  return v === true
}
console.log(isTrue(true)) // true
console.log(isTrue(1)) // false

// 检查值是否为 false
function isFalse(v) {
  return v === false
}
console.log(isFalse(false)) // true
console.log(isFalse(0)) // false

// 检查值是否为原始类型（字符串、数字、布尔值或符号）
function isPrimitive(v) {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'symbol'
  )
}
console.log(isPrimitive(123)) // true
console.log(isPrimitive('hello')) // true
console.log(isPrimitive({})) // false

// 检查值是否为对象（不包括 null）
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
console.log(isObject({})) // true
console.log(isObject([])) // true
console.log(isObject(null)) // false
```

### 类型转换与判断

```js
// 获取对象的原始类型字符串
var _toString = Object.prototype.toString
function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}
console.log(toRawType(true)) // 'Boolean'
console.log(toRawType([])) // 'Array'
console.log(toRawType({})) // 'Object'

// 检查是否为普通对象
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
console.log(isPlainObject({ name: 123 })) // true
console.log(isPlainObject([])) // false

// 检查是否为正则表达式
function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}
console.log(isRegExp(/^abc$/)) // true
console.log(isRegExp('abc')) // false

// 检查是否为有效的数组索引
// n >= 0 ：确保值为非负数（因为数组索引不能为负）
// Math.floor(n) === n ：确保值是整数（不能是小数）
// isFinite(val) ：确保值是有限数（不能是 Infinity 或 NaN）
function isValidArrayIndex(val) {
  var n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
console.log(isValidArrayIndex(3)) // true
console.log(isValidArrayIndex('3')) // true
console.log(isValidArrayIndex(-1)) // false
console.log(isValidArrayIndex(3.5)) // false

// 检查是否为 Promise 对象
function isPromise(val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
console.log(isPromise(new Promise(() => {}))) // true
console.log(isPromise({ then: () => {}, catch: () => {} })) // true
console.log(isPromise({})) // false
```

### 值转换函数

```js
// 将值转换为字符串
function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}
console.log(toString(null)) // ''
console.log(toString([1, 2, 3])) // '[1,2,3]'
console.log(toString(123)) // '123'

// 将字符串转换为数字
function toNumber(val) {
  var n = parseFloat(val)
  return isNaN(n) ? val : n
}
console.log(toNumber('123')) // 123
console.log(toNumber('123px')) // '123px'
```

### 缓存与性能优化

```js
// 检查对象是否拥有自身属性
// 缓存 hasOwnProperty 方法的引用:
//   1. 提高性能：避免每次都查找原型链;
//   2. 防止被覆盖：避免对象自身的 hasOwnProperty 属性干扰
var hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn(obj, key) {
  // 确保方法在正确的上下文中执行
  return hasOwnProperty.call(obj, key)
}
console.log(hasOwn({ a: 1 }, 'a')) // true
console.log(hasOwn({ a: 1 }, 'toString')) // false

// 创建一个带缓存的函数
function cached(fn) {
  // 创建一个空对象作为缓存容器，使用 Object.create(null) 创建的对象没有原型链，更纯净
  var cache = Object.create(null)

  // 返回一个新函数，这个函数包含缓存逻辑
  return function cachedFn(str) {
    // 检查缓存中是否已有结果
    var hit = cache[str]
    // 如果有缓存就返回缓存值，没有则执行函数并缓存结果
    return hit || (cache[str] = fn(str))
  }
}

// 将连字符分隔的字符串转为驼峰式
var camelizeRE = /-(\w)/g
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
})
console.log(camelize('some-prop')) // 'someProp'

// 首字母大写
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
})
console.log(capitalize('hello')) // 'Hello'

// 将驼峰式转为连字符分隔
var hyphenateRE = /\B([A-Z])/g
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})
console.log(hyphenate('someProp')) // 'some-prop'
```

### 集合与映射操作`

```js
// 创建一个映射函数，用于快速查找
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null)
  var list = str.split(',')
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? function (val) {
        return map[val.toLowerCase()]
      }
    : function (val) {
        return map[val]
      }
}
var isBuiltInTag = makeMap('slot,component', true)
console.log(isBuiltInTag('slot')) // true
console.log(isBuiltInTag('SLOT')) // true
console.log(isBuiltInTag('div')) // undefined

// 从数组中移除指定项
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
var arr = [1, 2, 3]
remove(arr, 2)
console.log(arr) // [1, 3]
```

### 函数操作与绑定

```js
// polyfill 版本的 bind 实现
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  boundFn._length = fn.length
  return boundFn
}

// 原生 bind 方法
function nativeBind(fn, ctx) {
  return fn.bind(ctx)
}

// 根据环境选择 bind 实现
var bind = Function.prototype.bind ? nativeBind : polyfillBind

// 示例
const obj = { name: 'test' }
function greet() {
  return this.name
}
const boundGreet = bind(greet, obj)
console.log(boundGreet()) // 'test'
```

### 数组和对象操作

```js
// 将类数组转换为数组
// 将函数的 arguments 对象（类数组）转换为真正的数组
// 从DOM API返回的NodeList等类数组对象转换为数组
// 截取数组的一部分并创建新数组
function toArray(list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    // 使用递减循环填充数组
    ret[i] = list[i + start] // 从原数组的start位置开始复制元素
  }
  return ret
}
console.log(toArray(['a', 'b', 'c'], 1)) // ['b', 'c']

// 对象合并:
//  合并配置对象
//  扩展默认选项
//  混入(mixin)功能的实现
//  组件选项的合并
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key]
  }
  return to
}
console.log(extend({ a: 1 }, { b: 2 })) // { a: 1, b: 2 }

// 数组对象合并
function toObject(arr) {
  var res = {}
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}
console.log(toObject([{ a: 1 }, { b: 2 }])) // { a: 1, b: 2 }
```

### 工具函数

```js
// 空函数：在 Vue 中常用于默认的事件处理器、回调函数等
function noop(a, b, c) {}

// 始终返回 false 的函数：常用于平台特性检测的默认值、条件判断等场景
var no = function (a, b, c) {
  return false
}

// 返回原值的函数：用于默认的值处理器、映射函数等
var identity = function (_) {
  return _
}

// 生成静态键字符串
function genStaticKeys(modules) {
  return modules
    .reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, [])
    .join(',')
}
console.log(genStaticKeys([{ staticKeys: ['a', 'b'] }, { staticKeys: ['c'] }])) // 'a,b,c'
```

### 相等性判断

```js
// 松散相等判断
function looseEqual(a, b) {
  if (a === b) return true
  var isObjectA = isObject(a)
  var isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a)
      var isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => looseEqual(e, b[i]))
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a)
        var keysB = Object.keys(b)
        return (
          keysA.length === keysB.length &&
          keysA.every((key) => looseEqual(a[key], b[key]))
        )
      }
      return false
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  }
  return false
}

// 松散索引查找
function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

console.log(looseEqual([1, 2], [1, 2])) // true
console.log(looseEqual({ a: 1 }, { a: 1 })) // true
console.log(looseIndexOf([{ a: 1 }], { a: 1 })) // 0
```

### 函数执行控制

```js
// 确保函数只执行一次
// 初始化操作:确保某些初始化代码只执行一次,例如：配置项设置、资源加载等。
// 防重复提交:表单提交按钮的点击处理。
function once(fn) {
  var called = false // 闭包变量，用于记录函数是否已执行
  return function () {
    if (!called) {
      called = true // 标记为已调用
      fn.apply(this, arguments) // 执行原函数
    }
  }
}

// 示例
const onceLog = once(() => console.log('只打印一次'))
onceLog() // '只打印一次'
onceLog() // 无输出
```

这些工具函数展示了 Vue2 源码中优雅而实用的编程实践，它们不仅在 Vue 框架内部使用，也可以作为日常开发中的工具函数使用。每个函数都经过精心设计，确保了最大的实用性和性能。

## axios

https://github.com/axios/axios/blob/v1.x/lib/utils.js

### 特殊对象类型判断

```js
// - 值不为 null
// - 值已定义
// - 值有构造函数
// - 构造函数有 isBuffer 方法
// - 通过构造函数的 isBuffer 方法判断
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    typeof val.constructor.isBuffer === 'function' &&
    val.constructor.isBuffer(val)
  )
}
```

使用 Object.prototype.toString 方法来准确判断对象的具体类型。

```js
// 日期对象判断
function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]'
}

// 文件对象判断
function isFile(val) {
  return Object.prototype.toString.call(val) === '[object File]'
}

// Blob 对象判断
function isBlob(val) {
  return Object.prototype.toString.call(val) === '[object Blob]'
}

// isFunction 判断函数
function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]'
}

// isStream 判断是否是流
function isStream(val) {
  return isObject(val) && isFunction(val.pipe)
}
```

### URLSearchParams 判断

```JS
function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}

// - 首先确保环境支持 URLSearchParams
// - 然后使用 instanceof 判断实例

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
isURLSearchParams(searchParams) // true
```

### 字符串处理

- 优先使用原生的 trim 方法
- 如果不支持，则降级使用正则表达式实现
- 正则 /^\s+|\s+$/g 匹配开头和结尾的空白字符

```js
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}

trim('       123 ') // '123'
```

## await-to-js

https://github.com/scopsy/await-to-js/

异步任务处理的方法从最初的回调函数，逐渐发展成为了 Promise，async/await，以及 Generator 函数。每种方法都有其特点，例如 Promise 提供了错误捕获和链式调用，async/await 使得异步代码可以像同步代码一样编写，而 Generator 函数允许异步任务的暂停和恢复。

await-to-js 库能够简化 async 函数中的错误处理，它通过 to 函数将 Promise 的结果和错误封装成数组返回，从而避免了繁琐的 try-catch 语句。

可以显著提高代码的可读性和简洁性，特别是在处理多个异步操作时，它能够有效地减少代码量，使错误处理更加直观。

```ts
export function to<T, U = Error>(
  promise: Promise<T>, // 接收一个 Promise
  errorExt?: object, // 可选的错误扩展对象
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data]) // Promise 成功：返回 [null, 数据]
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        // 如果提供了错误扩展对象，合并错误信息
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined] // Promise 失败：返回 [错误, undefined]
      }

      return [err, undefined]
    })
}

export default to

// 使用示例
const [err, data] = await to(somePromise())
if (err) {
  // 处理错误
  console.error(err)
  return
}
// 使用成功的数据
console.log(data)
```

优点：

- 避免了 try-catch 的嵌套
- 使错误处理更加优雅和统一
- 提供了类似 Go 语言的错误处理模式
- 支持自定义错误信息扩展

## promisify

https://github.com/nodejs/node/blob/main/lib/internal/util.js#L428

[utils promisify 文档](https://nodejs.cn/api/util/util_promisify_original.html)。

1. promisify 是一种将回调函数转换为返回 Promise 的技术，可以有效解决回调地狱的问题。
2. Node.js 的 util.promisify 方法是对 callback promisify 化实现的抽象，它简化了异步代码的编写，并提高了代码的可读性和可维护性。
3. 通过对 Node.js 源码的分析，可以更深入地理解 promisify 的实现原理，包括错误处理、异步执行流程和适应不同回调模式的能力。
4. 使用 promisify 后的代码更加清晰，易于理解和维护，同时也能够更好地利用 async/await 语法糖，进一步简化异步代码的结构。

```js
const kCustomPromisifiedSymbol = SymbolFor('nodejs.util.promisify.custom')
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs')

let validateFunction

function promisify(original) {
  // Lazy-load to avoid a circular dependency.
  if (validateFunction === undefined)
    ({ validateFunction } = require('internal/validators'))

  validateFunction(original, 'original')

  if (original[kCustomPromisifiedSymbol]) {
    const fn = original[kCustomPromisifiedSymbol]

    validateFunction(fn, 'util.promisify.custom')

    return ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true,
    })
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol]

  function fn(...args) {
    return new Promise((resolve, reject) => {
      ArrayPrototypePush(args, (err, ...values) => {
        if (err) {
          return reject(err)
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {}
          for (let i = 0; i < argumentNames.length; i++)
            obj[argumentNames[i]] = values[i]
          resolve(obj)
        } else {
          resolve(values[0])
        }
      })
      ReflectApply(original, this, args)
    })
  }

  ObjectSetPrototypeOf(fn, ObjectGetPrototypeOf(original))

  ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true,
  })
  return ObjectDefineProperties(fn, ObjectGetOwnPropertyDescriptors(original))
}

promisify.custom = kCustomPromisifiedSymbol
```

```js
import { promisify } from 'node:util'
import childProcess from 'node:child_process'

const execFile = promisify(childProcess.execFile) // 将 execFile 转换为 Promise 形式

export default async function remoteGitTags(repoUrl) {
  // 执行 git ls-remote --tags 命令获取远程仓库的标签信息
  const { stdout } = await execFile('git', ['ls-remote', '--tags', repoUrl])
  const tags = new Map() // 创建 Map 存储标签信息

  // 处理命令输出
  for (const line of stdout.trim().split('\n')) {
    const [hash, tagReference] = line.split('\t') // 分割哈希值和标签引用

    // 处理标签名称：
    // 1. 移除 "refs/tags/" 前缀
    // 2. 移除 "^{}" 后缀（用于标识标签对象）
    const tagName = tagReference
      .replace(/^refs\/tags\//, '')
      .replace(/\^{}$/, '')

    tags.set(tagName, hash) // 存储标签名和对应的提交哈希
  }

  return tags // 返回标签映射
}

// 使用示例
const tags = await remoteGitTags('https://github.com/user/repo.git')
console.log(tags) // Map { 'v1.0.0' => 'abcd123...', 'v2.0.0' => 'efgh456...' }
```

## underscore 防抖

https://github.com/jashkenas/underscore/blob/master/modules/debounce.js

防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

```js
import restArguments from './restArguments.js'
import now from './now.js'

// func : 需要防抖的函数
// wait : 等待时间（毫秒）
// immediate : 是否在触发开始时立即执行
export default function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context

  // 延迟执行处理
  var later = function () {
    var passed = now() - previous // 计算经过的时间
    if (wait > passed) {
      // 如果还没到等待时间
      timeout = setTimeout(later, wait - passed) // 继续等待
    } else {
      timeout = null
      if (!immediate) result = func.apply(context, args) // 非立即执行模式下调用函数
      if (!timeout) args = context = null // 清理引用
    }
  }

  var debounced = restArguments(function (_args) {
    context = this
    args = _args
    previous = now()
    if (!timeout) {
      // 首次调用
      timeout = setTimeout(later, wait)
      if (immediate) result = func.apply(context, args) // 立即执行模式
    }
    return result
  })

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = args = context = null
  }

  return debounced
}
```

工作原理：

1. 当函数被频繁调用时，每次调用都会重置定时器
2. 只有在停止调用后的 wait 毫秒才会执行函数
3. 如果设置了 immediate，则首次调用会立即执行
4. 提供 cancel 方法可以取消待执行的函数

使用场景：

- 搜索框输入联想
- 窗口大小调整
- 按钮快速点击
- 表单验证

## mitt、tiny-emitter 发布订阅

https://github.com/developit/mitt/

在 mitt 这个库中，整体分析起来比较简单，就是 导出了一个 mitt([all])函数，调用该函数返回一个 emitter 对象，该对象包含 all、on(type, handler)、off(type, [handler])和 emit(type, [evt])这几个属性。
主要实现就是：

all = all || new Map() mitt 支持传入 all 参数用来存储事件类型和事件处理函数的映射 Map，如果不传，就 new Map()赋值给 all
on(type, handler)定义函数 on 来注册事件，以 type 为属性，[handler]为属性值，存储在 all 中，属性值为数组的原因是可能存在监听一个事件，多个处理程序
off(type, [handler])来取消某个事件的某个处理函数，根据 type 找到对应的事件处理数组，对比 handler 是否相等，相等则删除该处理函数，不传则删除该事件的全部处理函数
emit(type, [evt])来派发事件，根据 type 找到对应的事件处理数组并依次执行，传入参数 evt(对象最好，传多个参数只会取到第一个)

```ts
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>,
): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>
  // 初始化事件存储 Map
  all = all || new Map()
  // 返回事件发射器对象
  return {
    all,

    // on 方法 - 注册事件监听器
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type)
      if (handlers) {
        handlers.push(handler) // 已有该事件类型，直接添加处理器
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>) // 首次注册该事件类型
      }
    },

    // off 方法 - 移除事件监听器
    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type)
      if (handlers) {
        if (handler) {
          // 移除特定处理器
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          // 移除该类型的所有处理器
          all!.set(type, [])
        }
      }
    },

    // emit 方法 - 触发事件
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      // 触发特定类型的处理器
      let handlers = all!.get(type)

      if (handlers) {
        ;(handlers as EventHandlerList<Events[keyof Events]>)
          .slice() // 使用 .slice() 创建处理器数组的副本，避免在遍历过程中修改数组导致问题
          .map((handler) => {
            handler(evt!)
          })
      }

      // 触发通配符 '*' 处理器
      handlers = all!.get('*')
      if (handlers) {
        ;(handlers as WildCardEventHandlerList<Events>)
          .slice()
          .map((handler) => {
            handler(type, evt!)
          })
      }
    },
  }
}
```

设计亮点：

- 极简设计 ：整个库只有三个核心方法，API 简洁明了
- 类型安全 ：利用 TypeScript 泛型提供完整的类型推导和检查
- 通配符支持 ：可以使用 \* 监听所有事件
- 零依赖 ：不依赖任何外部库
- 小巧高效 ：压缩后仅约 200 字节
- 防御性编程 ：使用 .slice() 复制数组，避免在触发事件时修改处理器列表导致的问题

## p-limit 限制并发数

https://github.com/sindresorhus/p-limit

是一个用于控制 Promise 并发执行数量的库。

```js
import Queue from 'yocto-queue' // 引入队列实现

export default function pLimit(concurrency) {
  validateConcurrency(concurrency) // 验证并发数参数有效性

  const queue = new Queue() // 创建任务队列
  let activeCount = 0 // 当前正在执行的任务数

  // 执行下一个任务
  const resumeNext = () => {
    // 当活跃任务数小于并发限制且队列不为空时，执行下一个任务
    if (activeCount < concurrency && queue.size > 0) {
      queue.dequeue()() // 从队列取出一个任务并执行
      activeCount++ // 增加活跃任务计数
    }
  }

  // 任务完成后的处理
  const next = () => {
    activeCount-- // 减少活跃任务计数
    resumeNext() // 尝试执行下一个任务
  }

  // 执行任务并处理结果
  const run = async (function_, resolve, arguments_) => {
    const result = (async () => function_(...arguments_))() // 执行任务函数

    resolve(result) // 立即解析外部 Promise，不等待任务完成

    try {
      await result // 等待任务真正完成
    } catch {} // 忽略任务执行中的错误

    next() // 任务结束，触发后续逻辑
  }

  // 将任务加入队列
  const enqueue = (function_, resolve, arguments_) => {
    // 将任务包装在 Promise 中加入队列
    new Promise((internalResolve) => {
      queue.enqueue(internalResolve)
    }).then(run.bind(undefined, function_, resolve, arguments_))

    // 异步检查是否可以立即执行任务
    ;(async () => {
      await Promise.resolve() // 等待下一个微任务

      if (activeCount < concurrency) {
        resumeNext() // 如果有空闲槽位，执行下一个任务
      }
    })()
  }

  // 主函数返回的函数，将任务包装在Promise并加入队列
  const generator = (function_, ...arguments_) =>
    new Promise((resolve) => {
      enqueue(function_, resolve, arguments_)
    })

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount, // 获取当前活跃任务数
    },
    pendingCount: {
      get: () => queue.size, // 获取等待中的任务数
    },
    clearQueue: {
      value() {
        queue.clear() // 清空队列
      },
    },
    concurrency: {
      get: () => concurrency, // 获取并发限制
      set(newConcurrency) {
        // 动态修改并发限制
        validateConcurrency(newConcurrency)
        concurrency = newConcurrency

        queueMicrotask(() => {
          while (activeCount < concurrency && queue.size > 0) {
            resumeNext() // 尝试执行更多任务
          }
        })
      },
    },
  })

  return generator
}

// 辅助函数，用于限制特定函数的并发执行
export function limitFunction(function_, option) {
  const { concurrency } = option
  const limit = pLimit(concurrency)

  return (...arguments_) => limit(() => function_(...arguments_))
}

// 验证并发数参数的有效性
function validateConcurrency(concurrency) {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up')
  }
}
```

工作流程：

![plimit](./public/plimit.png)

设计亮点：

- 微任务队列的巧妙使用 ：确保任务状态更新和检查在正确的时机进行
- 立即解析外部 Promise ：让调用者可以立即获得任务的 Promise，而不必等待任务真正执行
- 动态调整并发数 ：支持在运行时修改并发限制
- 状态查询接口 ：提供 activeCount 和 pendingCount 属性查询当前状态
- 错误隔离 ：一个任务的失败不会影响其他任务的执行

[Node.js 并发能力总结](https://mp.weixin.qq.com/s/6LsPMIHdIOw3KO6F2sgRXg)

[关于请求并发控制的思考](https://juejin.cn/post/7045274658798567454)

## classNames

https://github.com/JedWatson/classnames

classNames 函数可以接受任意数量的参数，包括字符串和对象，并且可以处理动态类名。在 React.js 中，它可以用来简化动态和条件 className 属性的处理。

```js
const hasOwn = {}.hasOwnProperty

// 这个主函数接收任意数量的参数，遍历每个参数，如果参数有效（非假值），则通过 parseValue 解析参数值，并用 appendClass 将解析结果添加到最终的类名字符串中。
export default function classNames() {
  let classes = ''

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (arg) {
      classes = appendClass(classes, parseValue(arg))
    }
  }

  return classes
}

function parseValue(arg) {
  // 字符串 ：直接返回
  if (typeof arg === 'string') {
    return arg
  }
  // 非对象类型且非字符串 ：返回空字符串
  if (typeof arg !== 'object') {
    return ''
  }

  // 递归调用 classNames ，处理数组中的每个元素
  if (Array.isArray(arg)) {
    return classNames.apply(null, arg)
  }

  // 处理自定义 toString 方法的对象
  if (
    arg.toString !== Object.prototype.toString &&
    !arg.toString.toString().includes('[native code]')
  ) {
    return arg.toString()
  }

  // 普通对象 ：遍历对象的键值对，当值为真时，将键作为类名添加
  let classes = ''
  for (const key in arg) {
    if (hasOwn.call(arg, key) && arg[key]) {
      classes = appendClass(classes, key)
    }
  }

  return classes
}

// 类名拼接函数:
// - 如果新类名为空，则返回原类名
// - 如果原类名为空，则返回新类名
// - 否则，用空格连接原类名和新类名
function appendClass(value, newClass) {
  if (!newClass) {
    return value
  }

  return value ? value + ' ' + newClass : newClass
}
```

设计亮点：

- 灵活的参数处理 ：可以接受字符串、对象、数组或它们的任意组合
- 条件类名 ：通过对象的值来决定是否包含某个类名
- 递归处理 ：能够处理嵌套数组
- 性能优化 ：使用字符串拼接而非数组操作，减少内存分配
- 防御性编程 ：处理各种边缘情况，如自定义 toString 方法的对象

实际应用：

```jsx
import classNames from 'classnames'

function Button({ isActive, isDisabled, className }) {
  return (
    <button
      className={classNames(
        'button', // 基础类
        {
          'button--active': isActive, // 条件类
          'button--disabled': isDisabled,
        },
        className, // 外部传入的类
      )}
    >
      Click me
    </button>
  )
}
```

## koa-compose 洋葱模型

https://github.com/koajs/compose/blob/master/index.js

koa-compose 是 Koa 框架中实现洋葱模型的核心代码。compose 函数接收一个中间件数组，返回一个组合后的中间件函数，这个函数能够按照洋葱模型的方式依次执行所有中间件。

```js
module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware) {
  // 传入的 middleware 必须是数组
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    // 数组中的每一项都必须是函数
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  // 返回组合后的中间件函数
  return function (context, next) {
    // 返回一个接收 context 和可选的 next 参数的函数，这个函数会从第一个中间件开始执行。
    let index = -1
    return dispatch(0)
    // 递归调度函数 dispatch
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

洋葱模型的核心实现：

1. 防止重复调用 ：如果当前索引小于等于上一次执行的索引，说明 next() 被多次调用，抛出错误
2. 更新索引 ：记录当前执行的中间件索引
3. 获取当前中间件 ：从数组中取出当前索引对应的中间件函数
4. 处理最后一个中间件 ：如果已经是最后一个中间件，则使用传入的 next 函数
5. 处理无中间件情况 ：如果没有中间件函数，返回已解决的 Promise
6. 执行中间件 ：
   - 将 context 和下一个中间件的 dispatch 函数传给当前中间件
   - 确保返回值是 Promise（通过 Promise.resolve 包装）
   - 捕获同步错误并转换为 rejected Promise

使用示例：

```js
const Koa = require('koa')
const compose = require('koa-compose')
const app = new Koa()

// 中间件1
async function middleware1(ctx, next) {
  console.log('1 开始')
  await next()
  console.log('1 结束')
}

// 中间件2
async function middleware2(ctx, next) {
  console.log('2 开始')
  await next()
  console.log('2 结束')
}

// 中间件3
async function middleware3(ctx, next) {
  console.log('3 开始')
  await next()
  console.log('3 结束')
}

// 组合中间件
const middlewares = compose([middleware1, middleware2, middleware3])

// 使用组合后的中间件
app.use(middlewares)

// 输出顺序:
// 1 开始
// 2 开始
// 3 开始
// 3 结束
// 2 结束
// 1 结束
```

工作原理

1. 请求从最外层中间件进入，穿过所有中间件的"前半部分"到达最内层
2. 然后从最内层开始，穿过所有中间件的"后半部分"返回
3. 每个中间件都分为两个阶段：

   - await next() 之前的代码是"前半部分"
   - await next() 之后的代码是"后半部分"

设计亮点：

1. 在请求处理前执行准备工作
2. 控制是否继续执行下一个中间件
3. 在下游中间件执行完毕后执行清理工作
4. 修改请求和响应对象

这就是 Koa 中间件系统的精髓，通过简洁的设计实现了强大的功能扩展和控制流管理。

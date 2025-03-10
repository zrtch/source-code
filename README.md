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

isBuffer 判断 buffer

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。详细可以看 官方文档 或 更通俗易懂的解释。

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

### 特殊对象类型判断

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

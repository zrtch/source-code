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

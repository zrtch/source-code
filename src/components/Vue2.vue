<script lang="ts">
// var emptyObject = Object.freeze({})
// emptyObject.age = 123
// console.log(emptyObject)
// Vue2.vue:3 Uncaught TypeError: Cannot add property age, object is not extensible

function isUndef(v) {
  return v === null || v === undefined
}
console.log(isUndef(null)) // true

function isDef(v) {
  return v !== undefined && v !== null
}
console.log(isDef(123))

function isTrue(v) {
  return v === true
}
console.log('🤩  isTrue  isTrue:', isTrue(true))

function isFalse(v) {
  return v === false
}
console.log('🤩  isFalse  isFalse:', isFalse(false))

function isPrimitive(v) {
  return (
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'symbol' ||
    typeof v === 'string'
  )
}
console.log('🤩  isParmary  isParmary:', isPrimitive(123))

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
console.log('🤩  isParmary  isParmary:', isObject({}))

var _toString = Object.prototype.toString
function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}
console.log(toRawType(true)) // 'Boolean'
console.log(toRawType([])) // 'Array'
console.log(toRawType({})) // 'Object'

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
console.log('🤩  isPlainObject  isPlainObject:', isPlainObject({ name: 123 }))

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}
console.log(
  '🤩  isRegExp  isRegExp:',
  isRegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/),
)

function isValidArrayIndex(val) {
  var n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
console.log(
  '🤩  isValidArrayIndex  isValidArrayIndex:',
  isValidArrayIndex([123]),
)

function isPromise(val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
console.log(
  '🤩  isPromise  isPromise:',
  isPromise(new Promise((resolve, reject) => {})),
)

function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}
console.log('🤩  toString  toString:', toString([]))

function toNumber(val) {
  var n = parseFloat(val)
  return isNaN(n) ? val : n
}
console.log(toNumber('123')) // 123
console.log(toNumber('123px')) // '123px'

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
const arr = [1, 2, 3, 4]
remove(arr, 2)
console.log('🤩  arr:', arr)

var hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn(obj, key) {
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

// 创建一个耗时的函数
function expensiveFunction(str) {
  console.log('执行复杂计算...')
  return str.toUpperCase()
}
// 创建带缓存的版本
const cachedFn = cached(expensiveFunction)
// 第一次调用，会执行函数
console.log(cachedFn('hello')) // 输出：执行复杂计算... HELLO
// 第二次调用相同参数，直接返回缓存结果
console.log(cachedFn('hello')) // 输出：HELLO（不会显示"执行复杂计算"）
// 不同参数会重新执行函数
console.log(cachedFn('world')) // 输出：执行复杂计算... WORLD

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
console.log(isBuiltInTag('div')) // undefined

// 将类数组转换成数组
function toArray(list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
console.log(toArray(['a', 'b', 'c'], 2)) // ['c']

function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key] // 将源对象的属性复制到目标对象
  }
  return to
}
console.log(extend({ a: 1 }, { b: 2, c: 3 })) // {a: 1, b: 2, c: 3}

// 数组对象合并
function toObject(arr) {
  var res = {}
  for (var i = 0; i <= arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}
console.log(toObject([{ a: 1 }, { b: 2 }]))

// 生成静态键字符串
function genStaticKeys(modules) {
  return modules
    .reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, [])
    .join(',')
}
const gen = genStaticKeys([
  {
    staticKeys: ['a', 'b'],
  },
  {
    staticKeys: ['c', 'd'],
  },
])
console.log('🤩  gen:', gen) // a,b,c,d

// 确保函数只执行一次,利用闭包特性，存储状态
// 初始化操作 ：
//    确保某些初始化代码只执行一次。例如：配置项设置、资源加载等
// 事件绑定：
//    防止重复绑定事件处理器
// 防重复提交 ：
// 表单提交按钮的点击处理
function once(fn) {
  var called = false // 闭包变量，用于记录函数是否已执行
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments) // 执行原函数
    }
  }
}

const fn1 = once(function () {
  console.log('无论你怎么调用，我只执行一次')
})
fn1() // '无论你怎么调用，我只执行一次'
fn1() // 不输出
fn1() // 不输出
fn1() // 不输出
</script>

<template></template>

<style></style>

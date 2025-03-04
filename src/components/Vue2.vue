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

function toRowTyep(value) {
  return _toString.call(value).slice(8, -1)
}
console.log('🤩  toRowTyep  toRowTyep:', toRowTyep(true))

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
console.log('🤩  toNumber  toNumber:', toNumber('123'))
</script>

<template></template>

<style></style>

<template></template>

<script lang="ts">
var toString = Object.prototype.toString

function isArray(val) {
  return toString.call(val) === '[object Array]'
}
console.log(isArray('123'))
console.log(isArray([123]))

function isUndefined(val) {
  return typeof val === 'undefined'
}
console.log('🤩  isUndefined  isUndefined:', isUndefined(123))
console.log('🤩  isUndefined  isUndefined:', isUndefined(undefined))

function isFunction(val) {
  return typeof val === 'function'
}

function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  )
}
console.log('🤩  isBuffer  isBuffer:', isBuffer('123'))

function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]'
}
console.log('🤩  isDate  isDate:', isDate(new Date()))

function isFile(val) {
  return Object.prototype.toString.call(val) === '[object File]'
}
console.log('🤩  isFile  isFile:', isFile('123'))

function isBlob(val) {
  return Object.prototype.toString.call(val) === '[object Blob]'
}

function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  )
}

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
isURLSearchParams(searchParams) // true

function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}
console.log('🤩  trim  trim:', trim('       123 '))
</script>

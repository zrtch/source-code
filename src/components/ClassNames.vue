<script setup lang="ts">
import classNames from 'classnames'

const classNames1 = classNames('foo', 'bar')
console.log('🤩 classNames1:', classNames1)

const classNames2 = classNames('noobjk', { bar: true, baz: false })
console.log('🤩 classNames2:', classNames2)

const classNames3 = classNames('array', ['foo', 'bar'])
console.log('🤩  classNames3:', classNames3)

const classNames4 = classNames({ foo: true }, { bar: false })
console.log('🤩 classNames4:', classNames4) // foo

const classNames5 = classNames('foo', { bar: true, baz: false }, 'qux', [
  'quux',
  { corge: true },
])
console.log('🤩  classNames5:', classNames5)

// 返回对象自身可枚举属性的键名数组
Object.keys({
  foo: 1,
  foo1: 2,
}).forEach((dir) => {
  console.log(dir)
})

// 对象合并
const obj1 = {
  a: 1,
}
const obj2 = {
  b: 2,
}
const files = Object.assign(obj1, obj2)
console.log('🤩  files:', files)

const arr = [1, 2, 3]
arr.forEach((num) => {
  console.log(num)
})

function getLettereUpper(a) {
  return a[0].toUpperCase() + a.slice(1)
}
const str = getLettereUpper('hello')
console.log(str)
</script>
<template></template>

<style scoped></style>

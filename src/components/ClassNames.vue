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
</script>
<template></template>

<style scoped></style>

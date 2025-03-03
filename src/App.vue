<script setup lang="ts">
import arrify from 'arrify'

const arr = arrify('🦄')

const arr1 = [1, 2, 3]
const iterator = arr1[Symbol.iterator]()
console.log('🤩  iterator:', iterator.next())
</script>

<template>
  <div>{{ arr }}</div>
</template>

<style scoped></style>

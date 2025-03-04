<script setup lang="ts">
import Queue from 'yocto-queue'

const queue = new Queue()

queue.enqueue('🦄')
queue.enqueue('🌈')

console.log(queue.size)
//=> 2

console.log(...queue)
//=> '🦄 🌈'

console.log(queue.dequeue())
//=> '🦄'

console.log(queue.dequeue())
//=> '🌈'
</script>

<template></template>

<style scoped></style>

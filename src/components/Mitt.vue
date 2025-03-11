<script setup lang="ts">
import mitt from 'mitt'

// 创建事件发射器
const emitter = mitt()

// 监听事件
emitter.on('foo', (e) => console.log('foo 事件触发:', e))
emitter.on('*', (type, e) => console.log(`通配符捕获 ${type} 事件:`, e))

// 触发事件
emitter.emit('foo', { a: 'b' })

// 移除特定事件监听器
const handler = () => {
  console.log('bar 事件')
  emitter.off('bar', handler)
  console.log('已移除 bar 事件监听器')
}

// 添加 bar 事件监听器
emitter.on('bar', handler)

// 创建一个触发 bar 事件的函数
const triggerBar = () => {
  console.log('触发 bar 事件')
  emitter.emit('bar')
}
</script>

<template>
  <div>
    <button @click="triggerBar">触发 bar 事件</button>
    <button @click="handler">移除 bar 监听器</button>
  </div>
</template>

<style scoped></style>

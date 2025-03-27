<script setup>
// vue2 响应式原理
const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
  },
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

function Observe(obj) {
  if (!isObject(obj)) {
    return
  }
  // 遍历对象的所有属性
  for (let k in obj) {
    let v = obj[k]
    // 递归监听嵌套对象
    if (isObject(v)) {
      Observe(v)
    }
    Object.defineProperty(obj, k, {
      get() {
        console.log('读取', k)
        return v
      },
      set(val) {
        if (val === v) {
          return v
        }
        v = val
        console.log('修改', k)
      },
    })
  }
}

Observe(obj)
obj.a
obj.b = 123
obj.c.d

const obj3 = {
  q: 1,
  w: 2,
  e: {
    d: 3,
  },
}

function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  const proxy = new Proxy(obj3, {
    get(target, key) {
      console.log('读取', key)
      const result = Reflect.get(target, key)
      return isObject(result) ? reactive(result) : result
    },

    set(target, key, val) {
      console.log('修改', key)
      if (val === target[key]) {
        return true
      }
      const result = Reflect.set(target, key, val)
      return result
    },
  })
  return proxy
}

const proxy = reactive(obj3)
proxy.q
proxy.w = 123
proxy.e.d

const obj4 = {
  a: 1,
  b: 2,
  c: {
    d: 3,
  },
}

const result = Reflect.get(obj4, 'a')
console.log('🤩 result:', result)
</script>

<template></template>

<style scoped></style>

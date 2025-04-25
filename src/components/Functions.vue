<script setup lang="ts">
// 防抖
function debounce(fn, wait) {
  let timer = null

  return function () {
    let context = this,
      args = arguments

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

function handleClick() {
  console.log('🤩  handleClick:', '防抖')
}
// 创建防抖版本的函数
const debounceClick = debounce(handleClick, 1000)

// 节流
function throttle(fn, wait) {
  let previous = 0
  return function () {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}
function handleClick1() {
  console.log('🤩  handleClick1:', '节流')
}
// 创建节流版本的函数
const throttleClick = throttle(handleClick1, 2000)

// 变量提升
// 1. 如果有 var 关键字，在这个作用域下面的所有定义var关键字，会产生变量提升，要用话别在声明前使用
// 2. let 不会有变量提升
var x = 10
function test() {
  console.log(x) // undefined
  // console.log(y)  // 报错ReferenceError: Cannot access 'y' before initialization
  var x = 5
  let y = 6
}
test()

// 深拷贝
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let result
  if (Array.isArray(obj)) {
    result = []
  } else {
    result = {}
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  return result
}
const obj = deepClone({
  name: '张三',
  age: 18,
})
console.log(obj)

const obj1 = JSON.parse(
  JSON.stringify({
    name: '张三',
    age: 18,
  }),
)
console.log(obj1)

// 浅拷贝
const obj2 = { name: '李四', age: 18 }
const obj3 = Object.assign({}, obj2)
const obj4 = { ...obj2 }
console.log('🤩 obj3:', obj3)
console.log('🤩 obj4:', obj4)
</script>

<template>
  <div>
    <button @click="debounceClick">防抖</button
    ><button @click="throttleClick">节流</button>
  </div>
</template>

<style scoped></style>

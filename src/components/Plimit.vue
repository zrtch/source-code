<script setup lang="ts">
import pLimit from 'p-limit'

// 模拟异步请求函数
const fetchSomething = (param: string): Promise<string> => {
  return new Promise((resolve) => {
    console.log(`开始请求: ${param}`)
    setTimeout(() => {
      console.log(`请求完成: ${param}`)
      resolve(`${param} 的结果`)
    }, 2000) // 模拟网络延迟
  })
}

// 模拟其他异步操作
const doSomething = (): Promise<string> => {
  return new Promise((resolve) => {
    console.log('开始执行其他操作')
    setTimeout(() => {
      console.log('其他操作完成')
      resolve('操作结果')
    }, 1500)
  })
}

// 创建限制器，一次只允许执行1个并发请求
const limit = pLimit(1)

// 创建一个按钮点击事件处理函数
const runTasks = async () => {
  console.log('开始执行所有任务')

  const input = [
    limit(() => fetchSomething('并发1-0')),
    limit(() => fetchSomething('并发1-1')),
    limit(() => doSomething()),
  ]

  // 只有一个 promise 会同时运行
  const result = await Promise.all(input)
  console.log('所有任务完成，结果:', result)
}

// 创建一个并发限制为2的限制器
const limit2 = pLimit(2)

// 并发度为2的任务执行
const runTasksWithHigherConcurrency = async () => {
  console.log('开始执行并发度为2的任务')

  const input = [
    limit2(() => fetchSomething('任务1')),
    limit2(() => fetchSomething('任务2')),
    limit2(() => fetchSomething('任务3')),
    limit2(() => fetchSomething('任务4')),
    limit2(() => doSomething()),
  ]

  const result = await Promise.all(input)
  console.log('并发度为2的任务完成，结果:', result)
}
</script>

<template>
  <div class="p-limit-demo">
    <h2>p-limit 并发控制演示</h2>
    <div class="buttons">
      <button @click="runTasks">运行并发度为1的任务</button>
      <button @click="runTasksWithHigherConcurrency">
        运行并发度为2的任务
      </button>
    </div>
  </div>
</template>

<style scoped>
.p-limit-demo {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>

<template>
  <div class="debounce-demo">
    <div class="input-area">
      <input
        type="text"
        v-model="inputValue"
        @input="handleInput"
        placeholder="请输入内容"
      />
      <span class="count">防抖触发次数: {{ triggerCount }}</span>
    </div>
    <div class="button-group">
      <button @click="cancelDebounce">取消防抖</button>
      <button @click="resetDebounce">重置防抖</button>
    </div>
    <div class="result">最终结果: {{ debouncedValue }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const inputValue = ref('')
    const debouncedValue = ref('')
    const triggerCount = ref(0)
    let debounceTimer: NodeJS.Timeout | null = null

    // 通用防抖函数
    const debounce = (fn: Function, delay: number = 2000) => {
      return (...args: any[]) => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          fn.apply(null, args)
        }, delay)
      }
    }

    // 处理输入的防抖函数
    const debouncedUpdate = debounce((value: string) => {
      debouncedValue.value = value
      triggerCount.value++
    })

    // 输入处理
    const handleInput = () => {
      debouncedUpdate(inputValue.value)
    }

    // 取消防抖
    const cancelDebounce = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
    }

    // 重置防抖
    const resetDebounce = () => {
      cancelDebounce()
      inputValue.value = ''
      debouncedValue.value = ''
      triggerCount.value = 0
    }

    return {
      inputValue,
      debouncedValue,
      triggerCount,
      handleInput,
      cancelDebounce,
      resetDebounce,
    }
  },
})
</script>

<style scoped>
.debounce-demo {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.input-area {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  padding: 8px;
  width: 200px;
  font-size: 16px;
}

.count {
  color: #666;
}

.button-group {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.result {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>

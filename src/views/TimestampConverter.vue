<template>
  <div class="converter">
    <h2>⏰ 时间戳转换工具</h2>
    <div class="converter-container">
      <div class="input-section">
        <label>输入时间戳或日期：</label>
        <input 
          type="text" 
          v-model="inputValue" 
          placeholder="输入Unix时间戳或日期 (YYYY-MM-DD HH:mm:ss)"
          @input="convertInput"
        >
      </div>

      <div class="result-section">
        <div class="result-item">
          <label>本地时间：</label>
          <input type="text" :value="localTime" readonly>
        </div>
        <div class="result-item">
          <label>UTC时间：</label>
          <input type="text" :value="utcTime" readonly>
        </div>
        <div class="result-item">
          <label>Unix时间戳：</label>
          <input type="text" :value="unixTimestamp" readonly>
        </div>
      </div>

      <div class="actions">
        <button @click="setCurrentTime">设为当前时间</button>
        <button @click="clearAll">清空</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimestampConverter',
  data() {
    return {
      inputValue: '',
      localTime: '',
      utcTime: '',
      unixTimestamp: ''
    }
  },
  methods: {
    convertInput() {
      if (!this.inputValue) {
        this.clearResults();
        return;
      }

      let dateObj;

      // 检查是否为时间戳
      if (/^\d+$/.test(this.inputValue)) {
        // Unix时间戳
        const timestamp = parseInt(this.inputValue);
        dateObj = new Date(timestamp * 1000); // 秒级时间戳
      } else {
        // 尝试解析日期字符串
        dateObj = new Date(this.inputValue);
      }

      if (isNaN(dateObj.getTime())) {
        this.clearResults();
        return;
      }

      this.updateResults(dateObj);
    },
    updateResults(dateObj) {
      // 本地时间
      this.localTime = dateObj.toLocaleString();

      // UTC时间
      this.utcTime = dateObj.toISOString().replace('T', ' ').substring(0, 19);

      // Unix时间戳
      this.unixTimestamp = Math.floor(dateObj.getTime() / 1000).toString();
    },
    setCurrentTime() {
      const now = new Date();
      this.inputValue = Math.floor(now.getTime() / 1000).toString(); // 设置为Unix时间戳
      this.updateResults(now);
    },
    clearAll() {
      this.inputValue = '';
      this.clearResults();
    },
    clearResults() {
      this.localTime = '';
      this.utcTime = '';
      this.unixTimestamp = '';
    }
  }
}
</script>

<style scoped>
.converter {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.converter-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-section input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.result-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  flex-direction: column;
}

.result-item label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.result-item input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #359c6d;
}
</style>
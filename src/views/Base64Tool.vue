<template>
  <div class="converter">
    <h2>🔓 Base64编码解码工具</h2>
    <div class="converter-container">
      <div class="input-section">
        <label>输入文本：</label>
        <textarea 
          v-model="inputText" 
          placeholder="输入要编码或解码的文本"
          @input="convertText"
        ></textarea>
      </div>

      <div class="result-section">
        <div class="result-item">
          <label>Base64编码结果：</label>
          <textarea :value="encodedText" readonly></textarea>
          <button @click="copyEncoded" class="copy-btn">复制</button>
        </div>
        <div class="result-item">
          <label>Base64解码结果：</label>
          <textarea :value="decodedText" readonly></textarea>
          <button @click="copyDecoded" class="copy-btn">复制</button>
        </div>
      </div>

      <div class="actions">
        <button @click="encodeText">手动编码</button>
        <button @click="decodeText">手动解码</button>
        <button @click="clearAll">清空</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Base64Tool',
  data() {
    return {
      inputText: '',
      encodedText: '',
      decodedText: ''
    }
  },
  methods: {
    convertText() {
      if (!this.inputText) {
        this.encodedText = '';
        this.decodedText = '';
        return;
      }

      // 编码
      this.encodedText = this.encodeBase64(this.inputText);

      // 尝试解码输入的文本
      try {
        this.decodedText = this.decodeBase64(this.inputText);
      } catch (e) {
        this.decodedText = '无法解码为有效文本';
      }
    },
    encodeText() {
      if (!this.inputText) {
        this.encodedText = '';
        return;
      }
      this.encodedText = this.encodeBase64(this.inputText);
    },
    decodeText() {
      if (!this.inputText) {
        this.decodedText = '';
        return;
      }
      try {
        this.decodedText = this.decodeBase64(this.inputText);
      } catch (e) {
        this.decodedText = '无法解码为有效文本';
      }
    },
    encodeBase64(text) {
      // 使用浏览器内置的btoa函数，但需要处理Unicode字符
      return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
    },
    decodeBase64(encodedText) {
      // 使用浏览器内置的atob函数，但需要处理Unicode字符
      return decodeURIComponent(atob(encodedText).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    copyEncoded() {
      navigator.clipboard.writeText(this.encodedText).then(() => {
        alert('编码结果已复制到剪贴板');
      });
    },
    copyDecoded() {
      navigator.clipboard.writeText(this.decodedText).then(() => {
        alert('解码结果已复制到剪贴板');
      });
    },
    clearAll() {
      this.inputText = '';
      this.encodedText = '';
      this.decodedText = '';
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

.input-section textarea {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.result-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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

.result-item textarea {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  resize: vertical;
}

.result-item .copy-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.3rem 0.8rem;
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.result-item .copy-btn:hover {
  background-color: #2c3e50;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
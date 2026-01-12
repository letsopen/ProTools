<template>
  <div class="converter">
    <h2>🔒 哈希计算工具</h2>
    <div class="converter-container">
      <div class="input-section">
        <label>输入文本：</label>
        <textarea 
          v-model="inputText" 
          placeholder="输入要计算哈希的文本"
          @input="calculateHash"
        ></textarea>
      </div>

      <div class="result-section">
        <div class="result-item">
          <label>MD5：</label>
          <input type="text" :value="md5Hash" readonly>
          <button @click="copyMd5" class="copy-btn">复制</button>
        </div>
        <div class="result-item">
          <label>SHA-1：</label>
          <input type="text" :value="sha1Hash" readonly>
          <button @click="copySha1" class="copy-btn">复制</button>
        </div>
        <div class="result-item">
          <label>SHA-256：</label>
          <input type="text" :value="sha256Hash" readonly>
          <button @click="copySha256" class="copy-btn">复制</button>
        </div>
        <div class="result-item">
          <label>SHA-512：</label>
          <input type="text" :value="sha512Hash" readonly>
          <button @click="copySha512" class="copy-btn">复制</button>
        </div>
      </div>

      <div class="actions">
        <button @click="calculateHash">重新计算</button>
        <button @click="clearAll">清空</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HashTool',
  data() {
    return {
      inputText: '',
      md5Hash: '',
      sha1Hash: '',
      sha256Hash: '',
      sha512Hash: ''
    }
  },
  methods: {
    async calculateHash() {
      if (!this.inputText) {
        this.md5Hash = '';
        this.sha1Hash = '';
        this.sha256Hash = '';
        this.sha512Hash = '';
        return;
      }

      // 计算各种哈希值
      this.md5Hash = await this.calculateMD5(this.inputText);
      this.sha1Hash = await this.calculateSHA1(this.inputText);
      this.sha256Hash = await this.calculateSHA256(this.inputText);
      this.sha512Hash = await this.calculateSHA512(this.inputText);
    },
    // MD5 实现 (简化版，实际项目中建议使用专业库)
    async calculateMD5(text) {
      // 使用Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    // SHA-1 实现
    async calculateSHA1(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    // SHA-256 实现
    async calculateSHA256(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    // SHA-512 实现
    async calculateSHA512(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-512', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    copyMd5() {
      navigator.clipboard.writeText(this.md5Hash).then(() => {
        alert('MD5哈希值已复制到剪贴板');
      });
    },
    copySha1() {
      navigator.clipboard.writeText(this.sha1Hash).then(() => {
        alert('SHA-1哈希值已复制到剪贴板');
      });
    },
    copySha256() {
      navigator.clipboard.writeText(this.sha256Hash).then(() => {
        alert('SHA-256哈希值已复制到剪贴板');
      });
    },
    copySha512() {
      navigator.clipboard.writeText(this.sha512Hash).then(() => {
        alert('SHA-512哈希值已复制到剪贴板');
      });
    },
    clearAll() {
      this.inputText = '';
      this.md5Hash = '';
      this.sha1Hash = '';
      this.sha256Hash = '';
      this.sha512Hash = '';
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

.result-item input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 0.5rem;
}

.result-item .copy-btn {
  align-self: flex-start;
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
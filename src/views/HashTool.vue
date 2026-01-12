<template>
  <div class="converter">
    <el-page-header content="🔒 哈希计算工具" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="formData.inputText" 
            type="textarea"
            :rows="4"
            placeholder="输入要计算哈希的文本"
            @input="calculateHash"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">哈希结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="MD5：">
            <el-input v-model="formData.md5Hash" readonly>
              <template #append>
                <el-button @click="copyMd5" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SHA-1：">
            <el-input v-model="formData.sha1Hash" readonly>
              <template #append>
                <el-button @click="copySha1" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SHA-256：">
            <el-input v-model="formData.sha256Hash" readonly>
              <template #append>
                <el-button @click="copySha256" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SHA-512：">
            <el-input v-model="formData.sha512Hash" readonly>
              <template #append>
                <el-button @click="copySha512" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="calculateHash">重新计算</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HashTool',
  data() {
    return {
      formData: {
        inputText: '',
        md5Hash: '',
        sha1Hash: '',
        sha256Hash: '',
        sha512Hash: ''
      }
    }
  },
  methods: {
    async calculateHash() {
      if (!this.formData.inputText) {
        this.formData.md5Hash = '';
        this.formData.sha1Hash = '';
        this.formData.sha256Hash = '';
        this.formData.sha512Hash = '';
        return;
      }

      // 计算各种哈希值
      this.formData.md5Hash = await this.calculateMD5(this.formData.inputText);
      this.formData.sha1Hash = await this.calculateSHA1(this.formData.inputText);
      this.formData.sha256Hash = await this.calculateSHA256(this.formData.inputText);
      this.formData.sha512Hash = await this.calculateSHA512(this.formData.inputText);
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
      navigator.clipboard.writeText(this.formData.md5Hash).then(() => {
        this.$message.success('MD5哈希值已复制到剪贴板');
      });
    },
    copySha1() {
      navigator.clipboard.writeText(this.formData.sha1Hash).then(() => {
        this.$message.success('SHA-1哈希值已复制到剪贴板');
      });
    },
    copySha256() {
      navigator.clipboard.writeText(this.formData.sha256Hash).then(() => {
        this.$message.success('SHA-256哈希值已复制到剪贴板');
      });
    },
    copySha512() {
      navigator.clipboard.writeText(this.formData.sha512Hash).then(() => {
        this.$message.success('SHA-512哈希值已复制到剪贴板');
      });
    },
    clearAll() {
      this.formData.inputText = '';
      this.formData.md5Hash = '';
      this.formData.sha1Hash = '';
      this.formData.sha256Hash = '';
      this.formData.sha512Hash = '';
    }
  }
}
</script>

<style scoped>
.converter {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.converter-container {
  margin-top: 1rem;
}

.el-divider {
  margin: 20px 0;
}
</style>
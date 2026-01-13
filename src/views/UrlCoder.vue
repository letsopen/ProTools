<template>
  <div class="converter">
    <el-page-header title="返回" content="🌐 URL编码解码工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="formData.inputText" 
            type="textarea"
            :rows="4"
            placeholder="输入要编码或解码的URL/文本"
            @input="convertText"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="URL编码结果：">
            <el-input 
              v-model="formData.encodedText" 
              type="textarea"
              :rows="4"
              readonly 
            />
            <el-button @click="copyEncoded" size="small" style="margin-top: 10px;">复制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="URL解码结果：">
            <el-input 
              v-model="formData.decodedText" 
              type="textarea"
              :rows="4"
              readonly 
            />
            <el-button @click="copyDecoded" size="small" style="margin-top: 10px;">复制</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="encodeText">URL编码</el-button>
        <el-button @click="decodeText">URL解码</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UrlCoder',
  data() {
    return {
      formData: {
        inputText: '',
        encodedText: '',
        decodedText: ''
      }
    }
  },
  methods: {
    convertText() {
      if (!this.formData.inputText) {
        this.formData.encodedText = '';
        this.formData.decodedText = '';
        return;
      }

      // 编码
      this.formData.encodedText = encodeURIComponent(this.formData.inputText);
      
      // 解码
      try {
        this.formData.decodedText = decodeURIComponent(this.formData.inputText);
      } catch (e) {
        this.formData.decodedText = '无法解码 - 可能不是有效的URL编码';
      }
    },
    encodeText() {
      if (!this.formData.inputText) {
        this.formData.encodedText = '';
        return;
      }
      this.formData.encodedText = encodeURIComponent(this.formData.inputText);
    },
    decodeText() {
      if (!this.formData.inputText) {
        this.formData.decodedText = '';
        return;
      }
      try {
        this.formData.decodedText = decodeURIComponent(this.formData.inputText);
      } catch (e) {
        this.formData.decodedText = '无法解码 - 可能不是有效的URL编码';
      }
    },
    copyEncoded() {
      if (this.formData.encodedText) {
        navigator.clipboard.writeText(this.formData.encodedText).then(() => {
          this.$message.success('URL编码结果已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    copyDecoded() {
      if (this.formData.decodedText) {
        navigator.clipboard.writeText(this.formData.decodedText).then(() => {
          this.$message.success('URL解码结果已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    clearAll() {
      this.formData.inputText = '';
      this.formData.encodedText = '';
      this.formData.decodedText = '';
    }
  }
}
</script>

<style scoped>
.converter {
  max-width: 1200px;
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
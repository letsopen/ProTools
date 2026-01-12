<template>
  <div class="converter">
    <el-page-header title="返回" content="🔓 Base64编码解码工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="formData.inputText" 
            type="textarea"
            :rows="4"
            placeholder="输入要编码或解码的文本"
            @input="convertText"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Base64编码结果：">
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
          <el-form-item label="Base64解码结果：">
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
        <el-button @click="encodeText">手动编码</el-button>
        <el-button @click="decodeText">手动解码</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Base64Tool',
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
      this.formData.encodedText = this.encodeBase64(this.formData.inputText);

      // 尝试解码输入的文本
      try {
        this.formData.decodedText = this.decodeBase64(this.formData.inputText);
      } catch (e) {
        this.formData.decodedText = '无法解码为有效文本';
      }
    },
    encodeText() {
      if (!this.formData.inputText) {
        this.formData.encodedText = '';
        return;
      }
      this.formData.encodedText = this.encodeBase64(this.formData.inputText);
    },
    decodeText() {
      if (!this.formData.inputText) {
        this.formData.decodedText = '';
        return;
      }
      try {
        this.formData.decodedText = this.decodeBase64(this.formData.inputText);
      } catch (e) {
        this.formData.decodedText = '无法解码为有效文本';
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
      navigator.clipboard.writeText(this.formData.encodedText).then(() => {
        this.$message.success('编码结果已复制到剪贴板');
      });
    },
    copyDecoded() {
      navigator.clipboard.writeText(this.formData.decodedText).then(() => {
        this.$message.success('解码结果已复制到剪贴板');
      });
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
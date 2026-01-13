<template>
  <div class="converter">
    <el-page-header title="返回" content="📝 文本处理工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="formData.inputText" 
            type="textarea"
            :rows="6"
            placeholder="输入要处理的文本"
            @input="processText"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">处理选项</el-divider>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-checkbox v-model="formData.uppercase" @change="processText">转大写</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.lowercase" @change="processText">转小写</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.capitalize" @change="processText">首字母大写</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.reverse" @change="processText">反转文本</el-checkbox>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="6">
          <el-checkbox v-model="formData.removeSpaces" @change="processText">移除空格</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.removeEmptyLines" @change="processText">移除空行</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.sortLines" @change="processText">排序行</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="formData.uniqueLines" @change="processText">去重行</el-checkbox>
        </el-col>
      </el-row>

      <el-divider content-position="left">处理结果</el-divider>

      <el-form-item label="输出文本：">
        <el-input 
          v-model="formData.outputText" 
          type="textarea"
          :rows="6"
          readonly 
        />
        <el-button @click="copyOutput" size="small" style="margin-top: 10px;">复制结果</el-button>
      </el-form-item>

      <el-divider />

      <div class="stats">
        <el-tag type="info">字符数: {{ formData.inputText.length }}</el-tag>
        <el-tag type="info" style="margin-left: 10px;">单词数: {{ wordCount }}</el-tag>
        <el-tag type="info" style="margin-left: 10px;">行数: {{ lineCount }}</el-tag>
      </div>

      <el-divider />

      <el-button-group>
        <el-button @click="clearAll">清空</el-button>
        <el-button @click="swapText">交换输入输出</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TextUtils',
  data() {
    return {
      formData: {
        inputText: '',
        outputText: '',
        uppercase: false,
        lowercase: false,
        capitalize: false,
        reverse: false,
        removeSpaces: false,
        removeEmptyLines: false,
        sortLines: false,
        uniqueLines: false
      }
    }
  },
  computed: {
    wordCount() {
      return this.formData.inputText.trim() ? this.formData.inputText.trim().split(/\s+/).length : 0;
    },
    lineCount() {
      return this.formData.inputText ? this.formData.inputText.split('\n').length : 0;
    }
  },
  methods: {
    processText() {
      let text = this.formData.inputText;
      
      if (!text) {
        this.formData.outputText = '';
        return;
      }
      
      // 应用各种处理选项
      if (this.formData.uppercase) {
        text = text.toUpperCase();
      }
      if (this.formData.lowercase) {
        text = text.toLowerCase();
      }
      if (this.formData.capitalize) {
        text = text.replace(/\b\w/g, l => l.toUpperCase());
      }
      if (this.formData.reverse) {
        text = text.split('').reverse().join('');
      }
      if (this.formData.removeSpaces) {
        text = text.replace(/\s+/g, '');
      }
      if (this.formData.removeEmptyLines) {
        text = text.split('\n').filter(line => line.trim() !== '').join('\n');
      }
      
      // 按行处理
      if (this.formData.sortLines || this.formData.uniqueLines) {
        let lines = text.split('\n');
        
        if (this.formData.uniqueLines) {
          lines = [...new Set(lines)];
        }
        
        if (this.formData.sortLines) {
          lines.sort();
        }
        
        text = lines.join('\n');
      }
      
      this.formData.outputText = text;
    },
    copyOutput() {
      if (this.formData.outputText) {
        navigator.clipboard.writeText(this.formData.outputText).then(() => {
          this.$message.success('处理结果已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    swapText() {
      const temp = this.formData.inputText;
      this.formData.inputText = this.formData.outputText;
      this.formData.outputText = temp;
      this.processText();
    },
    clearAll() {
      this.formData.inputText = '';
      this.formData.outputText = '';
      this.formData.uppercase = false;
      this.formData.lowercase = false;
      this.formData.capitalize = false;
      this.formData.reverse = false;
      this.formData.removeSpaces = false;
      this.formData.removeEmptyLines = false;
      this.formData.sortLines = false;
      this.formData.uniqueLines = false;
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

.stats {
  margin: 15px 0;
}
</style>
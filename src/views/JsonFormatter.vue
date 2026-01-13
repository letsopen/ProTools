<template>
  <div class="converter">
    <el-page-header title="返回" content=".JSON格式化工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入JSON：">
          <el-input 
            v-model="formData.inputJson" 
            type="textarea"
            :rows="6"
            placeholder="输入要格式化的JSON数据"
            @input="formatJson"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">格式化结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="格式化后的JSON：">
            <el-input 
              v-model="formData.formattedJson" 
              type="textarea"
              :rows="6"
              readonly 
            />
            <el-button @click="copyFormatted" size="small" style="margin-top: 10px;">复制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验证结果：">
            <el-input 
              v-model="formData.validationResult" 
              type="textarea"
              :rows="6"
              readonly 
              :class="validationTypeClass"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="formatJson">格式化</el-button>
        <el-button @click="minifyJson">压缩</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JsonFormatter',
  data() {
    return {
      formData: {
        inputJson: '',
        formattedJson: '',
        validationResult: '请输入JSON数据进行验证',
        validationType: 'info'
      }
    }
  },
  computed: {
    validationTypeClass() {
      return `el-input--${this.formData.validationType}`;
    }
  },
  methods: {
    formatJson() {
      if (!this.formData.inputJson) {
        this.formData.formattedJson = '';
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        return;
      }

      try {
        const parsed = JSON.parse(this.formData.inputJson);
        this.formData.formattedJson = JSON.stringify(parsed, null, 2);
        this.formData.validationResult = '✓ JSON格式正确';
        this.formData.validationType = 'success';
      } catch (e) {
        this.formData.formattedJson = '';
        this.formData.validationResult = `✗ JSON格式错误: ${e.message}`;
        this.formData.validationType = 'error';
      }
    },
    minifyJson() {
      if (!this.formData.inputJson) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        return;
      }

      try {
        const parsed = JSON.parse(this.formData.inputJson);
        this.formData.formattedJson = JSON.stringify(parsed);
        this.formData.validationResult = '✓ JSON压缩成功';
        this.formData.validationType = 'success';
      } catch (e) {
        this.formData.formattedJson = '';
        this.formData.validationResult = `✗ JSON格式错误: ${e.message}`;
        this.formData.validationType = 'error';
      }
    },
    copyFormatted() {
      if (this.formData.formattedJson) {
        navigator.clipboard.writeText(this.formData.formattedJson).then(() => {
          this.$message.success('格式化结果已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    clearAll() {
      this.formData.inputJson = '';
      this.formData.formattedJson = '';
      this.formData.validationResult = '请输入JSON数据进行验证';
      this.formData.validationType = 'info';
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
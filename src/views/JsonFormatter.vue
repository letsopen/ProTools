<template>
  <div class="converter">
    <el-page-header title="返回" content="JSON格式化工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="JSON数据：">
          <el-input 
            v-model="formData.jsonData" 
            type="textarea"
            :rows="15"
            placeholder="在此输入JSON数据，可进行格式化、压缩、转义、去转义等操作"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">操作结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="验证结果：">
            <el-input 
              v-model="formData.validationResult" 
              type="textarea"
              :rows="3"
              readonly 
              :class="validationTypeClass"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字符统计：">
            <el-input 
              v-model="formData.charCount" 
              type="textarea"
              :rows="3"
              readonly 
              placeholder="字符统计信息"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="validateJson">验证JSON</el-button>
        <el-button @click="formatJson">格式化</el-button>
        <el-button @click="minifyJson">压缩</el-button>
        <el-button @click="escapeJson">转义</el-button>
        <el-button @click="unescapeJson">去转义</el-button>
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
        jsonData: '',
        validationResult: '请输入JSON数据进行验证',
        validationType: 'info',
        charCount: '字符数: 0 | 行数: 0 | 是否为有效JSON: 否'
      }
    }
  },
  computed: {
    validationTypeClass() {
      const typeMap = {
        'success': 'is-success',
        'error': 'is-error',
        'info': 'is-info',
        'warning': 'is-warning'
      };
      return typeMap[this.formData.validationType] || 'is-info';
    }
  },
  methods: {
    validateJson() {
      if (!this.formData.jsonData) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        this.updateCharCount();
        return;
      }

      try {
        JSON.parse(this.formData.jsonData);
        this.formData.validationResult = '✓ JSON格式正确';
        this.formData.validationType = 'success';
      } catch (e) {
        this.formData.validationResult = `✗ JSON格式错误: ${e.message}`;
        this.formData.validationType = 'error';
      }
      
      this.updateCharCount();
    },
    
    formatJson() {
      if (!this.formData.jsonData) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        this.updateCharCount();
        return;
      }

      try {
        const parsed = JSON.parse(this.formData.jsonData);
        this.formData.jsonData = JSON.stringify(parsed, null, 2);
        this.formData.validationResult = '✓ JSON格式化成功';
        this.formData.validationType = 'success';
      } catch (e) {
        this.formData.validationResult = `✗ JSON格式错误: ${e.message}`;
        this.formData.validationType = 'error';
      }
      
      this.updateCharCount();
    },
    
    minifyJson() {
      if (!this.formData.jsonData) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        this.updateCharCount();
        return;
      }

      try {
        const parsed = JSON.parse(this.formData.jsonData);
        this.formData.jsonData = JSON.stringify(parsed);
        this.formData.validationResult = '✓ JSON压缩成功';
        this.formData.validationType = 'success';
      } catch (e) {
        this.formData.validationResult = `✗ JSON格式错误: ${e.message}`;
        this.formData.validationType = 'error';
      }
      
      this.updateCharCount();
    },
    
    escapeJson() {
      if (!this.formData.jsonData) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        this.updateCharCount();
        return;
      }
      
      try {
        // 验证是否为有效JSON
        JSON.parse(this.formData.jsonData);
        
        // 转义字符串
        this.formData.jsonData = JSON.stringify(this.formData.jsonData);
        this.formData.validationResult = '✓ JSON转义成功';
        this.formData.validationType = 'success';
      } catch (e) {
        // 如果不是有效JSON，尝试转义字符串内容
        try {
          this.formData.jsonData = JSON.stringify(this.formData.jsonData);
          this.formData.validationResult = '✓ 内容转义成功';
          this.formData.validationType = 'success';
        } catch (e2) {
          this.formData.validationResult = `✗ 转义失败: ${e2.message}`;
          this.formData.validationType = 'error';
        }
      }
      
      this.updateCharCount();
    },
    
    unescapeJson() {
      if (!this.formData.jsonData) {
        this.formData.validationResult = '请输入JSON数据';
        this.formData.validationType = 'info';
        this.updateCharCount();
        return;
      }
      
      try {
        // 尝试解析转义的JSON字符串
        const unescaped = JSON.parse(this.formData.jsonData);
        
        // 如果解析成功，检查结果是否为字符串
        if (typeof unescaped === 'string') {
          this.formData.jsonData = unescaped;
          this.formData.validationResult = '✓ JSON去转义成功';
          this.formData.validationType = 'success';
        } else {
          // 如果解析结果不是字符串，说明原内容不是转义的字符串
          this.formData.validationResult = '⚠ 原内容不是转义的字符串';
          this.formData.validationType = 'warning';
        }
      } catch (e) {
        this.formData.validationResult = `✗ 去转义失败: ${e.message}`;
        this.formData.validationType = 'error';
      }
      
      this.updateCharCount();
    },
    
    updateCharCount() {
      const text = this.formData.jsonData || '';
      const lines = text.split('\n').length;
      let isValidJson = false;
      
      if (text) {
        try {
          JSON.parse(text);
          isValidJson = true;
        } catch (e) {
          isValidJson = false;
        }
      }
      
      this.formData.charCount = `字符数: ${text.length} | 行数: ${lines} | 是否为有效JSON: ${isValidJson ? '是' : '否'}`;
    },
    
    clearAll() {
      this.formData.jsonData = '';
      this.formData.validationResult = '请输入JSON数据进行验证';
      this.formData.validationType = 'info';
      this.formData.charCount = '字符数: 0 | 行数: 0 | 是否为有效JSON: 否';
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
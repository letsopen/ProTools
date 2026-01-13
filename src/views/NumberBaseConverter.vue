<template>
  <div class="converter">
    <el-page-header title="返回" content="🔢 进制转换器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入数字：">
          <el-input 
            v-model="formData.inputNumber" 
            placeholder="输入要转换的数字"
            @input="convertNumber"
            clearable
          />
        </el-form-item>
        <el-form-item label="原进制：">
          <el-select 
            v-model="formData.fromBase" 
            placeholder="选择原进制"
            @change="convertNumber"
            style="width: 100%"
          >
            <el-option label="二进制 (2)" value="2" />
            <el-option label="八进制 (8)" value="8" />
            <el-option label="十进制 (10)" value="10" />
            <el-option label="十六进制 (16)" value="16" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="二进制 (2)：">
            <el-input v-model="formData.binary" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="八进制 (8)：">
            <el-input v-model="formData.octal" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="十进制 (10)：">
            <el-input v-model="formData.decimal" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="十六进制 (16)：">
            <el-input v-model="formData.hexadecimal" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button @click="clearAll">清空</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NumberBaseConverter',
  data() {
    return {
      formData: {
        inputNumber: '',
        fromBase: '10',
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: ''
      }
    }
  },
  methods: {
    convertNumber() {
      if (!this.formData.inputNumber) {
        this.clearResults();
        return;
      }

      let decimalValue;

      try {
        // 将输入的数字从原进制转换为十进制
        decimalValue = parseInt(this.formData.inputNumber, parseInt(this.formData.fromBase));
        
        if (isNaN(decimalValue)) {
          this.clearResults();
          return;
        }

        // 转换为各种进制
        this.formData.binary = decimalValue.toString(2);
        this.formData.octal = decimalValue.toString(8);
        this.formData.decimal = decimalValue.toString(10);
        this.formData.hexadecimal = decimalValue.toString(16).toUpperCase();
      } catch (e) {
        this.clearResults();
      }
    },
    clearResults() {
      this.formData.binary = '';
      this.formData.octal = '';
      this.formData.decimal = '';
      this.formData.hexadecimal = '';
    },
    clearAll() {
      this.formData.inputNumber = '';
      this.formData.fromBase = '10';
      this.clearResults();
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
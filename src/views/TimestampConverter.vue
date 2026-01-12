<template>
  <div class="converter">
    <el-page-header content="⏰ 时间戳转换工具" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入时间戳或日期：">
          <el-input 
            v-model="formData.inputValue" 
            placeholder="输入Unix时间戳或日期 (YYYY-MM-DD HH:mm:ss)"
            @input="convertInput"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="本地时间：">
            <el-input v-model="formData.localTime" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="UTC时间：">
            <el-input v-model="formData.utcTime" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Unix时间戳：">
            <el-input v-model="formData.unixTimestamp" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="setCurrentTime">设为当前时间</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TimestampConverter',
  data() {
    return {
      formData: {
        inputValue: '',
        localTime: '',
        utcTime: '',
        unixTimestamp: ''
      }
    }
  },
  methods: {
    convertInput() {
      if (!this.formData.inputValue) {
        this.clearResults();
        return;
      }

      let dateObj;

      // 检查是否为时间戳
      if (/^\d+$/.test(this.formData.inputValue)) {
        // Unix时间戳
        const timestamp = parseInt(this.formData.inputValue);
        dateObj = new Date(timestamp * 1000); // 秒级时间戳
      } else {
        // 尝试解析日期字符串
        dateObj = new Date(this.formData.inputValue);
      }

      if (isNaN(dateObj.getTime())) {
        this.clearResults();
        return;
      }

      this.updateResults(dateObj);
    },
    updateResults(dateObj) {
      // 本地时间
      this.formData.localTime = dateObj.toLocaleString();

      // UTC时间
      this.formData.utcTime = dateObj.toISOString().replace('T', ' ').substring(0, 19);

      // Unix时间戳
      this.formData.unixTimestamp = Math.floor(dateObj.getTime() / 1000).toString();
    },
    setCurrentTime() {
      const now = new Date();
      this.formData.inputValue = Math.floor(now.getTime() / 1000).toString(); // 设置为Unix时间戳
      this.updateResults(now);
    },
    clearAll() {
      this.formData.inputValue = '';
      this.clearResults();
    },
    clearResults() {
      this.formData.localTime = '';
      this.formData.utcTime = '';
      this.formData.unixTimestamp = '';
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
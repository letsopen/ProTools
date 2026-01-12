<template>
  <div class="converter">
    <el-page-header content="🔢 数字大小写转换工具" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入数字：">
          <el-input 
            v-model="formData.inputValue" 
            placeholder="输入阿拉伯数字 (例如: 123456)"
            @input="convertNumbers"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="中文小写：">
            <el-input v-model="formData.chineseLowercase" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中文大写：">
            <el-input v-model="formData.chineseUppercase" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="罗马数字：">
            <el-input v-model="formData.romanNumerals" readonly />
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
  name: 'NumberConverter',
  data() {
    return {
      formData: {
        inputValue: '',
        chineseLowercase: '',
        chineseUppercase: '',
        romanNumerals: ''
      }
    }
  },
  methods: {
    convertNumbers() {
      if (!this.formData.inputValue) {
        this.clearResults();
        return;
      }

      const num = parseInt(this.formData.inputValue);
      if (isNaN(num) || num < 0 || num > 999999999) {
        this.clearResults();
        return;
      }

      this.formData.chineseLowercase = this.numberToChineseLowercase(num);
      this.formData.chineseUppercase = this.numberToChineseUppercase(num);
      this.formData.romanNumerals = this.numberToRoman(num);
    },
    numberToChineseLowercase(num) {
      const units = ['', '十', '百', '千'];
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

      if (num === 0) return '零';

      let result = '';
      const strNum = num.toString();
      const len = strNum.length;

      // 处理万位
      if (len > 4) {
        const wan = Math.floor(num / 10000);
        const remainder = num % 10000;
        
        result += this.convertSection(wan, digits, units) + '万';
        
        if (remainder > 0) {
          if (remainder < 1000 && Math.floor(num / 10000) % 10 > 0) {
            result += '零';
          }
          result += this.convertSection(remainder, digits, units);
        }
      } else {
        result = this.convertSection(num, digits, units);
      }

      // 处理特殊情况
      if (result.startsWith('一十')) {
        result = result.substring(1); // "一十五" -> "十五"
      }

      return result;
    },
    convertSection(num, digits, units) {
      if (num === 0) return '';

      let result = '';
      const strNum = num.toString();
      const len = strNum.length;

      for (let i = 0; i < len; i++) {
        const digit = parseInt(strNum[i]);
        if (digit !== 0) {
          result += digits[digit] + units[len - 1 - i];
        } else if (result && !result.endsWith('零')) {
          // 添加零，但避免连续的零
          const lastChar = result[result.length - 1];
          if (lastChar !== '零') {
            result += '零';
          }
        }
      }

      // 清理多余的零
      result = result.replace(/零+/g, '零');
      if (result.endsWith('零')) {
        result = result.slice(0, -1);
      }

      return result;
    },
    numberToChineseUppercase(num) {
      const units = ['', '拾', '佰', '仟'];
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

      if (num === 0) return '零';

      let result = '';
      const strNum = num.toString();
      const len = strNum.length;

      // 处理万位
      if (len > 4) {
        const wan = Math.floor(num / 10000);
        const remainder = num % 10000;
        
        result += this.convertSectionUppercase(wan, digits, units) + '万';
        
        if (remainder > 0) {
          if (remainder < 1000 && Math.floor(num / 10000) % 10 > 0) {
            result += '零';
          }
          result += this.convertSectionUppercase(remainder, digits, units);
        }
      } else {
        result = this.convertSectionUppercase(num, digits, units);
      }

      // 处理特殊情况
      if (result.startsWith('壹拾')) {
        result = result.substring(1); // "壹拾伍" -> "拾伍"
      }

      return result;
    },
    convertSectionUppercase(num, digits, units) {
      if (num === 0) return '';

      let result = '';
      const strNum = num.toString();
      const len = strNum.length;

      for (let i = 0; i < len; i++) {
        const digit = parseInt(strNum[i]);
        if (digit !== 0) {
          result += digits[digit] + units[len - 1 - i];
        } else if (result && !result.endsWith('零')) {
          const lastChar = result[result.length - 1];
          if (lastChar !== '零') {
            result += '零';
          }
        }
      }

      result = result.replace(/零+/g, '零');
      if (result.endsWith('零')) {
        result = result.slice(0, -1);
      }

      return result;
    },
    numberToRoman(num) {
      if (num <= 0 || num > 3999) return '';

      const thousands = ["", "M", "MM", "MMM"];
      const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
      const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
      const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

      return thousands[Math.floor(num / 1000)] +
             hundreds[Math.floor((num % 1000) / 100)] +
             tens[Math.floor((num % 100) / 10)] +
             ones[num % 10];
    },
    clearAll() {
      this.formData.inputValue = '';
      this.clearResults();
    },
    clearResults() {
      this.formData.chineseLowercase = '';
      this.formData.chineseUppercase = '';
      this.formData.romanNumerals = '';
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
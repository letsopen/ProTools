<template>
  <div class="converter">
    <h2>🔢 数字大小写转换工具</h2>
    <div class="converter-container">
      <div class="input-section">
        <label>输入数字：</label>
        <input 
          type="text" 
          v-model="inputValue" 
          placeholder="输入阿拉伯数字 (例如: 123456)"
          @input="convertNumbers"
        >
      </div>

      <div class="result-section">
        <div class="result-item">
          <label>中文小写：</label>
          <input type="text" :value="chineseLowercase" readonly>
        </div>
        <div class="result-item">
          <label>中文大写：</label>
          <input type="text" :value="chineseUppercase" readonly>
        </div>
        <div class="result-item">
          <label>罗马数字：</label>
          <input type="text" :value="romanNumerals" readonly>
        </div>
      </div>

      <div class="actions">
        <button @click="clearAll">清空</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberConverter',
  data() {
    return {
      inputValue: '',
      chineseLowercase: '',
      chineseUppercase: '',
      romanNumerals: ''
    }
  },
  methods: {
    convertNumbers() {
      if (!this.inputValue) {
        this.clearResults();
        return;
      }

      const num = parseInt(this.inputValue);
      if (isNaN(num) || num < 0 || num > 999999999) {
        this.clearResults();
        return;
      }

      this.chineseLowercase = this.numberToChineseLowercase(num);
      this.chineseUppercase = this.numberToChineseUppercase(num);
      this.romanNumerals = this.numberToRoman(num);
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
          if (remainder < 1000 && Math.floor(num / 10000) % 10 !== 0) {
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
      const strNum = num.toString().padStart(Math.ceil(num.toString().length), '0');
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
          if (remainder < 1000 && Math.floor(num / 10000) % 10 !== 0) {
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
      this.inputValue = '';
      this.clearResults();
    },
    clearResults() {
      this.chineseLowercase = '';
      this.chineseUppercase = '';
      this.romanNumerals = '';
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

.input-section input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.result-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
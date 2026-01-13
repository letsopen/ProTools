<template>
  <div class="converter">
    <el-page-header title="返回" content="💰 金额大小写转换工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入金额：">
          <el-input 
            v-model="formData.inputValue" 
            placeholder="输入阿拉伯数字金额 (例如: 1234.56 或 100)"
            @input="convertNumbers"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="中文大写金额：">
            <el-input v-model="formData.amountUppercase" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中文大写金额（带人民币符号）：">
            <el-input v-model="formData.amountUppercaseWithSymbol" readonly />
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
        amountUppercase: '',
        amountUppercaseWithSymbol: ''
      }
    }
  },
  methods: {
    convertNumbers() {
      if (!this.formData.inputValue) {
        this.clearResults();
        return;
      }
      
      // 验证输入是否为有效的数字金额
      const numStr = this.formData.inputValue.trim();
      
      // 使用正则表达式验证金额格式（最多两位小数）
      if (!/^\d+(\.\d{1,2})?$/.test(numStr)) {
        this.clearResults();
        this.$message.error('请输入有效的金额格式（最多两位小数）');
        return;
      }
      
      const num = parseFloat(numStr);
      
      if (isNaN(num) || num < 0 || num > 999999999999.99) { // 最大支持9999亿
        this.clearResults();
        this.$message.error('金额超出范围（0 - 999999999999.99）');
        return;
      }
      
      if (num === 0) {
        this.formData.amountUppercase = '零元整';
        this.formData.amountUppercaseWithSymbol = '人民币零元整';
        return;
      }
      
      const upperCaseAmount = this.convertNumberToChinese(num);
      this.formData.amountUppercase = upperCaseAmount;
      this.formData.amountUppercaseWithSymbol = '人民币' + upperCaseAmount;
    },
    
    // 将数字金额转换为中文大写
    convertNumberToChinese(num) {
      const units = ['元', '角', '分'];
      const nums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const bigUnits = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
      
      // 将金额乘以100并四舍五入，转化为以分为单位的整数
      let intAndDec = Math.round(num * 100);
      
      if (intAndDec === 0) {
        return '零元整';
      }
      
      let intPart = Math.floor(intAndDec / 100); // 整数部分
      let decPart = intAndDec % 100; // 小数部分（以分为单位）
      
      let result = '';
      
      // 转换整数部分
      if (intPart > 0) {
        result += this.convertIntToChinese(intPart);
      }
      
      // 转换小数部分
      if (decPart > 0) {
        if (decPart >= 10) {
          // 十位和个位
          const jiao = Math.floor(decPart / 10);
          const fen = decPart % 10;
          
          if (jiao > 0) {
            result += nums[jiao] + '角';
          }
          if (fen > 0) {
            result += nums[fen] + '分';
          }
        } else {
          // 不足1角的只有分
          result += nums[decPart] + '分';
        }
      } else if (intPart > 0) {
        result += '整';
      }
      
      return result;
    },
    
    // 转换整数部分为中文
    convertIntToChinese(num) {
      if (num === 0) {
        return '零元';
      }
      
      const nums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const bigUnits = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
      
      let numStr = num.toString();
      
      // 处理亿位
      let yi = Math.floor(num / 100000000);
      let remainAfterYi = num % 100000000;
      
      // 处理万位
      let wan = Math.floor(remainAfterYi / 10000);
      let ge = remainAfterYi % 10000;
      
      let result = '';
      
      if (yi > 0) {
        result += this.processSection(yi, nums, bigUnits.slice(0, 4)) + '亿';
        
        // 如果万位或个位不为0，需要加零
        if ((wan > 0 || ge > 0) && (wan < 1000 || ge > 0)) {
          result += '零';
        }
      }
      
      if (wan > 0) {
        result += this.processSection(wan, nums, bigUnits.slice(0, 4)) + '万';
        
        // 如果个位不为0且万位不足四位，需要加零
        if (ge > 0 && ge < 1000) {
          result += '零';
        }
      }
      
      if (ge > 0) {
        result += this.processSection(ge, nums, bigUnits.slice(0, 4));
      }
      
      result += '元';
      
      return result;
    },
    
    // 处理四位以内的数字
    processSection(sectionNum, nums, units) {
      if (sectionNum === 0) {
        return '零';
      }
      
      let numStr = sectionNum.toString();
      let result = '';
      let zeroFlag = false; // 标记是否需要补零
      
      for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr[i]);
        let pos = numStr.length - i - 1; // 当前数字的位置
        
        if (digit === 0) {
          if (!result.endsWith('零') && i < numStr.length - 1) { // 不是最后一位且前面没刚加过零
            zeroFlag = true;
          }
        } else {
          if (zeroFlag) {
            result += '零';
            zeroFlag = false;
          }
          result += nums[digit];
          
          // 不是最后一位才加单位
          if (i < numStr.length - 1) {
            result += units[pos];
          }
        }
      }
      
      // 特殊情况处理
      result = result.replace(/壹拾/g, '拾'); // 一十 -> 拾
      
      return result;
    },
    
    clearAll() {
      this.formData.inputValue = '';
      this.clearResults();
    },
    clearResults() {
      this.formData.amountUppercase = '';
      this.formData.amountUppercaseWithSymbol = '';
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
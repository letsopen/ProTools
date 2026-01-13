<template>
  <div class="converter">
    <el-page-header title="返回" content="✅ 校验和工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="formData.inputText" 
            type="textarea"
            :rows="6"
            placeholder="输入要计算校验和的文本"
            @input="calculateChecksums"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">校验和结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="CRC32：">
            <el-input v-model="formData.crc32" readonly>
              <template #append>
                <el-button @click="copyValue(formData.crc32)" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Adler32：">
            <el-input v-model="formData.adler32" readonly>
              <template #append>
                <el-button @click="copyValue(formData.adler32)" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-form-item label="Checksum (累加)：">
            <el-input v-model="formData.checksum" readonly>
              <template #append>
                <el-button @click="copyValue(formData.checksum)" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Fletcher16：">
            <el-input v-model="formData.fletcher16" readonly>
              <template #append>
                <el-button @click="copyValue(formData.fletcher16)" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="calculateChecksums">重新计算</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ChecksumTool',
  data() {
    return {
      formData: {
        inputText: '',
        crc32: '',
        adler32: '',
        checksum: '',
        fletcher16: ''
      }
    }
  },
  mounted() {
    // 初始化一些默认值
    this.calculateChecksums();
  },
  methods: {
    calculateChecksums() {
      if (!this.formData.inputText) {
        this.formData.crc32 = '';
        this.formData.adler32 = '';
        this.formData.checksum = '';
        this.formData.fletcher16 = '';
        return;
      }

      // 计算各种校验和
      this.formData.crc32 = this.crc32(this.formData.inputText).toString(16).toUpperCase();
      this.formData.adler32 = this.adler32(this.formData.inputText).toString(16).toUpperCase();
      this.formData.checksum = this.simpleChecksum(this.formData.inputText).toString(16).toUpperCase();
      this.formData.fletcher16 = this.fletcher16(this.formData.inputText).toString(16).toUpperCase();
    },
    // CRC32 算法实现
    crc32(str) {
      const crcTable = [];
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
          if (c & 1) {
            c = 0xEDB88320 ^ (c >>> 1);
          } else {
            c = c >>> 1;
          }
        }
        crcTable[i] = c;
      }

      let crc = 0xFFFFFFFF;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        crc = crcTable[(crc ^ code) & 0xFF] ^ (crc >>> 8);
      }
      return (crc ^ 0xFFFFFFFF) >>> 0;
    },
    // Adler32 算法实现
    adler32(str) {
      const MOD_ADLER = 65521;
      let a = 1;
      let b = 0;

      for (let i = 0; i < str.length; i++) {
        a += str.charCodeAt(i);
        b += a;
        a %= MOD_ADLER;
        b %= MOD_ADLER;
      }

      return (b << 16) | a;
    },
    // 简单累加校验和
    simpleChecksum(str) {
      let sum = 0;
      for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
      }
      return sum;
    },
    // Fletcher16 算法实现
    fletcher16(str) {
      let sum1 = 0;
      let sum2 = 0;
      
      for (let i = 0; i < str.length; i++) {
        sum1 = (sum1 + str.charCodeAt(i)) % 255;
        sum2 = (sum2 + sum1) % 255;
      }
      
      return (sum2 << 8) | sum1;
    },
    copyValue(value) {
      if (value) {
        navigator.clipboard.writeText(value).then(() => {
          this.$message.success('校验和已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    clearAll() {
      this.formData.inputText = '';
      this.formData.crc32 = '';
      this.formData.adler32 = '';
      this.formData.checksum = '';
      this.formData.fletcher16 = '';
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
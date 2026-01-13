<template>
  <div class="converter">
    <el-page-header title="返回" content="📱 二维码生成器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="输入内容：">
          <el-input 
            v-model="formData.content" 
            type="textarea"
            :rows="4"
            placeholder="输入要生成二维码的内容（网址、文本等）"
            @input="generateQRCode"
            clearable
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="二维码尺寸：">
              <el-slider 
                v-model="formData.size" 
                :min="100" 
                :max="500" 
                @change="generateQRCode"
              />
              <div style="margin-top: 10px;">
                <el-tag type="info">{{ formData.size }} px</el-tag>
              </div>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="纠错级别：">
              <el-select 
                v-model="formData.errorLevel" 
                placeholder="选择纠错级别"
                @change="generateQRCode"
                style="width: 100%"
              >
                <el-option label="低 (L)" value="L" />
                <el-option label="中 (M)" value="M" />
                <el-option label="高 (Q)" value="Q" />
                <el-option label="超高 (H)" value="H" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">生成的二维码</el-divider>

        <div class="qr-container">
          <div v-if="formData.qrCodeUrl" class="qr-code-wrapper">
            <img :src="formData.qrCodeUrl" alt="Generated QR Code" class="qr-image" />
          </div>
          <div v-else class="placeholder-text">
            输入内容以生成二维码
          </div>
        </div>

        <el-divider />

        <el-button-group>
          <el-button type="primary" @click="generateQRCode">生成二维码</el-button>
          <el-button @click="downloadQRCode" :disabled="!formData.qrCodeUrl">下载</el-button>
          <el-button @click="clearAll">清空</el-button>
        </el-button-group>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QRCodeGenerator',
  data() {
    return {
      formData: {
        content: 'https://example.com',
        size: 200,
        errorLevel: 'M',
        qrCodeUrl: ''
      }
    }
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    async generateQRCode() {
      if (!this.formData.content) {
        this.formData.qrCodeUrl = '';
        return;
      }

      try {
        this.formData.qrCodeUrl = await QRCode.toDataURL(this.formData.content, {
          width: this.formData.size,
          height: this.formData.size,
          errorCorrectionLevel: this.formData.errorLevel,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
      } catch (error) {
        console.error('生成二维码失败:', error);
        this.$message.error('生成二维码失败: ' + error.message);
      }
    },
    downloadQRCode() {
      if (!this.formData.qrCodeUrl) return;

      const link = document.createElement('a');
      link.href = this.formData.qrCodeUrl;
      link.download = `qrcode_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    clearAll() {
      this.formData.content = '';
      this.formData.size = 200;
      this.formData.errorLevel = 'M';
      this.formData.qrCodeUrl = '';
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
  margin-top: 1rem;
}

.el-divider {
  margin: 20px 0;
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
}

.placeholder-text {
  color: #ccc;
  font-size: 16px;
}
</style>
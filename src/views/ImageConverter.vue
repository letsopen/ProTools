<template>
  <div class="image-converter">
    <el-page-header title="返回" content="🖼️ 图片转换和压缩工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-form :model="form" label-position="top">
        <el-form-item label="上传图片：">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleImageUpload"
            :before-upload="beforeImageUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png/gif/webp文件，且不超过10MB</div>
            </template>
          </el-upload>
        </el-form-item>

        <div class="image-preview" v-if="imageSrc">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="image-container">
                <h4>原始图片</h4>
                <img :src="imageSrc" alt="原始图片" class="preview-image" />
                <p class="image-info">尺寸: {{ originalInfo.width }} x {{ originalInfo.height }}px</p>
                <p class="image-info">大小: {{ formatFileSize(originalInfo.size) }}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="image-container">
                <h4>转换后图片</h4>
                <img v-if="convertedSrc" :src="convertedSrc" alt="转换后图片" class="preview-image" />
                <div v-else class="no-image">请设置参数并点击转换</div>
                <p v-if="convertedInfo.size" class="image-info">尺寸: {{ convertedInfo.width }} x {{ convertedInfo.height }}px</p>
                <p v-if="convertedInfo.size" class="image-info">大小: {{ formatFileSize(convertedInfo.size) }}</p>
                <p v-if="convertedInfo.size" class="image-info">压缩率: {{ getCompressionRate() }}%</p>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-form-item label="转换参数：">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="输出格式：">
                <el-select v-model="form.outputFormat" placeholder="选择输出格式">
                  <el-option label="JPG" value="jpeg"></el-option>
                  <el-option label="PNG" value="png"></el-option>
                  <el-option label="WebP" value="webp"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="压缩质量：">
                <el-slider v-model="form.quality" :min="10" :max="100" :step="10" show-stops></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="调整尺寸：">
                <el-input v-model.number="form.resizePercentage" type="number" :min="10" :max="100" placeholder="百分比">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="convertImage" :disabled="!imageSrc">转换图片</el-button>
          <el-button @click="downloadImage" :disabled="!convertedSrc">下载图片</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ImageConverter',
  data() {
    return {
      form: {
        outputFormat: 'jpeg',
        quality: 80,
        resizePercentage: 100
      },
      imageSrc: '',
      convertedSrc: '',
      originalInfo: {
        width: 0,
        height: 0,
        size: 0
      },
      convertedInfo: {
        width: 0,
        height: 0,
        size: 0
      },
      originalFile: null
    };
  },
  methods: {
    handleImageUpload(file) {
      this.originalFile = file.raw;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target.result;
        
        // 获取原始图片信息
        const img = new Image();
        img.onload = () => {
          this.originalInfo.width = img.width;
          this.originalInfo.height = img.height;
          this.originalInfo.size = file.raw.size;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },

    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('图片大小不能超过10MB!');
        return false;
      }
      return isImage && isLt10M;
    },

    convertImage() {
      if (!this.imageSrc) {
        this.$message.error('请先上传图片');
        return;
      }

      const img = new Image();
      img.onload = () => {
        // 创建canvas进行图片处理
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 计算新尺寸
        const newWidth = Math.floor(img.width * (this.form.resizePercentage / 100));
        const newHeight = Math.floor(img.height * (this.form.resizePercentage / 100));
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // 转换为指定格式
        const mimeType = `image/${this.form.outputFormat}`;
        const quality = this.form.quality / 100;
        const dataURL = canvas.toDataURL(mimeType, quality);
        
        this.convertedSrc = dataURL;
        this.convertedInfo.width = newWidth;
        this.convertedInfo.height = newHeight;
        
        // 计算转换后图片大小（估算）
        const byteString = atob(dataURL.split(',')[1]);
        this.convertedInfo.size = byteString.length;
        
        this.$message.success('图片转换成功！');
      };
      img.src = this.imageSrc;
    },

    downloadImage() {
      if (!this.convertedSrc) {
        this.$message.error('没有可下载的图片');
        return;
      }

      const link = document.createElement('a');
      link.href = this.convertedSrc;
      link.download = `converted_image_${Date.now()}.${this.form.outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.$message.success('图片下载成功！');
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    getCompressionRate() {
      if (this.originalInfo.size === 0 || this.convertedInfo.size === 0) return 0;
      return parseFloat(((1 - this.convertedInfo.size / this.originalInfo.size) * 100).toFixed(2));
    },

    resetForm() {
      this.imageSrc = '';
      this.convertedSrc = '';
      this.originalInfo = { width: 0, height: 0, size: 0 };
      this.convertedInfo = { width: 0, height: 0, size: 0 };
      this.form = {
        outputFormat: 'jpeg',
        quality: 80,
        resizePercentage: 100
      };
      this.originalFile = null;
    }
  }
};
</script>

<style scoped>
.tool-container {
  margin: 20px;
  min-height: 600px;
}

.el-form {
  margin-top: 20px;
}

.image-preview {
  margin: 20px 0;
}

.image-container {
  text-align: center;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.image-container h4 {
  margin: 10px 0 15px 0;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.no-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
}

.image-info {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}

.upload-demo {
  text-align: center;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}
</style>
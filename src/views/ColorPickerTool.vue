<template>
  <div class="color-picker-tool">
    <el-page-header title="返回" content="取色器工具" @back="$router.go(-1) || $router.push('/')" />
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
              <div class="el-upload__tip">只能上传jpg/png/gif文件，且不超过5MB</div>
            </template>
          </el-upload>
        </el-form-item>

        <div class="image-container" v-if="imageSrc">
          <img 
            :src="imageSrc" 
            alt="上传的图片" 
            ref="imageRef"
            @mousemove="onMouseMove"
            @click="onImageClick"
            class="uploaded-image"
          />
          <div 
            class="color-preview" 
            :style="{ backgroundColor: currentColor }"
            v-if="currentColor"
          ></div>
          <div class="coordinates" v-if="currentPosition.x !== -1">
            坐标: ({{ currentPosition.x }}, {{ currentPosition.y }}) | 颜色: {{ currentColor }}
          </div>
        </div>

        <el-form-item label="颜色值：" style="margin-top: 20px;">
          <el-input 
            v-model="selectedColor" 
            placeholder="点击图片上的颜色点获取颜色值"
            readonly
          >
            <template #append>
              <div 
                class="color-box" 
                :style="{ backgroundColor: selectedColor }"
                v-if="selectedColor"
              ></div>
            </template>
          </el-input>
          <el-button 
            @click="copyColor" 
            :disabled="!selectedColor" 
            style="margin-top: 10px;"
          >
            复制颜色值
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ColorPickerTool',
  data() {
    return {
      form: {},
      imageSrc: '',
      currentColor: '',
      selectedColor: '',
      currentPosition: { x: -1, y: -1 },
      canvas: null,
      ctx: null
    };
  },
  methods: {
    handleImageUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target.result;
        // 图片加载完成后初始化canvas
        this.$nextTick(() => {
          this.initCanvas();
        });
      };
      reader.readAsDataURL(file.raw);
    },

    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过5MB!');
        return false;
      }
      return isImage && isLt5M;
    },

    initCanvas() {
      const img = this.$refs.imageRef;
      if (!img) return;

      // 创建canvas元素用于获取像素颜色
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.$refs.imageRef.naturalWidth;
      this.canvas.height = this.$refs.imageRef.naturalHeight;
      this.ctx.drawImage(this.$refs.imageRef, 0, 0, this.canvas.width, this.canvas.height);
    },

    onMouseMove(event) {
      if (!this.canvas || !this.ctx) return;

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 获取相对于原始图片的比例
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const pixelX = Math.floor(x * scaleX);
      const pixelY = Math.floor(y * scaleY);

      // 限制坐标在图像范围内
      if (pixelX >= 0 && pixelX < this.canvas.width && 
          pixelY >= 0 && pixelY < this.canvas.height) {
        
        const pixel = this.ctx.getImageData(pixelX, pixelY, 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        
        this.currentColor = `rgb(${r}, ${g}, ${b})`;
        this.currentPosition = { x: pixelX, y: pixelY };
      }
    },

    onImageClick(event) {
      if (!this.canvas || !this.ctx) return;

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 获取相对于原始图片的比例
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const pixelX = Math.floor(x * scaleX);
      const pixelY = Math.floor(y * scaleY);

      // 限制坐标在图像范围内
      if (pixelX >= 0 && pixelX < this.canvas.width && 
          pixelY >= 0 && pixelY < this.canvas.height) {
        
        const pixel = this.ctx.getImageData(pixelX, pixelY, 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        
        // 转换为十六进制格式
        const hexColor = this.rgbToHex(r, g, b);
        this.selectedColor = hexColor;
        this.$message.success(`颜色已选取: ${hexColor}`);
      }
    },

    rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },

    copyColor() {
      if (!this.selectedColor) {
        this.$message.warning('没有可复制的颜色值');
        return;
      }
      
      navigator.clipboard.writeText(this.selectedColor).then(() => {
        this.$message.success('颜色值已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = this.selectedColor;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('颜色值已复制到剪贴板');
      });
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

.image-container {
  position: relative;
  margin: 20px 0;
  text-align: center;
}

.uploaded-image {
  max-width: 100%;
  max-height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: crosshair;
}

.color-preview {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
}

.coordinates {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
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
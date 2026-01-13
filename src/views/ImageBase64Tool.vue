<template>
  <div class="image-base64-tool">
    <el-page-header title="返回" content="图片Base64转换工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 图片转Base64 -->
        <el-tab-pane label="图片转Base64" name="imageToBase64">
          <el-form :model="imageToBase64Form" label-position="top">
            <el-form-item label="选择图片：">
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

            <el-image 
              v-if="imagePreview" 
              :src="imagePreview" 
              :preview-src-list="[imagePreview]"
              style="max-width: 300px; max-height: 300px; margin: 10px 0;">
            </el-image>

            <el-form-item>
              <el-button type="primary" @click="convertImageToBase64">转换为Base64</el-button>
              <el-button @click="clearImageToBase64Fields">清空</el-button>
            </el-form-item>

            <el-form-item label="Base64结果：">
              <el-input 
                v-model="imageToBase64Form.base64" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="转换后的Base64编码将显示在这里"
              />
              <el-button @click="copyText(imageToBase64Form.base64)" size="small" style="margin-top: 10px;">复制Base64</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- Base64转图片 -->
        <el-tab-pane label="Base64转图片" name="base64ToImage">
          <el-form :model="base64ToImageForm" label-position="top">
            <el-form-item label="Base64编码：">
              <el-input 
                v-model="base64ToImageForm.base64" 
                type="textarea"
                :rows="10"
                placeholder="请输入Base64编码（以data:image/ 开头或仅包含编码部分）"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertBase64ToImage">转换为图片</el-button>
              <el-button @click="downloadImage" :disabled="!imagePreview">下载图片</el-button>
              <el-button @click="clearBase64ToImageFields">清空</el-button>
            </el-form-item>

            <el-image 
              v-if="imagePreview" 
              :src="imagePreview" 
              :preview-src-list="[imagePreview]"
              style="max-width: 300px; max-height: 300px; margin: 10px 0;">
            </el-image>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ImageBase64Tool',
  data() {
    return {
      activeTab: 'imageToBase64',
      imageToBase64Form: {
        base64: ''
      },
      base64ToImageForm: {
        base64: ''
      },
      imagePreview: ''
    };
  },
  methods: {
    // 处理图片上传
    handleImageUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },

    // 限制上传文件类型
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

    // 图片转Base64
    convertImageToBase64() {
      if (!this.imagePreview) {
        this.$message.error('请先选择一张图片');
        return;
      }

      try {
        // 直接使用预览URL作为Base64（因为FileReader已经将其转换）
        this.imageToBase64Form.base64 = this.imagePreview;
        this.$message.success('图片转换为Base64成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
      }
    },

    // Base64转图片
    convertBase64ToImage() {
      if (!this.base64ToImageForm.base64) {
        this.$message.error('请输入Base64编码');
        return;
      }

      try {
        // 如果Base64没有包含MIME类型前缀，则添加默认的PNG类型
        let base64Data = this.base64ToImageForm.base64.trim();
        if (!base64Data.startsWith('data:image/')) {
          // 尝试检测是否为有效的Base64字符串
          if (/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(base64Data.replace(/\s/g, ''))) {
            base64Data = 'data:image/png;base64,' + base64Data;
          } else {
            throw new Error('无效的Base64编码');
          }
        }

        this.imagePreview = base64Data;
        this.$message.success('Base64转换为图片成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
      }
    },

    // 下载图片
    downloadImage() {
      if (!this.imagePreview) {
        this.$message.error('没有可下载的图片');
        return;
      }

      try {
        const link = document.createElement('a');
        link.href = this.imagePreview;
        link.download = `converted_image_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$message.success('图片下载成功！');
      } catch (error) {
        this.$message.error(`下载失败: ${error.message}`);
      }
    },

    // 复制文本到剪贴板
    copyText(text) {
      if (!text) {
        this.$message.warning('没有内容可复制');
        return;
      }
      
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('已复制到剪贴板');
      });
    },

    // 清空图片转Base64字段
    clearImageToBase64Fields() {
      this.imageToBase64Form.base64 = '';
      this.imagePreview = '';
    },

    // 清空Base64转图片字段
    clearBase64ToImageFields() {
      this.base64ToImageForm.base64 = '';
      this.imagePreview = '';
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

.upload-demo {
  text-align: center;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}
</style>
<template>
  <div class="converter">
    <el-page-header title="返回" content="✂️ 代码压缩工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="代码语言：">
          <el-select 
            v-model="formData.language" 
            placeholder="选择代码语言"
            @change="updateSampleCode"
            style="width: 100%"
          >
            <el-option label="HTML" value="html" />
            <el-option label="CSS" value="css" />
            <el-option label="JavaScript" value="js" />
          </el-select>
        </el-form-item>

        <el-form-item label="输入代码：">
          <el-input 
            v-model="formData.inputCode" 
            type="textarea"
            :rows="10"
            placeholder="输入要压缩的代码"
            @input="debouncedMinify"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">压缩选项</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-checkbox v-model="formData.removeComments" @change="debouncedMinify">移除注释</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="formData.removeWhitespace" @change="debouncedMinify">移除空格</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="formData.compress" @change="debouncedMinify">深度压缩</el-checkbox>
        </el-col>
      </el-row>

      <el-divider content-position="left">压缩结果</el-divider>

      <el-form-item label="输出代码：">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span>大小: {{ inputSize }} bytes → {{ outputSize }} bytes ({{ compressionRatio }}% 压缩率)</span>
          <el-button @click="copyOutput" size="small">复制结果</el-button>
        </div>
        <el-input 
          v-model="formData.outputCode" 
          type="textarea"
          :rows="10"
          readonly 
          placeholder="压缩后的代码将显示在这里"
        />
      </el-form-item>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="minifyCode">立即压缩</el-button>
        <el-button @click="loadSample">加载示例</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CodeMinifier',
  data() {
    return {
      formData: {
        language: 'js',
        inputCode: '',
        outputCode: '',
        removeComments: true,
        removeWhitespace: true,
        compress: true
      },
      sampleCodes: {
        js: `// 这是一个示例JavaScript代码
function greetUser(name) {
    // 检查名字是否为空
    if (name === undefined || name === "") {
        console.log("请输入用户名");
        return;
    }
    
    // 显示欢迎信息
    console.log("欢迎, " + name + "!");
}

// 调用函数
greetUser("张三");`,
        css: `/* 这是一个示例CSS代码 */
.container {
    /* 设置容器宽度 */
    width: 100%;
    /* 居中对齐 */
    margin: 0 auto;
    /* 添加内边距 */
    padding: 20px;
}

/* 标题样式 */
.header {
    /* 字体大小 */
    font-size: 24px;
    /* 字体颜色 */
    color: #333;
    /* 下边距 */
    margin-bottom: 20px;
}`,
        html: `<!DOCTYPE html>
<html>
<head>
    <!-- 页面标题 -->
    <title>示例页面</title>
    <meta charset="UTF-8">
</head>
<body>
    <!-- 主要内容 -->
    <div class="container">
        <h1>欢迎访问我的网站</h1>
        <p>这是一个示例页面。</p>
    </div>
</body>
</html>`
      }
    }
  },
  computed: {
    inputSize() {
      return this.formData.inputCode ? new Blob([this.formData.inputCode]).size : 0;
    },
    outputSize() {
      return this.formData.outputCode ? new Blob([this.formData.outputCode]).size : 0;
    },
    compressionRatio() {
      if (this.inputSize === 0) return 0;
      return Math.round((1 - this.outputSize / this.inputSize) * 100);
    }
  },
  mounted() {
    this.loadSample();
    // 初始化防抖函数
    this.debouncedMinify = this.debounce(this.minifyCode, 500);
  },
  methods: {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    minifyCode() {
      if (!this.formData.inputCode) {
        this.formData.outputCode = '';
        return;
      }

      let code = this.formData.inputCode;

      if (this.formData.removeComments) {
        code = this.removeComments(code, this.formData.language);
      }

      if (this.formData.removeWhitespace) {
        code = this.removeWhitespace(code, this.formData.language);
      }

      if (this.formData.compress) {
        code = this.deepCompress(code, this.formData.language);
      }

      this.formData.outputCode = code;
    },
    removeComments(code, language) {
      switch (language) {
        case 'js':
        case 'css':
          // 移除单行注释 // 和多行注释 /* */
          return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
        case 'html':
          // 移除HTML注释
          return code.replace(/<!--[\s\S]*?-->/g, '');
        default:
          return code;
      }
    },
    removeWhitespace(code, language) {
      switch (language) {
        case 'js':
        case 'css':
          // 移除多余的空白字符，但保留字符串内的空格
          return code.replace(/\s+/g, ' ').trim();
        case 'html':
          // 移除HTML标签间的多余空白
          return code.replace(/\s+</g, '<').replace(/>\s+/g, '>').replace(/\s+/g, ' ');
        default:
          return code;
      }
    },
    deepCompress(code, language) {
      switch (language) {
        case 'js':
          // 简单的JavaScript压缩
          return code
            .replace(/[\r\n]+/g, '') // 移除换行符
            // eslint-disable-next-line no-useless-escape
            .replace(/\s*([{}(),:=\[\]])\s*/g, '$1') // 移除操作符周围的空格
            .replace(/\s+/g, ' '); // 替换多个空格为单个空格
        case 'css':
          // 简单的CSS压缩
          return code
            .replace(/\s*([{}:;,>+])\s*/g, '$1') // 移除CSS操作符周围的空格
            .replace(/;\}/g, '}') // 移除CSS块结尾的分号
            .replace(/\s+/g, ' '); // 替换多个空格为单个空格
        case 'html':
          // 简单的HTML压缩
          return code
            .replace(/\s*>\s*/g, '>') // 移除标签前后的空格
            .replace(/\s*</g, '<') // 移除标签前的空格
            .replace(/\s+/g, ' '); // 替换多个空格为单个空格
        default:
          return code;
      }
    },
    updateSampleCode() {
      this.loadSample();
    },
    loadSample() {
      this.formData.inputCode = this.sampleCodes[this.formData.language] || '';
      this.minifyCode();
    },
    copyOutput() {
      if (this.formData.outputCode) {
        navigator.clipboard.writeText(this.formData.outputCode).then(() => {
          this.$message.success('压缩结果已复制到剪贴板');
        });
      } else {
        this.$message.warning('没有可复制的内容');
      }
    },
    clearAll() {
      this.formData.inputCode = '';
      this.formData.outputCode = '';
      this.formData.removeComments = true;
      this.formData.removeWhitespace = true;
      this.formData.compress = true;
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
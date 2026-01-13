<template>
  <div class="diff-tool">
    <el-page-header title="返回" content="文本Diff对比工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-form :model="form" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文本A：">
              <el-input 
                v-model="form.textA" 
                type="textarea"
                :rows="10"
                placeholder="请输入第一个文本"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本B：">
              <el-input 
                v-model="form.textB" 
                type="textarea"
                :rows="10"
                placeholder="请输入第二个文本"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="compareTexts">对比文本</el-button>
          <el-button @click="clearFields">清空</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">对比结果</el-divider>
      
      <div class="diff-output" v-if="diffResult">
        <pre v-html="diffResult"></pre>
      </div>
      
      <div v-if="!diffResult" class="no-data">
        <p>暂无对比结果，请先进行文本对比</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { diffLines } from 'diff';

export default {
  name: 'DiffTool',
  data() {
    return {
      form: {
        textA: '',
        textB: ''
      },
      diffResult: ''
    };
  },
  methods: {
    compareTexts() {
      if (!this.form.textA && !this.form.textB) {
        this.$message.error('请至少输入一个文本进行对比');
        return;
      }

      try {
        // 使用diff库进行文本对比
        const diff = diffLines(this.form.textA || '', this.form.textB || '');
        
        let resultHtml = '<div class="diff-content">';
        
        diff.forEach((part) => {
          const lines = part.value.split('\n');
          
          // 过滤掉最后一行空行
          const filteredLines = lines.filter(line => line !== '');
          
          if (part.added) {
            filteredLines.forEach(line => {
              if (line) {
                resultHtml += `<div class="diff-line diff-added">+ ${this.escapeHtml(line)}</div>`;
              }
            });
          } else if (part.removed) {
            filteredLines.forEach(line => {
              if (line) {
                resultHtml += `<div class="diff-line diff-removed">- ${this.escapeHtml(line)}</div>`;
              }
            });
          } else {
            filteredLines.forEach(line => {
              if (line) {
                resultHtml += `<div class="diff-line diff-common">  ${this.escapeHtml(line)}</div>`;
              }
            });
          }
        });
        
        resultHtml += '</div>';
        this.diffResult = resultHtml;
        
        this.$message.success('文本对比完成！');
      } catch (error) {
        this.$message.error(`文本对比失败: ${error.message}`);
      }
    },

    escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n$/, ""); // 移除行尾换行
    },

    clearFields() {
      this.form.textA = '';
      this.form.textB = '';
      this.diffResult = '';
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

.diff-output {
  max-height: 400px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

.diff-content {
  font-family: monospace;
  line-height: 1.5;
}

.diff-line {
  padding: 2px 5px;
  border-radius: 2px;
  margin: 1px 0;
}

.diff-added {
  background-color: #d4edda;
  color: #155724;
  border-left: 3px solid #28a745;
}

.diff-removed {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 3px solid #dc3545;
}

.diff-common {
  background-color: #f1f3f4;
  color: #495057;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
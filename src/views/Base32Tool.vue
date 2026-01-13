<template>
  <div class="base32-tool">
    <el-page-header title="返回" content="Base32编码解码工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 编码 -->
        <el-tab-pane label="编码" name="encode">
          <el-form :model="encodeForm" label-position="top">
            <el-form-item label="待编码文本：">
              <el-input 
                v-model="encodeForm.text" 
                type="textarea"
                :rows="6"
                placeholder="请输入要进行Base32编码的文本"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="encodeText">编码</el-button>
              <el-button @click="clearEncodeFields">清空</el-button>
            </el-form-item>

            <el-form-item label="编码结果：">
              <el-input 
                v-model="encodeForm.result" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="Base32编码结果将显示在这里"
              />
              <el-button @click="copyText(encodeForm.result)" size="small" style="margin-top: 10px;">复制结果</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 解码 -->
        <el-tab-pane label="解码" name="decode">
          <el-form :model="decodeForm" label-position="top">
            <el-form-item label="待解码文本：">
              <el-input 
                v-model="decodeForm.encodedText" 
                type="textarea"
                :rows="6"
                placeholder="请输入要进行Base32解码的文本"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="decodeText">解码</el-button>
              <el-button @click="clearDecodeFields">清空</el-button>
            </el-form-item>

            <el-form-item label="解码结果：">
              <el-input 
                v-model="decodeForm.result" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="Base32解码结果将显示在这里"
              />
              <el-button @click="copyText(decodeForm.result)" size="small" style="margin-top: 10px;">复制结果</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import base32 from 'hi-base32';

export default {
  name: 'Base32Tool',
  data() {
    return {
      activeTab: 'encode',
      encodeForm: {
        text: '',
        result: ''
      },
      decodeForm: {
        encodedText: '',
        result: ''
      }
    };
  },
  methods: {
    // Base32编码
    encodeText() {
      if (!this.encodeForm.text) {
        this.$message.error('请输入要编码的文本');
        return;
      }

      try {
        this.encodeForm.result = base32.encode(this.encodeForm.text);
        this.$message.success('编码成功！');
      } catch (error) {
        this.$message.error(`编码失败: ${error.message}`);
      }
    },

    // Base32解码
    decodeText() {
      if (!this.decodeForm.encodedText) {
        this.$message.error('请输入要解码的文本');
        return;
      }

      try {
        // 移除可能的空格和换行符
        const cleanEncoded = this.decodeForm.encodedText.replace(/[\s\n\r]/g, '');
        this.decodeForm.result = base32.decode(cleanEncoded);
        this.$message.success('解码成功！');
      } catch (error) {
        this.$message.error(`解码失败: ${error.message}`);
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

    // 清空编码字段
    clearEncodeFields() {
      this.encodeForm.text = '';
      this.encodeForm.result = '';
    },

    // 清空解码字段
    clearDecodeFields() {
      this.decodeForm.encodedText = '';
      this.decodeForm.result = '';
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

.el-textarea {
  margin-top: 5px;
}
</style>
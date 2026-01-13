<template>
  <div class="hex-binary-tool">
    <el-page-header title="返回" content="Hex与Binary转换工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- Hex转Binary -->
        <el-tab-pane label="Hex转Binary" name="hexToBinary">
          <el-form :model="hexToBinaryForm" label-position="top">
            <el-form-item label="十六进制(Hex)：">
              <el-input 
                v-model="hexToBinaryForm.hex" 
                type="textarea"
                :rows="6"
                placeholder="请输入十六进制数据（如：48656C6C6F）"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertHexToBinary">转换</el-button>
              <el-button @click="clearHexToBinaryFields">清空</el-button>
            </el-form-item>

            <el-form-item label="二进制(Binary)：">
              <el-input 
                v-model="hexToBinaryForm.binary" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="二进制结果将显示在这里"
              />
              <el-button @click="copyText(hexToBinaryForm.binary)" size="small" style="margin-top: 10px;">复制结果</el-button>
            </el-form-item>

            <el-form-item label="原始文本：">
              <el-input 
                v-model="hexToBinaryForm.text" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="原始文本将显示在这里"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- Binary转Hex -->
        <el-tab-pane label="Binary转Hex" name="binaryToHex">
          <el-form :model="binaryToHexForm" label-position="top">
            <el-form-item label="二进制(Binary)：">
              <el-input 
                v-model="binaryToHexForm.binary" 
                type="textarea"
                :rows="6"
                placeholder="请输入二进制数据（如：01001000 01100101 01101100 01101100 01101111 或 0100100001100101011011000110110001101111）"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertBinaryToHex">转换</el-button>
              <el-button @click="clearBinaryToHexFields">清空</el-button>
            </el-form-item>

            <el-form-item label="十六进制(Hex)：">
              <el-input 
                v-model="binaryToHexForm.hex" 
                type="textarea"
                :rows="6"
                readonly
                placeholder="十六进制结果将显示在这里"
              />
              <el-button @click="copyText(binaryToHexForm.hex)" size="small" style="margin-top: 10px;">复制结果</el-button>
            </el-form-item>

            <el-form-item label="原始文本：">
              <el-input 
                v-model="binaryToHexForm.text" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="原始文本将显示在这里"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 文本转Hex/Binary -->
        <el-tab-pane label="文本转换" name="textConvert">
          <el-form :model="textConvertForm" label-position="top">
            <el-form-item label="输入文本：">
              <el-input 
                v-model="textConvertForm.text" 
                type="textarea"
                :rows="6"
                placeholder="请输入要转换的文本"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="convertTextToHex">文本转Hex</el-button>
                <el-button @click="convertTextToBinary">文本转Binary</el-button>
                <el-button @click="clearTextConvertFields">清空</el-button>
              </el-button-group>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Hex结果：">
                  <el-input 
                    v-model="textConvertForm.hex" 
                    type="textarea"
                    :rows="4"
                    readonly
                    placeholder="十六进制结果"
                  />
                  <el-button @click="copyText(textConvertForm.hex)" size="small" style="margin-top: 10px;">复制Hex</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Binary结果：">
                  <el-input 
                    v-model="textConvertForm.binary" 
                    type="textarea"
                    :rows="4"
                    readonly
                    placeholder="二进制结果"
                  />
                  <el-button @click="copyText(textConvertForm.binary)" size="small" style="margin-top: 10px;">复制Binary</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HexBinaryTool',
  data() {
    return {
      activeTab: 'hexToBinary',
      hexToBinaryForm: {
        hex: '',
        binary: '',
        text: ''
      },
      binaryToHexForm: {
        binary: '',
        hex: '',
        text: ''
      },
      textConvertForm: {
        text: '',
        hex: '',
        binary: ''
      }
    };
  },
  methods: {
    // Hex转Binary
    convertHexToBinary() {
      if (!this.hexToBinaryForm.hex) {
        this.$message.error('请输入十六进制数据');
        return;
      }

      try {
        // 移除空格和换行符
        const cleanHex = this.hexToBinaryForm.hex.replace(/[^0-9A-Fa-f]/g, '');
        
        if (cleanHex.length % 2 !== 0) {
          this.$message.error('十六进制数据长度必须是偶数');
          return;
        }

        // 将十六进制转换为二进制
        let binary = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
          const hexByte = cleanHex.substr(i, 2);
          const decimal = parseInt(hexByte, 16);
          const binaryByte = decimal.toString(2).padStart(8, '0');
          binary += binaryByte + ' ';
        }
        
        // 移除末尾的空格
        binary = binary.trim();
        
        this.hexToBinaryForm.binary = binary;
        
        // 尝试将十六进制转换为文本
        try {
          let text = '';
          for (let i = 0; i < cleanHex.length; i += 2) {
            const hexByte = cleanHex.substr(i, 2);
            const charCode = parseInt(hexByte, 16);
            text += String.fromCharCode(charCode);
          }
          this.hexToBinaryForm.text = text;
        } catch (e) {
          this.hexToBinaryForm.text = '无法转换为可读文本';
        }
        
        this.$message.success('转换成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
      }
    },

    // Binary转Hex
    convertBinaryToHex() {
      if (!this.binaryToHexForm.binary) {
        this.$message.error('请输入二进制数据');
        return;
      }

      try {
        // 移除空格和换行符
        const cleanBinary = this.binaryToHexForm.binary.replace(/[^01\s]/g, '').replace(/\s+/g, '');
        
        if (cleanBinary.length % 8 !== 0) {
          this.$message.error('二进制数据长度必须是8的倍数');
          return;
        }

        // 将二进制转换为十六进制
        let hex = '';
        for (let i = 0; i < cleanBinary.length; i += 8) {
          const binaryByte = cleanBinary.substr(i, 8);
          const decimal = parseInt(binaryByte, 2);
          const hexByte = decimal.toString(16).toUpperCase().padStart(2, '0');
          hex += hexByte;
        }
        
        this.binaryToHexForm.hex = hex;
        
        // 尝试将二进制转换为文本
        try {
          let text = '';
          for (let i = 0; i < cleanBinary.length; i += 8) {
            const binaryByte = cleanBinary.substr(i, 8);
            const charCode = parseInt(binaryByte, 2);
            text += String.fromCharCode(charCode);
          }
          this.binaryToHexForm.text = text;
        } catch (e) {
          this.binaryToHexForm.text = '无法转换为可读文本';
        }
        
        this.$message.success('转换成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
      }
    },

    // 文本转Hex
    convertTextToHex() {
      if (!this.textConvertForm.text) {
        this.$message.error('请输入要转换的文本');
        return;
      }

      try {
        let hex = '';
        for (let i = 0; i < this.textConvertForm.text.length; i++) {
          const charCode = this.textConvertForm.text.charCodeAt(i);
          const hexByte = charCode.toString(16).toUpperCase().padStart(2, '0');
          hex += hexByte;
        }
        
        this.textConvertForm.hex = hex;
        this.$message.success('文本转Hex成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
      }
    },

    // 文本转Binary
    convertTextToBinary() {
      if (!this.textConvertForm.text) {
        this.$message.error('请输入要转换的文本');
        return;
      }

      try {
        let binary = '';
        for (let i = 0; i < this.textConvertForm.text.length; i++) {
          const charCode = this.textConvertForm.text.charCodeAt(i);
          const binaryByte = charCode.toString(2).padStart(8, '0');
          binary += binaryByte + ' ';
        }
        
        this.textConvertForm.binary = binary.trim();
        this.$message.success('文本转Binary成功！');
      } catch (error) {
        this.$message.error(`转换失败: ${error.message}`);
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

    // 清空Hex转Binary字段
    clearHexToBinaryFields() {
      this.hexToBinaryForm.hex = '';
      this.hexToBinaryForm.binary = '';
      this.hexToBinaryForm.text = '';
    },

    // 清空Binary转Hex字段
    clearBinaryToHexFields() {
      this.binaryToHexForm.binary = '';
      this.binaryToHexForm.hex = '';
      this.binaryToHexForm.text = '';
    },

    // 清空文本转换字段
    clearTextConvertFields() {
      this.textConvertForm.text = '';
      this.textConvertForm.hex = '';
      this.textConvertForm.binary = '';
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
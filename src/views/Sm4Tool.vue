<template>
  <div class="sm4-tool">
    <el-page-header title="返回" content="SM4国密加密工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 密钥生成 -->
        <el-tab-pane label="密钥生成" name="generate">
          <el-form :model="generateForm" label-position="top">
            <el-form-item>
              <el-button type="primary" @click="generateKey">生成SM4密钥</el-button>
              <el-button @click="generateRandomKey" style="margin-left: 10px;">生成随机密钥</el-button>
            </el-form-item>
            <el-form-item label="生成的密钥：">
              <el-input 
                v-model="generatedKey" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="点击生成密钥获取SM4密钥"
              />
              <el-button @click="copyText(generatedKey)" size="small" style="margin-top: 10px;">复制密钥</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 加密解密 -->
        <el-tab-pane label="加密解密" name="encryptDecrypt">
          <el-form :model="cryptoForm" label-position="top">
            <el-form-item label="密钥：">
              <el-input 
                v-model="cryptoForm.key" 
                type="textarea"
                :rows="3"
                placeholder="请输入SM4密钥"
                clearable
              />
            </el-form-item>

            <el-form-item label="待加密文本：">
              <el-input 
                v-model="cryptoForm.plaintext" 
                type="textarea"
                :rows="4"
                placeholder="请输入要加密的文本"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="encryptData">加密</el-button>
                <el-button @click="decryptData">解密</el-button>
                <el-button @click="clearCryptoFields">清空</el-button>
              </el-button-group>
            </el-form-item>

            <el-form-item label="加密结果：">
              <el-input 
                v-model="cryptoForm.encrypted" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="加密后的数据将显示在这里"
              />
              <el-button @click="copyText(cryptoForm.encrypted)" size="small" style="margin-top: 10px;">复制加密结果</el-button>
            </el-form-item>

            <el-form-item label="解密结果：">
              <el-input 
                v-model="cryptoForm.decrypted" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="解密后的数据将显示在这里"
              />
              <el-button @click="copyText(cryptoForm.decrypted)" size="small" style="margin-top: 10px;">复制解密结果</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { SM4 } from 'sm-crypto';

export default {
  name: 'Sm4Tool',
  data() {
    return {
      activeTab: 'generate',
      generateForm: {},
      cryptoForm: {
        key: '',
        plaintext: '',
        encrypted: '',
        decrypted: ''
      },
      generatedKey: ''
    };
  },
  methods: {
    // 生成SM4密钥
    generateKey() {
      // SM4密钥长度固定为128位(16字节)
      const keyArray = new Uint8Array(16);
      
      // 使用随机数填充密钥
      for (let i = 0; i < 16; i++) {
        keyArray[i] = Math.floor(Math.random() * 256);
      }
      
      // 将字节数组转换为十六进制字符串
      this.generatedKey = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
      this.cryptoForm.key = this.generatedKey;
      
      this.$message.success('SM4密钥生成成功！');
    },

    // 生成随机密钥
    generateRandomKey() {
      // 生成一个128位(16字节)的随机密钥
      const keyArray = new Uint8Array(16); // 128位 = 16字节
      for (let i = 0; i < 16; i++) {
        keyArray[i] = Math.floor(Math.random() * 256);
      }
      
      this.generatedKey = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
      this.cryptoForm.key = this.generatedKey;
      
      this.$message.success('随机SM4密钥生成成功！');
    },

    // SM4加密
    encryptData() {
      if (!this.cryptoForm.key) {
        this.$message.error('请输入密钥');
        return;
      }
      
      if (!this.cryptoForm.plaintext) {
        this.$message.error('请输入要加密的文本');
        return;
      }
      
      try {
        // 确保密钥是16字节(32字符的十六进制)
        if (this.cryptoForm.key.length !== 32) {
          this.$message.error('密钥长度不正确，SM4密钥应为128位(32个十六进制字符)');
          return;
        }
        
        // 使用SM4加密
        this.cryptoForm.encrypted = SM4.encrypt(this.cryptoForm.plaintext, this.cryptoForm.key);
        this.$message.success('加密成功！');
      } catch (error) {
        this.$message.error(`加密失败: ${error.message}`);
      }
    },

    // SM4解密
    decryptData() {
      if (!this.cryptoForm.key) {
        this.$message.error('请输入密钥');
        return;
      }
      
      if (!this.cryptoForm.encrypted) {
        this.$message.error('请输入要解密的数据');
        return;
      }
      
      try {
        // 确保密钥是16字节(32字符的十六进制)
        if (this.cryptoForm.key.length !== 32) {
          this.$message.error('密钥长度不正确，SM4密钥应为128位(32个十六进制字符)');
          return;
        }
        
        // 使用SM4解密
        this.cryptoForm.decrypted = SM4.decrypt(this.cryptoForm.encrypted, this.cryptoForm.key);
        this.$message.success('解密成功！');
      } catch (error) {
        this.$message.error(`解密失败: ${error.message}`);
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

    // 清空加密解密字段
    clearCryptoFields() {
      this.cryptoForm.plaintext = '';
      this.cryptoForm.encrypted = '';
      this.cryptoForm.decrypted = '';
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
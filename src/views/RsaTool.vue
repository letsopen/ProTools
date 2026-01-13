<template>
  <div class="rsa-tool">
    <el-page-header title="返回" content="RSA加密工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 密钥生成 -->
        <el-tab-pane label="密钥生成" name="generate">
          <el-form :model="generateForm" label-position="top">
            <el-form-item label="密钥长度：">
              <el-select v-model="generateForm.keySize" placeholder="选择密钥长度">
                <el-option label="1024位" value="1024" />
                <el-option label="2048位" value="2048" />
                <el-option label="4096位" value="4096" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateKeys">生成密钥对</el-button>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="公钥：">
                  <el-input 
                    v-model="generatedPublicKey" 
                    type="textarea"
                    :rows="8"
                    readonly
                    placeholder="点击生成密钥对获取公钥"
                  />
                  <el-button @click="copyText(generatedPublicKey)" size="small" style="margin-top: 10px;">复制公钥</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="私钥：">
                  <el-input 
                    v-model="generatedPrivateKey" 
                    type="textarea"
                    :rows="8"
                    readonly
                    placeholder="点击生成密钥对获取私钥"
                  />
                  <el-button @click="copyText(generatedPrivateKey)" size="small" style="margin-top: 10px;">复制私钥</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <!-- 加密解密 -->
        <el-tab-pane label="加密解密" name="encryptDecrypt">
          <el-form :model="cryptoForm" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="公钥：">
                  <el-input 
                    v-model="cryptoForm.publicKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入公钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="私钥：">
                  <el-input 
                    v-model="cryptoForm.privateKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入私钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

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

        <!-- 密钥验证 -->
        <el-tab-pane label="密钥验证" name="validate">
          <el-form :model="validateForm" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="公钥：">
                  <el-input 
                    v-model="validateForm.publicKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入公钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="私钥：">
                  <el-input 
                    v-model="validateForm.privateKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入私钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button type="primary" @click="validateKeys">验证密钥匹配</el-button>
            </el-form-item>

            <el-form-item label="验证结果：">
              <el-input 
                v-model="validateResult" 
                type="textarea"
                :rows="2"
                readonly
                :type="validateResultType"
                placeholder="验证结果将显示在这里"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt';
import forge from 'node-forge';

export default {
  name: 'RsaTool',
  data() {
    return {
      activeTab: 'generate',
      generateForm: {
        keySize: '2048'
      },
      cryptoForm: {
        publicKey: '',
        privateKey: '',
        plaintext: '',
        encrypted: '',
        decrypted: ''
      },
      validateForm: {
        publicKey: '',
        privateKey: ''
      },
      generatedPublicKey: '',
      generatedPrivateKey: '',
      validateResult: '',
      validateResultType: 'info'
    };
  },
  methods: {
    // 生成RSA密钥对
    generateKeys() {
      const keySize = parseInt(this.generateForm.keySize);
      
      // 使用forge生成密钥对
      const keys = forge.pki.rsa.generateKeyPair({
        bits: keySize,
        workers: 2,
        workerScript: 'static/js/prime.worker.min.js' // 可选，用于多线程生成大密钥
      });
      
      // 导出公钥和私钥
      this.generatedPublicKey = forge.pki.publicKeyToPem(keys.publicKey);
      this.generatedPrivateKey = forge.pki.privateKeyToPem(keys.privateKey);
      
      // 同时填入加密解密表单
      this.cryptoForm.publicKey = this.generatedPublicKey;
      this.cryptoForm.privateKey = this.generatedPrivateKey;
      
      this.$message.success('密钥对生成成功！');
    },

    // RSA加密
    encryptData() {
      if (!this.cryptoForm.publicKey) {
        this.$message.error('请输入公钥');
        return;
      }
      
      if (!this.cryptoForm.plaintext) {
        this.$message.error('请输入要加密的文本');
        return;
      }
      
      try {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.cryptoForm.publicKey);
        this.cryptoForm.encrypted = encrypt.encrypt(this.cryptoForm.plaintext);
        
        if (!this.cryptoForm.encrypted) {
          throw new Error('加密失败，请检查密钥格式');
        }
        
        this.$message.success('加密成功！');
      } catch (error) {
        this.$message.error(`加密失败: ${error.message}`);
      }
    },

    // RSA解密
    decryptData() {
      if (!this.cryptoForm.privateKey) {
        this.$message.error('请输入私钥');
        return;
      }
      
      if (!this.cryptoForm.encrypted) {
        this.$message.error('请输入要解密的数据');
        return;
      }
      
      try {
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(this.cryptoForm.privateKey);
        this.cryptoForm.decrypted = decrypt.decrypt(this.cryptoForm.encrypted);
        
        if (!this.cryptoForm.decrypted) {
          throw new Error('解密失败，请检查密钥格式或加密数据');
        }
        
        this.$message.success('解密成功！');
      } catch (error) {
        this.$message.error(`解密失败: ${error.message}`);
      }
    },

    // 验证密钥匹配
    validateKeys() {
      if (!this.validateForm.publicKey) {
        this.$message.error('请输入公钥');
        return;
      }
      
      if (!this.validateForm.privateKey) {
        this.$message.error('请输入私钥');
        return;
      }
      
      try {
        // 解析公钥和私钥
        const publicKey = forge.pki.publicKeyFromPem(this.validateForm.publicKey);
        const privateKey = forge.pki.privateKeyFromPem(this.validateForm.privateKey);
        
        // 创建测试数据并加密
        const testData = 'test_data_for_validation';
        const encrypted = publicKey.encrypt(testData);
        const decrypted = privateKey.decrypt(encrypted);
        
        if (decrypted === testData) {
          this.validateResult = '密钥匹配验证成功！公钥和私钥是一对有效的密钥对。';
          this.validateResultType = 'success';
        } else {
          this.validateResult = '密钥匹配验证失败！公钥和私钥不匹配。';
          this.validateResultType = 'error';
        }
      } catch (error) {
        this.validateResult = `验证失败: ${error.message}`;
        this.validateResultType = 'error';
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
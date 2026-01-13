<template>
  <div class="sm2-tool">
    <el-page-header title="返回" content="SM2国密加密工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 密钥生成 -->
        <el-tab-pane label="密钥生成" name="generate">
          <el-form :model="generateForm" label-position="top">
            <el-form-item>
              <el-button type="primary" @click="generateKeys">生成SM2密钥对</el-button>
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
                :class="validateResultType === 'success' ? 'is-success' : validateResultType === 'error' ? 'is-error' : 'is-info'"
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
import { SM2 } from 'sm-crypto';

export default {
  name: 'Sm2Tool',
  data() {
    return {
      activeTab: 'generate',
      generateForm: {},
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
    // 生成SM2密钥对
    generateKeys() {
      try {
        const { privateKey, publicKey } = SM2.generateKeyPairHex();
        
        this.generatedPublicKey = publicKey;
        this.generatedPrivateKey = privateKey;
        
        // 同时填入加密解密表单
        this.cryptoForm.publicKey = this.generatedPublicKey;
        this.cryptoForm.privateKey = this.generatedPrivateKey;
        
        this.$message.success('SM2密钥对生成成功！');
      } catch (error) {
        this.$message.error(`密钥生成失败: ${error.message}`);
      }
    },

    // SM2加密
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
        // 使用SM2加密
        this.cryptoForm.encrypted = SM2.doEncrypt(this.cryptoForm.plaintext, this.cryptoForm.publicKey, '0');
        
        this.$message.success('加密成功！');
      } catch (error) {
        this.$message.error(`加密失败: ${error.message}`);
      }
    },

    // SM2解密
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
        // 使用SM2解密
        this.cryptoForm.decrypted = SM2.doDecrypt(this.cryptoForm.encrypted, this.cryptoForm.privateKey, '0');
        
        this.$message.success('解密成功！');
      } catch (error) {
        this.$message.error(`解密失败: ${error.message}`);
      }
    },

    // 验证SM2密钥匹配
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
        // 创建测试数据并加密
        const testData = 'test_data_for_sm2_validation';
        const encrypted = SM2.doEncrypt(testData, this.validateForm.publicKey, '0');
        const decrypted = SM2.doDecrypt(encrypted, this.validateForm.privateKey, '0');
        
        if (decrypted === testData) {
          this.validateResult = 'SM2密钥匹配验证成功！公钥和私钥是一对有效的密钥对。';
          this.validateResultType = 'success';
        } else {
          this.validateResult = 'SM2密钥匹配验证失败！公钥和私钥不匹配。';
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
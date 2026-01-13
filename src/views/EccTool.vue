<template>
  <div class="ecc-tool">
    <el-page-header title="返回" content="ECC椭圆曲线加密工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 密钥生成 -->
        <el-tab-pane label="密钥生成" name="generate">
          <el-form :model="generateForm" label-position="top">
            <el-form-item label="椭圆曲线类型：">
              <el-select v-model="generateForm.curve" placeholder="选择椭圆曲线类型">
                <el-option label="secp256r1" value="secp256r1" />
                <el-option label="secp384r1" value="secp384r1" />
                <el-option label="secp521r1" value="secp521r1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateKeys">生成ECC密钥对</el-button>
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

        <!-- 签名验证 -->
        <el-tab-pane label="签名验证" name="signVerify">
          <el-form :model="signVerifyForm" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="私钥：">
                  <el-input 
                    v-model="signVerifyForm.privateKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入私钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公钥：">
                  <el-input 
                    v-model="signVerifyForm.publicKey" 
                    type="textarea"
                    :rows="6"
                    placeholder="请输入公钥"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="待签名数据：">
              <el-input 
                v-model="signVerifyForm.data" 
                type="textarea"
                :rows="4"
                placeholder="请输入要签名的数据"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="signData">签名</el-button>
                <el-button @click="verifySignature">验证签名</el-button>
                <el-button @click="clearSignFields">清空</el-button>
              </el-button-group>
            </el-form-item>

            <el-form-item label="签名结果：">
              <el-input 
                v-model="signVerifyForm.signature" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="签名结果将显示在这里"
              />
              <el-button @click="copyText(signVerifyForm.signature)" size="small" style="margin-top: 10px;">复制签名</el-button>
            </el-form-item>

            <el-form-item label="验证结果：">
              <el-input 
                v-model="signVerifyForm.verifyResult" 
                type="textarea"
                :rows="2"
                readonly
                :class="signVerifyForm.verifyResult === '签名验证成功！' ? 'is-success' : signVerifyForm.verifyResult.includes('失败') ? 'is-error' : 'is-info'"
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
import forge from 'node-forge';

export default {
  name: 'EccTool',
  data() {
    return {
      activeTab: 'generate',
      generateForm: {
        curve: 'secp256r1'
      },
      signVerifyForm: {
        privateKey: '',
        publicKey: '',
        data: '',
        signature: '',
        verifyResult: ''
      },
      generatedPublicKey: '',
      generatedPrivateKey: ''
    };
  },
  methods: {
    // 生成ECC密钥对
    generateKeys() {
      try {
        // 根据选择的曲线生成ECC密钥对
        const keys = forge.pki.generateKeyPair({ 
          algorithm: 'ec',
          curve: this.generateForm.curve 
        });
        
        // 导出公钥和私钥
        this.generatedPublicKey = forge.pki.publicKeyToPem(keys.publicKey);
        this.generatedPrivateKey = forge.pki.privateKeyToPem(keys.privateKey);
        
        // 同时填入签名验证表单
        this.signVerifyForm.publicKey = this.generatedPublicKey;
        this.signVerifyForm.privateKey = this.generatedPrivateKey;
        
        this.$message.success('ECC密钥对生成成功！');
      } catch (error) {
        this.$message.error(`密钥生成失败: ${error.message}`);
      }
    },

    // ECC签名
    signData() {
      if (!this.signVerifyForm.privateKey) {
        this.$message.error('请输入私钥');
        return;
      }
      
      if (!this.signVerifyForm.data) {
        this.$message.error('请输入要签名的数据');
        return;
      }
      
      try {
        // 将PEM格式的私钥转换为私钥对象
        const privateKey = forge.pki.privateKeyFromPem(this.signVerifyForm.privateKey);
        
        // 创建消息摘要
        const md = forge.md.sha256.create();
        md.update(this.signVerifyForm.data, 'utf8');
        
        // 使用私钥签名
        const signatureBytes = privateKey.sign(md);
        this.signVerifyForm.signature = forge.util.encode64(signatureBytes);
        
        this.$message.success('签名成功！');
      } catch (error) {
        this.$message.error(`签名失败: ${error.message}`);
      }
    },

    // ECC签名验证
    verifySignature() {
      if (!this.signVerifyForm.publicKey) {
        this.$message.error('请输入公钥');
        return;
      }
      
      if (!this.signVerifyForm.data) {
        this.$message.error('请输入要验证的数据');
        return;
      }
      
      if (!this.signVerifyForm.signature) {
        this.$message.error('请输入签名数据');
        return;
      }
      
      try {
        // 将PEM格式的公钥转换为公钥对象
        const publicKey = forge.pki.publicKeyFromPem(this.signVerifyForm.publicKey);
        
        // 创建消息摘要
        const md = forge.md.sha256.create();
        md.update(this.signVerifyForm.data, 'utf8');
        
        // 解码签名
        const signatureBytes = forge.util.decode64(this.signVerifyForm.signature);
        
        // 验证签名
        const verified = publicKey.verify(md.digest().bytes(), signatureBytes);
        
        if (verified) {
          this.signVerifyForm.verifyResult = '签名验证成功！';
        } else {
          this.signVerifyForm.verifyResult = '签名验证失败！';
        }
      } catch (error) {
        this.signVerifyForm.verifyResult = `签名验证失败: ${error.message}`;
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

    // 清空签名字段
    clearSignFields() {
      this.signVerifyForm.data = '';
      this.signVerifyForm.signature = '';
      this.signVerifyForm.verifyResult = '';
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
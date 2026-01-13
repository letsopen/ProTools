<template>
  <div class="jwt-tool">
    <el-page-header title="返回" content="JWT工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- 编码 -->
        <el-tab-pane label="JWT编码" name="encode">
          <el-form :model="encodeForm" label-position="top">
            <el-form-item label="Header (JSON)：">
              <el-input 
                v-model="encodeForm.header" 
                type="textarea"
                :rows="4"
                placeholder='例如: {"alg": "HS256", "typ": "JWT"}'
                clearable
              />
            </el-form-item>

            <el-form-item label="Payload (JSON)：">
              <el-input 
                v-model="encodeForm.payload" 
                type="textarea"
                :rows="6"
                placeholder='例如: {"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
                clearable
              />
            </el-form-item>

            <el-form-item label="密钥：">
              <el-input 
                v-model="encodeForm.secret" 
                type="textarea"
                :rows="2"
                placeholder="请输入签名密钥"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="encodeJwt">生成JWT</el-button>
              <el-button @click="clearEncodeFields">清空</el-button>
            </el-form-item>

            <el-form-item label="生成的JWT：">
              <el-input 
                v-model="encodeForm.result" 
                type="textarea"
                :rows="4"
                readonly
                placeholder="生成的JWT将显示在这里"
              />
              <el-button @click="copyText(encodeForm.result)" size="small" style="margin-top: 10px;">复制JWT</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 解码 -->
        <el-tab-pane label="JWT解码" name="decode">
          <el-form :model="decodeForm" label-position="top">
            <el-form-item label="JWT令牌：">
              <el-input 
                v-model="decodeForm.token" 
                type="textarea"
                :rows="4"
                placeholder="请输入要解码的JWT令牌"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="decodeJwt">解码JWT</el-button>
              <el-button @click="clearDecodeFields">清空</el-button>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Header：">
                  <el-input 
                    v-model="decodedHeader" 
                    type="textarea"
                    :rows="6"
                    readonly
                    placeholder="Header部分"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Payload：">
                  <el-input 
                    v-model="decodedPayload" 
                    type="textarea"
                    :rows="6"
                    readonly
                    placeholder="Payload部分"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Signature：">
                  <el-input 
                    v-model="decodedSignature" 
                    type="textarea"
                    :rows="6"
                    readonly
                    placeholder="Signature部分"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <!-- 验证 -->
        <el-tab-pane label="JWT验证" name="verify">
          <el-form :model="verifyForm" label-position="top">
            <el-form-item label="JWT令牌：">
              <el-input 
                v-model="verifyForm.token" 
                type="textarea"
                :rows="4"
                placeholder="请输入要验证的JWT令牌"
                clearable
              />
            </el-form-item>

            <el-form-item label="密钥：">
              <el-input 
                v-model="verifyForm.secret" 
                type="textarea"
                :rows="2"
                placeholder="请输入验证密钥"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="verifyJwt">验证JWT</el-button>
              <el-button @click="clearVerifyFields">清空</el-button>
            </el-form-item>

            <el-form-item label="验证结果：">
              <el-input 
                v-model="verifyResult" 
                type="textarea"
                :rows="2"
                readonly
                :class="verifyResultType"
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
import CryptoJS from 'crypto-js';

export default {
  name: 'JwtTool',
  data() {
    return {
      activeTab: 'encode',
      encodeForm: {
        header: '{"alg": "HS256", "typ": "JWT"}',
        payload: '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}',
        secret: 'your-secret-key',
        result: ''
      },
      decodeForm: {
        token: ''
      },
      decodedHeader: '',
      decodedPayload: '',
      decodedSignature: '',
      verifyForm: {
        token: '',
        secret: ''
      },
      verifyResult: '',
      verifyResultType: 'is-info'
    };
  },
  methods: {
    // JWT编码
    encodeJwt() {
      try {
        // 解析Header和Payload
        let headerObj, payloadObj;
        
        try {
          headerObj = JSON.parse(this.encodeForm.header);
        } catch (e) {
          this.$message.error('Header JSON格式错误');
          return;
        }
        
        try {
          payloadObj = JSON.parse(this.encodeForm.payload);
        } catch (e) {
          this.$message.error('Payload JSON格式错误');
          return;
        }

        // Base64编码Header
        const headerStr = JSON.stringify(headerObj);
        const encodedHeader = this.base64UrlEncode(CryptoJS.enc.Utf8.parse(headerStr));

        // Base64编码Payload
        const payloadStr = JSON.stringify(payloadObj);
        const encodedPayload = this.base64UrlEncode(CryptoJS.enc.Utf8.parse(payloadStr));

        // 创建签名数据
        const signingInput = encodedHeader + '.' + encodedPayload;
        
        // 使用HMAC SHA256创建签名
        const signature = CryptoJS.HmacSHA256(signingInput, this.encodeForm.secret);
        const encodedSignature = this.base64UrlEncode(signature);

        // 组合JWT
        this.encodeForm.result = signingInput + '.' + encodedSignature;
        
        this.$message.success('JWT生成成功！');
      } catch (error) {
        this.$message.error(`JWT生成失败: ${error.message}`);
      }
    },

    // JWT解码
    decodeJwt() {
      if (!this.decodeForm.token) {
        this.$message.error('请输入JWT令牌');
        return;
      }

      try {
        const parts = this.decodeForm.token.split('.');
        if (parts.length !== 3) {
          this.$message.error('无效的JWT格式');
          return;
        }

        // 解码Header
        this.decodedHeader = this.formatJson(this.base64UrlDecode(parts[0]));
        
        // 解码Payload
        this.decodedPayload = this.formatJson(this.base64UrlDecode(parts[1]));
        
        // 显示Signature
        this.decodedSignature = parts[2];
        
        this.$message.success('JWT解码成功！');
      } catch (error) {
        this.$message.error(`JWT解码失败: ${error.message}`);
      }
    },

    // JWT验证
    verifyJwt() {
      if (!this.verifyForm.token) {
        this.$message.error('请输入JWT令牌');
        return;
      }

      if (!this.verifyForm.secret) {
        this.$message.error('请输入验证密钥');
        return;
      }

      try {
        const parts = this.verifyForm.token.split('.');
        if (parts.length !== 3) {
          this.$message.error('无效的JWT格式');
          return;
        }

        // 重新计算签名
        const signingInput = parts[0] + '.' + parts[1];
        const expectedSignature = CryptoJS.HmacSHA256(signingInput, this.verifyForm.secret);
        const encodedExpectedSignature = this.base64UrlEncode(expectedSignature);

        // 比较签名
        if (encodedExpectedSignature === parts[2]) {
          this.verifyResult = 'JWT验证成功！签名匹配。';
          this.verifyResultType = 'is-success';
        } else {
          this.verifyResult = 'JWT验证失败！签名不匹配。';
          this.verifyResultType = 'is-error';
        }
      } catch (error) {
        this.verifyResult = `JWT验证失败: ${error.message}`;
        this.verifyResultType = 'is-error';
      }
    },

    // Base64 URL编码
    base64UrlEncode(input) {
      let base64 = input.constructor === String ? 
        CryptoJS.enc.Utf8.parse(input).toString(CryptoJS.enc.Base64) : 
        input.toString(CryptoJS.enc.Base64);
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    },

    // Base64 URL解码
    base64UrlDecode(input) {
      // 补齐Base64字符串
      let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
    },

    // 格式化JSON
    formatJson(jsonStr) {
      try {
        return JSON.stringify(JSON.parse(jsonStr), null, 2);
      } catch (e) {
        return jsonStr;
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
      this.encodeForm.header = '{"alg": "HS256", "typ": "JWT"}';
      this.encodeForm.payload = '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}';
      this.encodeForm.secret = 'your-secret-key';
      this.encodeForm.result = '';
    },

    // 清空解码字段
    clearDecodeFields() {
      this.decodeForm.token = '';
      this.decodedHeader = '';
      this.decodedPayload = '';
      this.decodedSignature = '';
    },

    // 清空验证字段
    clearVerifyFields() {
      this.verifyForm.token = '';
      this.verifyForm.secret = '';
      this.verifyResult = '';
      this.verifyResultType = 'is-info';
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
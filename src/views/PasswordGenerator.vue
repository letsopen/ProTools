<template>
  <div class="converter">
    <el-page-header title="返回" content="🔑 密码生成器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="密码长度：">
              <el-slider 
                v-model="formData.length" 
                :min="4" 
                :max="128" 
                @change="generatePassword"
              />
              <div style="margin-top: 10px;">
                <el-tag type="info">{{ formData.length }} 位</el-tag>
              </div>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="生成数量：">
              <el-input-number 
                v-model="formData.count" 
                :min="1" 
                :max="10" 
                @change="generatePasswords"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">字符类型</el-divider>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-checkbox v-model="formData.includeUppercase" @change="generatePasswords">大写字母</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="formData.includeLowercase" @change="generatePasswords">小写字母</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="formData.includeNumbers" @change="generatePasswords">数字</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="formData.includeSymbols" @change="generatePasswords">符号</el-checkbox>
          </el-col>
        </el-row>

        <el-divider content-position="left">生成的密码</el-divider>

        <el-form-item label="密码列表：">
          <div v-for="(password, index) in formData.passwords" :key="index" class="password-item">
            <el-input 
              :value="password" 
              readonly
            >
              <template #append>
                <el-button @click="copyPassword(password)" size="small">复制</el-button>
              </template>
            </el-input>
          </div>
        </el-form-item>

        <el-divider />

        <el-button-group>
          <el-button type="primary" @click="generatePasswords">生成密码</el-button>
          <el-button @click="clearAll">清空</el-button>
        </el-button-group>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PasswordGenerator',
  data() {
    return {
      formData: {
        length: 12,
        count: 1,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        passwords: []
      }
    }
  },
  mounted() {
    this.generatePasswords();
  },
  methods: {
    generatePasswords() {
      this.formData.passwords = [];
      for (let i = 0; i < this.formData.count; i++) {
        this.formData.passwords.push(this.generatePassword());
      }
    },
    generatePassword() {
      let chars = '';
      if (this.formData.includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (this.formData.includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (this.formData.includeNumbers) chars += '0123456789';
      if (this.formData.includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (chars === '') {
        return '请选择至少一种字符类型';
      }

      let password = '';
      for (let i = 0; i < this.formData.length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return password;
    },
    copyPassword(password) {
      navigator.clipboard.writeText(password).then(() => {
        this.$message.success('密码已复制到剪贴板');
      });
    },
    clearAll() {
      this.formData.length = 12;
      this.formData.count = 1;
      this.formData.includeUppercase = true;
      this.formData.includeLowercase = true;
      this.formData.includeNumbers = true;
      this.formData.includeSymbols = true;
      this.generatePasswords();
    }
  }
}
</script>

<style scoped>
.converter {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.converter-container {
  margin-top: 1rem;
}

.el-divider {
  margin: 20px 0;
}

.password-item {
  margin-bottom: 10px;
}
</style>
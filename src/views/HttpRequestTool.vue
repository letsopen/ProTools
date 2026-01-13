<template>
  <div class="converter">
    <el-page-header title="返回" content="🌐 HTTP请求工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="请求方法：">
              <el-select 
                v-model="formData.method" 
                placeholder="选择方法"
                @change="updateSampleHeaders"
                style="width: 100%"
              >
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
                <el-option label="PATCH" value="PATCH" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="20">
            <el-form-item label="请求URL：">
              <el-input 
                v-model="formData.url" 
                placeholder="输入请求URL，例如: https://api.example.com/data"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="请求头：">
          <el-input 
            v-model="formData.headers" 
            type="textarea"
            :rows="3"
            placeholder='输入请求头，每行一个，格式为 "键: 值"，例如:&#10;Content-Type: application/json&#10;Authorization: Bearer token123'
            clearable
          />
        </el-form-item>

        <el-form-item label="请求体（仅适用于POST/PUT/PATCH等）：">
          <el-input 
            v-model="formData.body" 
            type="textarea"
            :rows="6"
            placeholder="输入请求体内容（JSON、文本等）"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sendRequest" :loading="loading">发送请求</el-button>
          <el-button @click="clearAll">清空</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">响应结果</el-divider>

      <div v-if="response.status" class="response-info">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-tag :type="getResponseStatusType(response.status)">状态码: {{ response.status }}</el-tag>
          </el-col>
          <el-col :span="18">
            <el-tag type="info">响应时间: {{ response.duration }}ms</el-tag>
            <el-tag type="info" style="margin-left: 10px;">响应大小: {{ responseSize }} bytes</el-tag>
          </el-col>
        </el-row>
      </div>

      <el-tabs v-model="activeTab" style="margin-top: 20px;">
        <el-tab-pane label="响应体" name="body">
          <el-input 
            v-model="response.body" 
            type="textarea"
            :rows="10"
            readonly 
            placeholder="响应内容将显示在这里"
          />
        </el-tab-pane>
        <el-tab-pane label="响应头" name="headers">
          <el-input 
            v-model="response.headers" 
            type="textarea"
            :rows="10"
            readonly 
            placeholder="响应头信息将显示在这里"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HttpRequestTool',
  data() {
    return {
      loading: false,
      activeTab: 'body',
      formData: {
        method: 'GET',
        url: 'https://httpbin.org/get',
        headers: 'Content-Type: application/json',
        body: ''
      },
      response: {
        status: '',
        body: '',
        headers: '',
        duration: 0
      }
    }
  },
  computed: {
    responseSize() {
      return this.response.body ? new Blob([this.response.body]).size : 0;
    }
  },
  methods: {
    async sendRequest() {
      if (!this.formData.url) {
        this.$message.error('请输入请求URL');
        return;
      }

      this.loading = true;
      const startTime = Date.now();

      try {
        // 解析请求头
        const headers = {};
        if (this.formData.headers) {
          this.formData.headers.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              headers[key.trim()] = valueParts.join(':').trim();
            }
          });
        }

        // 构建请求选项
        const options = {
          method: this.formData.method,
          headers: headers
        };

        // 如果是POST、PUT或PATCH请求，添加请求体
        if (['POST', 'PUT', 'PATCH'].includes(this.formData.method) && this.formData.body) {
          options.body = this.formData.body;
          // 如果Content-Type是application/json，尝试解析body为JSON
          if (headers['Content-Type'] === 'application/json') {
            try {
              options.body = JSON.stringify(JSON.parse(this.formData.body));
            } catch (e) {
              // 如果不是有效的JSON，则使用原始字符串
            }
          }
        }

        // 发送请求
        const response = await fetch(this.formData.url, options);
        
        // 获取响应数据
        const responseBody = await response.text();
        const responseHeaders = [];
        for (const [key, value] of response.headers.entries()) {
          responseHeaders.push(`${key}: ${value}`);
        }

        // 更新响应数据
        this.response = {
          status: response.status,
          body: responseBody,
          headers: responseHeaders.join('\n'),
          duration: Date.now() - startTime
        };

        this.$message.success(`请求成功，状态码: ${response.status}`);
      } catch (error) {
        this.response = {
          status: 'Error',
          body: error.message,
          headers: '',
          duration: Date.now() - startTime
        };
        this.$message.error(`请求失败: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    getResponseStatusType(status) {
      if (status >= 200 && status < 300) return 'success';
      if (status >= 300 && status < 400) return 'warning';
      if (status >= 400 && status < 500) return 'info';
      if (status >= 500) return 'danger';
      return 'info';
    },
    updateSampleHeaders() {
      if (this.formData.method === 'POST' || this.formData.method === 'PUT' || this.formData.method === 'PATCH') {
        if (!this.formData.headers.includes('Content-Type')) {
          this.formData.headers = 'Content-Type: application/json\n' + this.formData.headers;
        }
      }
    },
    clearAll() {
      this.formData.method = 'GET';
      this.formData.url = '';
      this.formData.headers = 'Content-Type: application/json';
      this.formData.body = '';
      this.response = {
        status: '',
        body: '',
        headers: '',
        duration: 0
      };
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

.response-info {
  margin-top: 10px;
}
</style>
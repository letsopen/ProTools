<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>ProTools 工具集</h1>
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          router
          class="el-menu-demo"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/timestamp">时间戳转换</el-menu-item>
          <el-menu-item index="/number-converter">数字大小写转换</el-menu-item>
          <el-menu-item index="/base64">Base64编码解码</el-menu-item>
          <el-menu-item index="/hash">哈希计算</el-menu-item>
          <el-menu-item index="/json-formatter">JSON格式化</el-menu-item>
          <el-menu-item index="/url-coder">URL编解码</el-menu-item>
          <el-menu-item index="/number-base-converter">进制转换</el-menu-item>
          <el-menu-item index="/color-converter">颜色转换</el-menu-item>
          <el-menu-item index="/text-utils">文本处理</el-menu-item>
          <el-menu-item index="/password-generator">密码生成</el-menu-item>
          <el-menu-item index="/time-calculator">时间计算</el-menu-item>
          <el-menu-item index="/unit-converter">单位转换</el-menu-item>
          <el-menu-item index="/qrcode-generator">二维码生成</el-menu-item>
          <el-menu-item index="/regex-tester">正则测试</el-menu-item>
          <el-menu-item index="/checksum-tool">校验和</el-menu-item>
          <el-menu-item index="/http-request">HTTP请求</el-menu-item>
          <el-menu-item index="/code-minifier">代码压缩</el-menu-item>
                    <el-menu-item index="/rsa-tool">RSA加密工具</el-menu-item>
                    <el-menu-item index="/sm2-tool">SM2国密工具</el-menu-item>
                              <el-menu-item index="/aes-tool">AES加密工具</el-menu-item>
                              <el-menu-item index="/sm4-tool">SM4国密工具</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        ProTools 工具集 ©2026
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '/'
    }
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.el-header {
  background-color: #34495e;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.el-header h1 {
  color: white;
  margin: 0;
  flex: 1;
}

.el-menu {
  border-bottom: none;
  background-color: transparent;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.el-menu-item {
  color: white;
  height: 60px;
  line-height: 60px;
}

.el-menu-item:hover {
  background-color: #42b883 !important;
}

.el-menu-item.is-active {
  background-color: #42b883;
  color: white;
}

.el-main {
  padding: 20px;
}

.el-footer {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>

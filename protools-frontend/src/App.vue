<template>
  <div id="app">
    <nav class="navbar">
      <h1>ProTools 工具集</h1>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/timestamp">时间戳转换</router-link></li>
        <li><router-link to="/number-converter">数字大小写转换</router-link></li>
        <li><router-link to="/base64">Base64编码解码</router-link></li>
        <li><router-link to="/hash">哈希计算</router-link></li>
      </ul>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.navbar {
  background-color: #34495e;
  padding: 1rem;
  margin-bottom: 1rem;
}

.navbar h1 {
  color: white;
  margin: 0;
  text-align: center;
}

.navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navbar li {
  margin: 0 1rem;
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar a:hover,
.navbar a.router-link-active {
  background-color: #42b883;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}
</style>

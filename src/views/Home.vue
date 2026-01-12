<template>
  <div class="home">
    <h2>欢迎使用ProTools工具集</h2>
    <p>这是一个实用的前端工具集合，包含多种常用的转换和计算功能。</p>
    <div class="tools-grid">
      <div class="tool-card">
        <h3>⏰ 时间戳转换</h3>
        <p>Unix时间戳与日期时间相互转换</p>
      </div>
      <div class="tool-card">
        <h3>🔢 数字大小写转换</h3>
        <p>阿拉伯数字与中文大写数字相互转换</p>
      </div>
      <div class="tool-card">
        <h3>🔓 Base64编解码</h3>
        <p>文本与Base64格式相互转换</p>
      </div>
      <div class="tool-card">
        <h3>🔒 哈希计算</h3>
        <p>MD5、SHA等多种哈希算法</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.tool-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-card h3 {
  margin-top: 0;
  color: #34495e;
}
</style>
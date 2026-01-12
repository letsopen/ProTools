<template>
  <div class="home">
    <p>这是一个实用的前端工具集合，包含多种常用的转换和计算功能。</p>
    <el-row :gutter="20" class="tools-grid">
      <el-col :span="6" v-for="tool in tools" :key="tool.name">
        <el-card class="tool-card" shadow="hover" @click="goToTool(tool.route)">
          <div class="tool-icon">{{ tool.icon }}</div>
          <h3>{{ tool.name }}</h3>
          <p>{{ tool.description }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      tools: [
        {
          name: '时间戳转换',
          icon: '⏰',
          description: 'Unix时间戳与日期时间相互转换',
          route: '/timestamp'
        },
        {
          name: '数字大小写转换',
          icon: '🔢',
          description: '阿拉伯数字与中文大写数字相互转换',
          route: '/number-converter'
        },
        {
          name: 'Base64编解码',
          icon: '🔓',
          description: '文本与Base64格式相互转换',
          route: '/base64'
        },
        {
          name: '哈希计算',
          icon: '🔒',
          description: 'MD5、SHA等多种哈希算法',
          route: '/hash'
        }
      ]
    }
  },
  methods: {
    goToTool(route) {
      this.$router.push(route);
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

.tools-grid {
  margin-top: 2rem;
}

.tool-card {
  cursor: pointer;
  text-align: center;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.tool-card h3 {
  margin: 10px 0 5px 0;
  font-size: 1.1rem;
}

.tool-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #606266;
}
</style>
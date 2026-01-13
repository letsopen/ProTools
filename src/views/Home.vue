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
        },
        {
          name: 'JSON格式化',
          icon: '📋',
          description: '格式化、验证和压缩JSON数据',
          route: '/json-formatter'
        },
        {
          name: 'URL编解码',
          icon: '🌐',
          description: 'URL编码和解码工具',
          route: '/url-coder'
        },
        {
          name: '进制转换',
          icon: '🔄',
          description: '二进制、八进制、十进制、十六进制转换',
          route: '/number-base-converter'
        },
        {
          name: '颜色转换',
          icon: '🎨',
          description: 'HEX、RGB、HSL颜色值转换',
          route: '/color-converter'
        },
        {
          name: '文本处理',
          icon: '📝',
          description: '文本大小写转换、排序、统计等',
          route: '/text-utils'
        },
        {
          name: '密码生成',
          icon: '🔑',
          description: '生成安全的随机密码',
          route: '/password-generator'
        },
        {
          name: '时间计算',
          icon: '⏰',
          description: '时间加减、时间差计算',
          route: '/time-calculator'
        },
        {
          name: '单位转换',
          icon: '📐',
          description: '长度、重量、温度等多种单位转换',
          route: '/unit-converter'
        },
        {
          name: '二维码生成',
          icon: '📱',
          description: '生成文本或网址的二维码',
          route: '/qrcode-generator'
        },
        {
          name: '正则测试',
          icon: '🔍',
          description: '测试正则表达式的匹配效果',
          route: '/regex-tester'
        },
        {
          name: '校验和',
          icon: '✅',
          description: 'CRC32、Adler32等校验算法',
          route: '/checksum-tool'
        },
        {
          name: 'HTTP请求',
          icon: '🌐',
          description: '发送GET/POST等HTTP请求',
          route: '/http-request'
        },
        {
          name: '代码压缩',
          icon: '✂️',
          description: 'HTML、CSS、JavaScript代码压缩',
          route: '/code-minifier'
        },
        {
          name: 'RSA加密工具',
          icon: '🔐',
          description: 'RSA密钥生成、加密解密、密钥验证',
          route: '/rsa-tool'
        },
        {
          name: 'SM2国密工具',
          icon: '🇨🇳',
          description: 'SM2密钥生成、加密解密、密钥验证',
          route: '/sm2-tool'
        },
        {
          name: 'AES加密工具',
          icon: '🔐',
          description: 'AES密钥生成、加密解密',
          route: '/aes-tool'
        },
        {
          name: 'SM4国密工具',
          icon: '🇨🇳',
          description: 'SM4密钥生成、加密解密',
          route: '/sm4-tool'
        },
        {
          name: 'ECC椭圆曲线工具',
          icon: '🔒',
          description: 'ECC密钥生成、签名验证',
          route: '/ecc-tool'
        },
        {
          name: 'JWT工具',
          icon: '🗝️',
          description: 'JWT编码、解码、验证',
          route: '/jwt-tool'
        },
        {
          name: 'Base32编码解码',
          icon: '🔓',
          description: 'Base32编码与解码',
          route: '/base32-tool'
        },
        {
          name: 'Hex/Binary转换',
          icon: '🔄',
          description: '十六进制与二进制转换',
          route: '/hex-binary-tool'
        },
        {
          name: '数字证书工具',
          icon: '📜',
          description: 'X.509证书信息查看和验证',
          route: '/certificate-tool'
        },
        {
          name: '文本Diff对比',
          icon: '🔍',
          description: '对比两个文本的差异',
          route: '/diff-tool'
        },
        {
          name: '图片Base64转换',
          icon: '🖼️',
          description: '图片与Base64编码互转',
          route: '/image-base64-tool'
        },
        {
          name: 'CSV/JSON互转',
          icon: '📊',
          description: 'CSV与JSON格式转换',
          route: '/csv-json-tool'
        },
        {
          name: 'XML格式化',
          icon: '📋',
          description: 'XML格式化和验证',
          route: '/xml-tool'
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
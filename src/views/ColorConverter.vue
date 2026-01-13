<template>
  <div class="converter">
    <el-page-header title="返回" content="🎨 颜色转换器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="选择颜色：">
          <el-color-picker 
            v-model="formData.hexColor" 
            @change="convertColor"
            show-alpha
          />
        </el-form-item>
        
        <el-form-item label="或输入颜色值：">
          <el-input 
            v-model="formData.inputColor" 
            placeholder="输入HEX/RGB/HSL颜色值"
            @input="parseInputColor"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">颜色值转换结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="HEX (十六进制)：">
            <el-input v-model="formData.hexColor" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="RGB：">
            <el-input v-model="formData.rgbColor" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="HSL：">
            <el-input v-model="formData.hslColor" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <div class="color-preview" :style="{ backgroundColor: formData.hexColor }">
        <span class="color-label">颜色预览</span>
      </div>

      <el-divider />

      <el-button-group>
        <el-button @click="copyHex">复制HEX</el-button>
        <el-button @click="copyRgb">复制RGB</el-button>
        <el-button @click="copyHsl">复制HSL</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ColorConverter',
  data() {
    return {
      formData: {
        hexColor: '#409EFF',
        inputColor: '',
        rgbColor: 'rgb(64, 158, 255)',
        hslColor: 'hsl(210, 100%, 63%)'
      }
    }
  },
  mounted() {
    this.convertColor(this.formData.hexColor);
  },
  methods: {
    convertColor(color) {
      if (!color) return;
      
      // 如果是HEX格式，转换为RGB和HSL
      if (color.startsWith('#')) {
        this.formData.hexColor = color;
        this.hexToRgb(color);
        this.hexToHsl(color);
      } else if (color.startsWith('rgb')) {
        // 如果是RGB格式，转换为HEX和HSL
        this.rgbToHex(color);
        this.rgbToHsl(color);
      } else if (color.startsWith('hsl')) {
        // 如果是HSL格式，转换为HEX和RGB
        this.hslToHex(color);
        this.hslToRgb(color);
      }
    },
    hexToRgb(hex) {
      // 移除#号
      hex = hex.replace('#', '');
      
      // 处理简写 #fff -> #ffffff
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      this.formData.rgbColor = `rgb(${r}, ${g}, ${b})`;
    },
    hexToHsl(hex) {
      // 移除#号
      hex = hex.replace('#', '');
      
      // 处理简写 #fff -> #ffffff
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = h / 6;
      }
      
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      this.formData.hslColor = `hsl(${h}, ${s}%, ${l}%)`;
    },
    rgbToHex(rgb) {
      const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (!match) return '';
      
      const [r, g, b] = match.slice(1).map(Number);
      const hex = [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      this.formData.hexColor = `#${hex}`;
    },
    rgbToHsl(rgb) {
      const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (!match) return '';
      
      let [r, g, b] = match.slice(1).map(Number);
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = h / 6;
      }
      
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      this.formData.hslColor = `hsl(${h}, ${s}%, ${l}%)`;
    },
    hslToHex(hsl) {
      const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
      if (!match) return '';
      
      let [h, s, l] = match.slice(1).map(Number);
      s /= 100;
      l /= 100;
      
      const a = s * Math.min(l, 1 - l);
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      
      const hex = `${f(0)}${f(8)}${f(4)}`;
      this.formData.hexColor = `#${hex}`;
    },
    hslToRgb(hsl) {
      const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
      if (!match) return '';
      
      let [h, s, l] = match.slice(1).map(Number);
      s /= 100;
      l /= 100;
      
      const a = s * Math.min(l, 1 - l);
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
      };
      
      this.formData.rgbColor = `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
    },
    parseInputColor() {
      const input = this.formData.inputColor.trim();
      
      if (input.startsWith('#') || input.startsWith('rgb') || input.startsWith('hsl')) {
        this.convertColor(input);
      }
    },
    copyHex() {
      if (this.formData.hexColor) {
        navigator.clipboard.writeText(this.formData.hexColor).then(() => {
          this.$message.success('HEX颜色值已复制到剪贴板');
        });
      }
    },
    copyRgb() {
      if (this.formData.rgbColor) {
        navigator.clipboard.writeText(this.formData.rgbColor).then(() => {
          this.$message.success('RGB颜色值已复制到剪贴板');
        });
      }
    },
    copyHsl() {
      if (this.formData.hslColor) {
        navigator.clipboard.writeText(this.formData.hslColor).then(() => {
          this.$message.success('HSL颜色值已复制到剪贴板');
        });
      }
    },
    clearAll() {
      this.formData.hexColor = '#409EFF';
      this.formData.inputColor = '';
      this.convertColor('#409EFF');
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

.color-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
</style>
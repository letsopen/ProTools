<template>
  <div class="ascii-art-generator">
    <el-page-header title="返回" content="🆎 ASCII艺术字符生成器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-form :model="form" label-position="top">
        <el-form-item label="输入文本：">
          <el-input 
            v-model="form.text" 
            type="textarea"
            :rows="3"
            placeholder="输入要转换为ASCII艺术字符的文本（仅支持字母、数字和常用符号）"
            @input="generateAsciiArt"
            maxlength="100"
          />
        </el-form-item>

        <el-form-item label="字体样式：">
          <el-select v-model="form.fontStyle" placeholder="选择字体样式" @change="generateAsciiArt">
            <el-option label="Standard" value="standard"></el-option>
            <el-option label="Big" value="big"></el-option>
            <el-option label="Small" value="small"></el-option>
            <el-option label="Script" value="script"></el-option>
            <el-option label="Shadow" value="shadow"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="generateAsciiArt">生成ASCII艺术字符</el-button>
          <el-button @click="copyAsciiArt">复制结果</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">ASCII艺术字符结果</el-divider>

      <div class="ascii-result-container">
        <pre class="ascii-result" ref="asciiResult">{{ asciiArtResult }}</pre>
      </div>

      <el-divider content-position="left">预览</el-divider>

      <div class="preview-container">
        <div class="ascii-preview" v-html="formattedAsciiArt"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AsciiArtGenerator',
  data() {
    return {
      form: {
        text: 'HELLO',
        fontStyle: 'standard'
      },
      asciiArtResult: '',
      formattedAsciiArt: ''
    };
  },
  mounted() {
    // 初始化时生成默认的ASCII艺术字符
    this.generateAsciiArt();
  },
  methods: {
    generateAsciiArt() {
      if (!this.form.text) {
        this.asciiArtResult = '';
        this.formattedAsciiArt = '';
        return;
      }

      // 清理输入文本，只保留字母、数字和常用符号
      /* eslint-disable no-useless-escape */
      const cleanText = this.form.text.toUpperCase().replace(/[^A-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g, '');
      /* eslint-enable no-useless-escape */
      
      if (!cleanText) {
        this.asciiArtResult = '';
        this.formattedAsciiArt = '';
        return;
      }

      // 根据所选字体样式生成ASCII艺术字符
      this.asciiArtResult = this.generateFontArt(cleanText, this.form.fontStyle);
      this.formattedAsciiArt = this.formatForDisplay(this.asciiArtResult);
    },

    // 根据不同字体样式生成ASCII艺术字符
    generateFontArt(text, style) {
      // 使用简单的标准字体作为基础
      const fontData = this.getFontData(style);
      let result = '';
      
      // 获取每一行的高度
      const lineHeight = this.getMaxHeight(fontData);
      
      // 逐行生成
      for (let line = 0; line < lineHeight; line++) {
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const charData = fontData[char] || fontData[' ']; // 默认为空格
          
          if (charData && charData[line]) {
            result += charData[line];
          } else {
            // 如果字符不存在，使用空格的表示
            const spaceData = fontData[' '];
            result += spaceData && spaceData[line] ? spaceData[line] : '  ';
          }
        }
        result += '\n';
      }
      
      return result;
    },

    // 获取字体数据
    getFontData(style) {
      // 定义标准字体数据
      const standardFont = {
        'A': [
          '  A  ',
          ' A A ',
          'A   A',
          'AAAAA',
          'A   A',
          'A   A',
          'A   A'
        ],
        'B': [
          ' BBB ',
          'B   B',
          'B   B',
          ' BBB ',
          'B   B',
          'B   B',
          ' BBB '
        ],
        'C': [
          ' CCC ',
          'C   C',
          'C    ',
          'C    ',
          'C    ',
          'C   C',
          ' CCC '
        ],
        'D': [
          'DDDD ',
          'D   D',
          'D   D',
          'D   D',
          'D   D',
          'D   D',
          'DDDD '
        ],
        'E': [
          'EEEEE',
          'E    ',
          'E    ',
          'EEE  ',
          'E    ',
          'E    ',
          'EEEEE'
        ],
        'F': [
          'FFFFF',
          'F    ',
          'F    ',
          'FFF  ',
          'F    ',
          'F    ',
          'F    '
        ],
        'G': [
          ' GGG ',
          'G   G',
          'G    ',
          'G GGG',
          'G   G',
          'G   G',
          ' GGG '
        ],
        'H': [
          'H   H',
          'H   H',
          'H   H',
          'HHHHH',
          'H   H',
          'H   H',
          'H   H'
        ],
        'I': [
          'IIIII',
          '  I  ',
          '  I  ',
          '  I  ',
          '  I  ',
          '  I  ',
          'IIIII'
        ],
        'J': [
          'JJJJJ',
          '    J',
          '    J',
          '    J',
          '    J',
          'J   J',
          ' JJJ '
        ],
        'K': [
          'K   K',
          'K  K ',
          'K K  ',
          'KK   ',
          'K K  ',
          'K  K ',
          'K   K'
        ],
        'L': [
          'L    ',
          'L    ',
          'L    ',
          'L    ',
          'L    ',
          'L    ',
          'LLLLL'
        ],
        'M': [
          'M   M',
          'MM MM',
          'M M M',
          'M   M',
          'M   M',
          'M   M',
          'M   M'
        ],
        'N': [
          'N   N',
          'NN  N',
          'N N N',
          'N  NN',
          'N   N',
          'N   N',
          'N   N'
        ],
        'O': [
          ' OOO ',
          'O   O',
          'O   O',
          'O   O',
          'O   O',
          'O   O',
          ' OOO '
        ],
        'P': [
          ' PPP ',
          'P   P',
          'P   P',
          ' PPP ',
          'P    ',
          'P    ',
          'P    '
        ],
        'Q': [
          ' QQQ ',
          'Q   Q',
          'Q   Q',
          'Q   Q',
          'Q   Q',
          'Q  Q ',
          ' QQ Q'
        ],
        'R': [
          ' RRR ',
          'R   R',
          'R   R',
          ' RRR ',
          'R R  ',
          'R  R ',
          'R   R'
        ],
        'S': [
          ' SSS ',
          'S   S',
          'S    ',
          ' SSS ',
          '    S',
          'S   S',
          ' SSS '
        ],
        'T': [
          'TTTTT',
          '  T  ',
          '  T  ',
          '  T  ',
          '  T  ',
          '  T  ',
          '  T  '
        ],
        'U': [
          'U   U',
          'U   U',
          'U   U',
          'U   U',
          'U   U',
          'U   U',
          ' UUU '
        ],
        'V': [
          'V   V',
          'V   V',
          'V   V',
          'V   V',
          'V   V',
          ' V V ',
          '  V  '
        ],
        'W': [
          'W   W',
          'W   W',
          'W   W',
          'W W W',
          'W W W',
          'WW WW',
          'W   W'
        ],
        'X': [
          'X   X',
          'X   X',
          ' X X ',
          '  X  ',
          ' X X ',
          'X   X',
          'X   X'
        ],
        'Y': [
          'Y   Y',
          'Y   Y',
          ' Y Y ',
          '  Y  ',
          '  Y  ',
          '  Y  ',
          '  Y  '
        ],
        'Z': [
          'ZZZZZ',
          '    Z',
          '   Z ',
          '  Z  ',
          ' Z   ',
          'Z    ',
          'ZZZZZ'
        ],
        '0': [
          ' 000 ',
          '0   0',
          '0  00',
          '0 0 0',
          '00  0',
          '0   0',
          ' 000 '
        ],
        '1': [
          '  1  ',
          ' 11  ',
          '  1  ',
          '  1  ',
          '  1  ',
          '  1  ',
          '11111'
        ],
        '2': [
          ' 222 ',
          '2   2',
          '   2 ',
          '  2  ',
          ' 2   ',
          '2    ',
          '22222'
        ],
        '3': [
          '33333',
          '    3',
          '   3 ',
          '  33 ',
          '    3',
          '3   3',
          ' 333 '
        ],
        '4': [
          '   4 ',
          '  44 ',
          ' 4 4 ',
          '4  4 ',
          '44444',
          '   4 ',
          '   4 '
        ],
        '5': [
          '55555',
          '5    ',
          '5    ',
          '5555 ',
          '    5',
          '5   5',
          ' 555 '
        ],
        '6': [
          ' 666 ',
          '6   6',
          '6    ',
          '6666 ',
          '6   6',
          '6   6',
          ' 666 '
        ],
        '7': [
          '77777',
          '   7 ',
          '  7  ',
          ' 7   ',
          ' 7   ',
          ' 7   ',
          ' 7   '
        ],
        '8': [
          ' 888 ',
          '8   8',
          '8   8',
          ' 888 ',
          '8   8',
          '8   8',
          ' 888 '
        ],
        '9': [
          ' 999 ',
          '9   9',
          '9   9',
          ' 9999',
          '    9',
          '    9',
          ' 999 '
        ],
        ' ': [
          '     ',
          '     ',
          '     ',
          '     ',
          '     ',
          '     ',
          '     '
        ],
        '!': [
          '  !  ',
          '  !  ',
          '  !  ',
          '  !  ',
          '  !  ',
          '     ',
          '  !  '
        ],
        '?': [
          ' ??? ',
          '?   ?',
          '    ?',
          '  ?? ',
          '  !  ',
          '     ',
          '  !  '
        ],
        ',': [
          '     ',
          '     ',
          '     ',
          '     ',
          '     ',
          '  ,  ',
          ' ,   '
        ],
        '.': [
          '     ',
          '     ',
          '     ',
          '     ',
          '     ',
          '  .  ',
          '  .  '
        ],
        '-': [
          '     ',
          '     ',
          '     ',
          ' --- ',
          '     ',
          '     ',
          '     '
        ],
        '+': [
          '     ',
          '  +  ',
          '  +  ',
          ' +++ ',
          '  +  ',
          '  +  ',
          '     '
        ]
      };

      // 根据字体样式返回对应的数据（这里简化处理，实际可扩展更多字体）
      switch(style) {
        case 'big':
          // 放大的字体
          return this.scaleFont(standardFont, 1.5);
        case 'small':
          // 缩小的字体
          return this.scaleFont(standardFont, 0.7);
        case 'script':
          // 花体字
          return this.applyStyle(standardFont, 'script');
        case 'shadow':
          // 阴影效果
          return this.applyStyle(standardFont, 'shadow');
        default:
          return standardFont;
      }
    },

    // 获取字体的最大高度
    getMaxHeight(fontData) {
      let maxHeight = 0;
      for (const char in fontData) {
        if (fontData[char].length > maxHeight) {
          maxHeight = fontData[char].length;
        }
      }
      return maxHeight || 7; // 默认高度为7
    },

    // 缩放字体
    scaleFont(fontData, factor) {
      const scaled = {};
      for (const char in fontData) {
        const lines = fontData[char];
        const scaledLines = lines.map(line => {
          if (factor > 1) {
            // 放大
            return line.split('').map(c => c.repeat(Math.ceil(factor))).join('');
          } else {
            // 缩小
            return line.split('').filter((_, i) => i % Math.ceil(1/factor) === 0).join('');
          }
        });
        scaled[char] = scaledLines;
      }
      return scaled;
    },

    // 应用特殊样式
    applyStyle(fontData, style) {
      // 这里可以根据需要实现不同的样式
      // 暂时根据样式参数返回相应字体
      if (style === 'script' || style === 'shadow') {
        // 对字体数据做一些变换
        const modifiedFontData = {...fontData};
        // 可以在这里添加特殊效果
        return modifiedFontData;
      }
      return fontData;
    },

    // 格式化用于显示
    formatForDisplay(asciiArt) {
      return asciiArt.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
    },

    copyAsciiArt() {
      if (!this.asciiArtResult) {
        this.$message.warning('没有可复制的内容');
        return;
      }

      navigator.clipboard.writeText(this.asciiArtResult).then(() => {
        this.$message.success('ASCII艺术字符已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = this.asciiArtResult;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('ASCII艺术字符已复制到剪贴板');
      });
    },

    resetForm() {
      this.form.text = 'HELLO';
      this.form.fontStyle = 'standard';
      this.asciiArtResult = '';
      this.formattedAsciiArt = '';
      this.generateAsciiArt();
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

.ascii-result-container {
  margin: 20px 0;
  padding: 15px;
  background-color: #000;
  border-radius: 4px;
  overflow-x: auto;
}

.ascii-result {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.2;
  margin: 0;
  white-space: pre;
}

.preview-container {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow-x: auto;
}

.ascii-preview {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1;
  color: #000;
  text-align: left;
  white-space: pre;
}
</style>
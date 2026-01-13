<template>
  <div class="converter">
    <el-page-header title="返回" content="🔍 正则表达式测试器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="正则表达式：">
          <el-input 
            v-model="formData.pattern" 
            placeholder="输入正则表达式，例如: \d+"
            @input="testRegex"
            clearable
          >
            <template #prepend>/</template>
            <template #append>
              <el-checkbox v-model="formData.flags.global" @change="testRegex">g</el-checkbox>
              <el-checkbox v-model="formData.flags.ignoreCase" @change="testRegex" style="margin-left: 5px;">i</el-checkbox>
              <el-checkbox v-model="formData.flags.multiline" @change="testRegex" style="margin-left: 5px;">m</el-checkbox>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="测试文本：">
          <el-input 
            v-model="formData.testText" 
            type="textarea"
            :rows="6"
            placeholder="输入要测试的文本"
            @input="testRegex"
            clearable
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">测试结果</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="匹配结果：">
            <el-input 
              v-model="formData.matches" 
              type="textarea"
              :rows="6"
              readonly 
              placeholder="匹配的结果将显示在这里"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="替换结果（可选）：">
            <el-input 
              v-model="formData.replacement" 
              placeholder="替换文本（可选）"
              @input="performReplace"
              style="margin-bottom: 10px;"
              clearable
            />
            <el-input 
              v-model="formData.replacedText" 
              type="textarea"
              :rows="5"
              readonly 
              placeholder="替换后的文本将显示在这里"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider />

      <div class="stats">
        <el-tag type="info">匹配次数: {{ formData.matchCount }}</el-tag>
        <el-tag type="info" style="margin-left: 10px;">匹配组数: {{ formData.groupCount }}</el-tag>
        <el-tag :type="formData.isValid ? 'success' : 'danger'" style="margin-left: 10px;">
          {{ formData.isValid ? '有效正则' : '无效正则' }}
        </el-tag>
      </div>

      <el-divider />

      <el-button-group>
        <el-button type="primary" @click="testRegex">测试</el-button>
        <el-button @click="performReplace">替换</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>

      <el-divider content-position="left">常用正则表达式</el-divider>

      <div class="presets">
        <el-button 
          v-for="preset in presets" 
          :key="preset.name"
          size="small" 
          @click="loadPreset(preset)"
          style="margin-right: 10px; margin-bottom: 10px;"
        >
          {{ preset.name }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RegexTester',
  data() {
    return {
      formData: {
        pattern: '\\d+',
        testText: '这里有数字123和更多的数字4567',
        replacement: '',
        matches: '',
        replacedText: '',
        matchCount: 0,
        groupCount: 0,
        isValid: true,
        flags: {
          global: true,
          ignoreCase: false,
          multiline: false
        }
      },
      presets: [
        { name: '邮箱', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        { name: '手机号', pattern: '^1[3-9]\\d{9}$' },
        { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
        { name: 'IP地址', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' },
        { name: '身份证号', pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$' },
        { name: '数字', pattern: '\\d+' },
        { name: '中文', pattern: '[\\u4e00-\\u9fa5]+' },
        { name: '用户名', pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,15}$' }
      ]
    }
  },
  mounted() {
    this.testRegex();
  },
  methods: {
    testRegex() {
      if (!this.formData.pattern) {
        this.resetResults();
        return;
      }

      try {
        // 构建标志
        let flags = '';
        if (this.formData.flags.global) flags += 'g';
        if (this.formData.flags.ignoreCase) flags += 'i';
        if (this.formData.flags.multiline) flags += 'm';

        // 创建正则表达式对象
        const regex = new RegExp(this.formData.pattern, flags);
        
        // 执行匹配
        const matches = this.formData.testText.match(regex);
        
        // 更新结果
        if (matches) {
          this.formData.matches = JSON.stringify(matches, null, 2);
          this.formData.matchCount = matches.length;
          this.formData.groupCount = matches.length > 0 ? matches[0].length : 0;
          this.formData.isValid = true;
        } else {
          this.formData.matches = '无匹配';
          this.formData.matchCount = 0;
          this.formData.groupCount = 0;
          this.formData.isValid = true;
        }
        
        // 执行替换（如果有替换文本）
        if (this.formData.replacement) {
          this.performReplace();
        }
      } catch (e) {
        this.resetResults();
        this.formData.isValid = false;
        this.formData.matches = `错误: ${e.message}`;
      }
    },
    performReplace() {
      if (!this.formData.pattern || !this.formData.replacement) {
        this.formData.replacedText = this.formData.testText;
        return;
      }

      try {
        let flags = '';
        if (this.formData.flags.global) flags += 'g';
        if (this.formData.flags.ignoreCase) flags += 'i';
        if (this.formData.flags.multiline) flags += 'm';

        const regex = new RegExp(this.formData.pattern, flags);
        this.formData.replacedText = this.formData.testText.replace(regex, this.formData.replacement);
      } catch (e) {
        this.formData.replacedText = `替换错误: ${e.message}`;
      }
    },
    loadPreset(preset) {
      this.formData.pattern = preset.pattern;
      this.testRegex();
    },
    resetResults() {
      this.formData.matches = '';
      this.formData.replacedText = this.formData.testText;
      this.formData.matchCount = 0;
      this.formData.groupCount = 0;
    },
    clearAll() {
      this.formData.pattern = '';
      this.formData.testText = '';
      this.formData.replacement = '';
      this.resetResults();
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

.stats {
  margin: 15px 0;
}

.presets {
  margin-top: 10px;
}
</style>
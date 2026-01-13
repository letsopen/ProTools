<template>
  <div class="csv-json-tool">
    <el-page-header title="返回" content="CSV与JSON互转工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- CSV转JSON -->
        <el-tab-pane label="CSV转JSON" name="csvToJson">
          <el-form :model="csvToJsonForm" label-position="top">
            <el-form-item label="CSV数据：">
              <el-input 
                v-model="csvToJsonForm.csv" 
                type="textarea"
                :rows="10"
                placeholder="请输入CSV格式数据，第一行为标题（用逗号分隔）&#10;例如：&#10;姓名,年龄,城市&#10;张三,25,北京&#10;李四,30,上海"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertCsvToJson">转换为JSON</el-button>
              <el-button @click="clearCsvToJsonFields">清空</el-button>
            </el-form-item>

            <el-form-item label="JSON结果：">
              <el-input 
                v-model="csvToJsonForm.json" 
                type="textarea"
                :rows="10"
                readonly
                placeholder="转换后的JSON数据将显示在这里"
              />
              <el-button @click="copyText(csvToJsonForm.json)" size="small" style="margin-top: 10px;">复制JSON</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- JSON转CSV -->
        <el-tab-pane label="JSON转CSV" name="jsonToCsv">
          <el-form :model="jsonToCsvForm" label-position="top">
            <el-form-item label="JSON数据：">
              <el-input 
                v-model="jsonToCsvForm.json" 
                type="textarea"
                :rows="10"
                placeholder='请输入JSON格式数据，数组格式&#10;例如：&#10;[{"name": "张三", "age": 25, "city": "北京"}, {"name": "李四", "age": 30, "city": "上海"}]'
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertJsonToCsv">转换为CSV</el-button>
              <el-button @click="clearJsonToCsvFields">清空</el-button>
            </el-form-item>

            <el-form-item label="CSV结果：">
              <el-input 
                v-model="jsonToCsvForm.csv" 
                type="textarea"
                :rows="10"
                readonly
                placeholder="转换后的CSV数据将显示在这里"
              />
              <el-button @click="copyText(jsonToCsvForm.csv)" size="small" style="margin-top: 10px;">复制CSV</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CsvJsonTool',
  data() {
    return {
      activeTab: 'csvToJson',
      csvToJsonForm: {
        csv: '',
        json: ''
      },
      jsonToCsvForm: {
        json: '',
        csv: ''
      }
    };
  },
  methods: {
    // CSV转JSON
    convertCsvToJson() {
      if (!this.csvToJsonForm.csv) {
        this.$message.error('请输入CSV数据');
        return;
      }

      try {
        // 按行分割CSV
        const lines = this.csvToJsonForm.csv.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length < 1) {
          this.$message.error('CSV数据不能为空');
          return;
        }

        // 获取标题行
        const headers = this.parseCSVLine(lines[0]);
        
        // 处理数据行
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const currentLine = this.parseCSVLine(lines[i]);
          const obj = {};
          
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j] || '';
          }
          
          result.push(obj);
        }

        this.csvToJsonForm.json = JSON.stringify(result, null, 2);
        this.$message.success('CSV转换为JSON成功！');
      } catch (error) {
        this.$message.error(`CSV转换失败: ${error.message}`);
      }
    },

    // JSON转CSV
    convertJsonToCsv() {
      if (!this.jsonToCsvForm.json) {
        this.$message.error('请输入JSON数据');
        return;
      }

      try {
        let jsonData;
        try {
          jsonData = JSON.parse(this.jsonToCsvForm.json);
        } catch (e) {
          throw new Error('JSON格式错误');
        }

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error('JSON数据必须是包含对象的数组');
        }

        // 获取所有键名
        const headers = Object.keys(jsonData[0]);
        
        // 构建CSV头部
        let csv = headers.join(',') + '\r\n';
        
        // 构建CSV数据行
        for (const row of jsonData) {
          const values = headers.map(header => {
            let value = row[header] !== undefined ? row[header].toString() : '';
            
            // 如果值包含逗号、引号或换行符，则用双引号包围并转义内部引号
            if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
              value = '"' + value.replace(/"/g, '""') + '"';
            }
            
            return value;
          });
          
          csv += values.join(',') + '\r\n';
        }

        this.jsonToCsvForm.csv = csv;
        this.$message.success('JSON转换为CSV成功！');
      } catch (error) {
        this.$message.error(`JSON转换失败: ${error.message}`);
      }
    },

    // 解析CSV行，处理带引号的字段
    parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
            // 处理转义的引号 ""
            current += '"';
            i++; // 跳过下一个引号
          } else {
            // 切换引号状态
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // 如果不在引号内遇到逗号，这是一个字段分隔符
          result.push(current);
          current = '';
        } else {
          // 添加字符到当前字段
          current += char;
        }
      }
      
      // 添加最后一个字段
      result.push(current);
      
      return result;
    },

    // 复制文本到剪贴板
    copyText(text) {
      if (!text) {
        this.$message.warning('没有内容可复制');
        return;
      }
      
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('已复制到剪贴板');
      });
    },

    // 清空CSV转JSON字段
    clearCsvToJsonFields() {
      this.csvToJsonForm.csv = '';
      this.csvToJsonForm.json = '';
    },

    // 清空JSON转CSV字段
    clearJsonToCsvFields() {
      this.jsonToCsvForm.json = '';
      this.jsonToCsvForm.csv = '';
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

.el-textarea {
  margin-top: 5px;
}
</style>
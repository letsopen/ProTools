<template>
  <div class="id-generator">
    <el-page-header title="返回" content="ID生成器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-form :model="form" label-position="top">
        <el-form-item label="选择ID类型：">
          <el-radio-group v-model="form.type" @change="generateId">
            <el-radio label="uuid">UUID</el-radio>
            <el-radio label="snowflake">雪花算法</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生成的ID：">
          <el-input 
            v-model="generatedId" 
            type="textarea"
            :rows="4"
            readonly
            placeholder="点击生成按钮获取ID"
          />
          <el-button 
            @click="copyId" 
            :disabled="!generatedId" 
            style="margin-top: 10px;"
          >
            复制ID
          </el-button>
        </el-form-item>

        <el-form-item v-if="form.type === 'snowflake'">
          <el-button type="primary" @click="generateId">生成雪花ID</el-button>
          <el-button @click="generateMultipleIds">批量生成</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button-group>
            <el-button type="primary" @click="generateId">生成UUID</el-button>
            <el-button @click="generateV4">生成UUID V4</el-button>
            <el-button @click="generateV1">生成UUID V1</el-button>
            <el-button @click="generateMultipleIds">批量生成</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">批量生成结果</el-divider>
      <el-input 
        v-model="batchResult" 
        type="textarea"
        :rows="8"
        readonly
        placeholder="批量生成的结果将显示在这里"
      />
      <el-button 
        @click="copyBatchResult" 
        :disabled="!batchResult" 
        style="margin-top: 10px;"
      >
        复制批量结果
      </el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'IdGenerator',
  data() {
    return {
      form: {
        type: 'uuid'
      },
      generatedId: '',
      batchResult: ''
    };
  },
  mounted() {
    this.generateId();
  },
  methods: {
    // 生成UUID
    generateUuid() {
      // 使用标准UUID V4生成算法
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    // 生成UUID V4
    generateV4() {
      this.form.type = 'uuid';
      this.generatedId = this.generateUuid();
    },

    // 生成UUID V1 (模拟)
    generateV1() {
      this.form.type = 'uuid';
      // 生成一个模拟的UUID V1（实际V1需要基于时间和MAC地址）
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.generatedId = (timestamp.toString(16) + '-' + randomPart.substring(0, 4) + '-1' + randomPart.substring(4, 7) + '-' + randomPart.substring(7, 11) + '-' + randomPart.substring(11, 19)).toUpperCase();
    },

    // 生成雪花ID
    generateSnowflake() {
      // 简化的雪花算法实现
      const timestamp = Date.now();
      const datacenterId = 1; // 数据中心ID
      const workerId = 1;     // 工作机器ID
      const sequence = Math.floor(Math.random() * 4096); // 序列号

      // 计算各部分
      const timestampShift = 22;
      const datacenterIdShift = 17;
      const workerIdShift = 12;

      // 组合各部分
      const id = ((timestamp - 1288834974657) << timestampShift) |
                 (datacenterId << datacenterIdShift) |
                 (workerId << workerIdShift) |
                 sequence;

      return id.toString();
    },

    // 生成ID
    generateId() {
      if (this.form.type === 'snowflake') {
        this.generatedId = this.generateSnowflake();
      } else {
        this.generatedId = this.generateUuid();
      }
    },

    // 批量生成ID
    generateMultipleIds() {
      const count = 10; // 生成10个ID
      const ids = [];
      
      for (let i = 0; i < count; i++) {
        if (this.form.type === 'snowflake') {
          ids.push(this.generateSnowflake());
        } else {
          ids.push(this.generateUuid());
        }
      }
      
      this.batchResult = ids.join('\n');
      this.$message.success(`已生成${count}个${this.form.type.toUpperCase()} ID`);
    },

    // 复制ID
    copyId() {
      if (!this.generatedId) {
        this.$message.warning('没有可复制的ID');
        return;
      }
      
      navigator.clipboard.writeText(this.generatedId).then(() => {
        this.$message.success('ID已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = this.generatedId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('ID已复制到剪贴板');
      });
    },

    // 复制批量结果
    copyBatchResult() {
      if (!this.batchResult) {
        this.$message.warning('没有可复制的批量结果');
        return;
      }
      
      navigator.clipboard.writeText(this.batchResult).then(() => {
        this.$message.success('批量结果已复制到剪贴板');
      }).catch(() => {
        // 如果navigator.clipboard不可用，则使用旧方法
        const textArea = document.createElement('textarea');
        textArea.value = this.batchResult;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.$message.success('批量结果已复制到剪贴板');
      });
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
</style>
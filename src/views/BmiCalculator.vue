<template>
  <div class="bmi-calculator">
    <el-page-header title="返回" content="BMI计算器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="calculator-container">
      <el-form :model="form" :rules="rules" ref="bmiForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身高：" prop="height">
              <el-input 
                v-model.number="form.height" 
                type="number"
                placeholder="请输入身高（厘米）"
                @input="calculateBmi"
              >
                <template #append>厘米</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重：" prop="weight">
              <el-input 
                v-model.number="form.weight" 
                type="number"
                placeholder="请输入体重（公斤）"
                @input="calculateBmi"
              >
                <template #append>公斤</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="calculateBmi">计算BMI</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">计算结果</el-divider>

      <div class="result-section" v-if="bmiResult">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="result-card">
              <h3>BMI指数</h3>
              <p class="bmi-value">{{ bmiResult.bmi }}</p>
              <p class="bmi-category" :style="{ color: getCategoryColor(bmiResult.category) }">
                {{ bmiResult.category }}
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="result-card">
              <h3>健康建议</h3>
              <p>{{ bmiResult.advice }}</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="bmi-chart" v-if="bmiResult">
        <h3>BMI参考范围</h3>
        <div class="chart-container">
          <div 
            class="chart-bar" 
            :style="{ 
              position: 'relative', 
              height: '40px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '20px',
              overflow: 'hidden'
            }"
          >
            <div 
              class="chart-indicator" 
              :style="{
                position: 'absolute',
                top: 0,
                left: calculateBmiPosition(),
                width: '4px',
                height: '40px',
                backgroundColor: getCategoryColor(bmiResult.category),
                zIndex: 2
              }"
            ></div>
            <div 
              class="range-segment" 
              :style="{ 
                position: 'absolute', 
                top: 0, 
                left: '0%', 
                width: '18%', 
                height: '40px', 
                backgroundColor: '#87CEEB' 
              }"
            >
              <span class="range-label" style="position: absolute; left: 0; top: -20px; font-size: 12px;">偏瘦</span>
            </div>
            <div 
              class="range-segment" 
              :style="{ 
                position: 'absolute', 
                top: 0, 
                left: '18%', 
                width: '22%', 
                height: '40px', 
                backgroundColor: '#90EE90' 
              }"
            >
              <span class="range-label" style="position: absolute; left: 0; top: -20px; font-size: 12px;">正常</span>
            </div>
            <div 
              class="range-segment" 
              :style="{ 
                position: 'absolute', 
                top: 0, 
                left: '40%', 
                width: '20%', 
                height: '40px', 
                backgroundColor: '#FFFF99' 
              }"
            >
              <span class="range-label" style="position: absolute; left: 0; top: -20px; font-size: 12px;">偏胖</span>
            </div>
            <div 
              class="range-segment" 
              :style="{ 
                position: 'absolute', 
                top: 0, 
                left: '60%', 
                width: '40%', 
                height: '40px', 
                backgroundColor: '#FFA07A' 
              }"
            >
              <span class="range-label" style="position: absolute; left: 0; top: -20px; font-size: 12px;">肥胖</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BmiCalculator',
  data() {
    return {
      form: {
        height: null,
        weight: null
      },
      rules: {
        height: [
          { required: true, message: '请输入身高', trigger: 'blur' },
          { type: 'number', min: 1, message: '身高必须大于0', trigger: 'blur' },
          { type: 'number', max: 300, message: '身高不能超过300厘米', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入体重', trigger: 'blur' },
          { type: 'number', min: 1, message: '体重必须大于0', trigger: 'blur' },
          { type: 'number', max: 600, message: '体重不能超过600公斤', trigger: 'blur' }
        ]
      },
      bmiResult: null
    };
  },
  methods: {
    calculateBmi() {
      this.$refs.bmiForm.validate((valid) => {
        if (valid) {
          if (this.form.height <= 0 || this.form.weight <= 0) {
            this.$message.error('身高和体重必须大于0');
            return;
          }

          // 计算BMI
          const heightInMeters = this.form.height / 100; // 转换为米
          const bmi = parseFloat((this.form.weight / (heightInMeters * heightInMeters)).toFixed(2));

          // 确定分类和建议
          let category, advice;
          if (bmi < 18.5) {
            category = '偏瘦';
            advice = '您的体重偏轻，建议适当增加营养摄入，合理安排饮食，适量运动增强体质。';
          } else if (bmi < 24) {
            category = '正常';
            advice = '恭喜您，体重正常！请继续保持良好的生活习惯和规律运动。';
          } else if (bmi < 28) {
            category = '偏胖';
            advice = '您的体重略超重，建议控制饮食，减少高热量食物摄入，增加运动量。';
          } else {
            category = '肥胖';
            advice = '您的体重超标，建议制定科学的减肥计划，控制饮食并加强锻炼，必要时咨询医生。';
          }

          this.bmiResult = {
            bmi: bmi,
            category: category,
            advice: advice
          };
        }
      });
    },

    getCategoryColor(category) {
      switch(category) {
        case '偏瘦':
          return '#87CEEB'; // 浅蓝色
        case '正常':
          return '#90EE90'; // 浅绿色
        case '偏胖':
          return '#FFFF99'; // 浅黄色
        case '肥胖':
          return '#FFA07A'; // 浅橙色
        default:
          return '#909399'; // 灰色
      }
    },

    calculateBmiPosition() {
      if (!this.bmiResult) return '0%';
      
      const bmi = this.bmiResult.bmi;
      let position;

      if (bmi < 18.5) {
        // 偏瘦范围 (0-18.5) -> 0%-18%
        position = (bmi / 18.5) * 18;
      } else if (bmi < 24) {
        // 正常范围 (18.5-24) -> 18%-40%
        position = 18 + ((bmi - 18.5) / (24 - 18.5)) * 22;
      } else if (bmi < 28) {
        // 偏胖范围 (24-28) -> 40%-60%
        position = 40 + ((bmi - 24) / (28 - 24)) * 20;
      } else {
        // 肥胖范围 (28+) -> 60%+
        position = Math.min(100, 60 + ((bmi - 28) / 20) * 40); // 限制最大值为100%
      }

      return `${Math.max(0, Math.min(100, position))}%`;
    },

    resetForm() {
      this.form.height = null;
      this.form.weight = null;
      this.bmiResult = null;
      this.$refs.bmiForm.resetFields();
    }
  }
};
</script>

<style scoped>
.calculator-container {
  margin: 20px;
  min-height: 600px;
}

.result-section {
  margin: 20px 0;
}

.result-card {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #606266;
}

.bmi-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 10px 0;
}

.bmi-category {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.bmi-chart {
  margin-top: 30px;
}

.bmi-chart h3 {
  margin-bottom: 15px;
}

.chart-container {
  margin-top: 10px;
}

.range-label {
  color: #606266;
  font-size: 12px;
}
</style>
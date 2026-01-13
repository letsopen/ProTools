<template>
  <div class="converter">
    <el-page-header title="返回" content="⏰ 时间计算器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="时间计算" name="calculate">
          <el-form :model="formData" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="起始时间：">
                  <el-date-picker
                    v-model="formData.startDate"
                    type="datetime"
                    placeholder="选择起始时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    @change="calculateTime"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="时间间隔：">
                  <el-input-number v-model="formData.timeValue" :min="0" @change="calculateTime" />
                  <el-select v-model="formData.timeUnit" @change="calculateTime" style="margin-left: 10px; width: 100px;">
                    <el-option label="秒" value="seconds" />
                    <el-option label="分钟" value="minutes" />
                    <el-option label="小时" value="hours" />
                    <el-option label="天" value="days" />
                    <el-option label="周" value="weeks" />
                    <el-option label="月" value="months" />
                    <el-option label="年" value="years" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="计算操作：">
              <el-radio-group v-model="formData.operation" @change="calculateTime">
                <el-radio label="add">加</el-radio>
                <el-radio label="subtract">减</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="结果时间：">
              <el-input v-model="formData.resultDate" readonly />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="时间差计算" name="difference">
          <el-form :model="diffData" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开始时间：">
                  <el-date-picker
                    v-model="diffData.startDate"
                    type="datetime"
                    placeholder="选择开始时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    @change="calculateDifference"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间：">
                  <el-date-picker
                    v-model="diffData.endDate"
                    type="datetime"
                    placeholder="选择结束时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    @change="calculateDifference"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="时间差：">
              <el-input v-model="diffData.difference" readonly />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-divider />

      <el-button-group>
        <el-button @click="setCurrentTime">设为当前时间</el-button>
        <el-button @click="clearAll">清空</el-button>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export default {
  name: 'TimeCalculator',
  data() {
    return {
      activeTab: 'calculate',
      formData: {
        startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        timeValue: 1,
        timeUnit: 'days',
        operation: 'add',
        resultDate: ''
      },
      diffData: {
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        difference: ''
      }
    }
  },
  mounted() {
    this.calculateTime();
    this.calculateDifference();
  },
  methods: {
    calculateTime() {
      if (!this.formData.startDate || !this.formData.timeValue) return;

      let result;
      const startDate = dayjs(this.formData.startDate);

      switch (this.formData.timeUnit) {
        case 'seconds':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'second') 
            : startDate.subtract(this.formData.timeValue, 'second');
          break;
        case 'minutes':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'minute') 
            : startDate.subtract(this.formData.timeValue, 'minute');
          break;
        case 'hours':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'hour') 
            : startDate.subtract(this.formData.timeValue, 'hour');
          break;
        case 'days':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'day') 
            : startDate.subtract(this.formData.timeValue, 'day');
          break;
        case 'weeks':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'week') 
            : startDate.subtract(this.formData.timeValue, 'week');
          break;
        case 'months':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'month') 
            : startDate.subtract(this.formData.timeValue, 'month');
          break;
        case 'years':
          result = this.formData.operation === 'add' 
            ? startDate.add(this.formData.timeValue, 'year') 
            : startDate.subtract(this.formData.timeValue, 'year');
          break;
      }

      this.formData.resultDate = result.format('YYYY-MM-DD HH:mm:ss');
    },
    calculateDifference() {
      if (!this.diffData.startDate || !this.diffData.endDate) return;

      const start = dayjs(this.diffData.startDate);
      const end = dayjs(this.diffData.endDate);
      const diff = end.diff(start);

      // 计算各种时间单位的差值
      const diffDuration = dayjs.duration(diff);
      const years = diffDuration.years();
      const months = diffDuration.months();
      const days = diffDuration.days();
      const hours = diffDuration.hours();
      const minutes = diffDuration.minutes();
      const seconds = diffDuration.seconds();

      const parts = [];
      if (years) parts.push(`${years}年`);
      if (months) parts.push(`${months}月`);
      if (days) parts.push(`${days}天`);
      if (hours) parts.push(`${hours}小时`);
      if (minutes) parts.push(`${minutes}分钟`);
      if (seconds) parts.push(`${seconds}秒`);

      if (parts.length === 0) {
        this.diffData.difference = '0秒';
      } else {
        this.diffData.difference = parts.join(' ') || '0秒';
      }
    },
    setCurrentTime() {
      this.formData.startDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      this.calculateTime();
    },
    clearAll() {
      this.formData.startDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      this.formData.timeValue = 1;
      this.formData.timeUnit = 'days';
      this.formData.operation = 'add';
      this.formData.resultDate = '';
      
      this.diffData.startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      this.diffData.endDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      this.diffData.difference = '';
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

.el-date-editor.el-input {
  width: 100%;
}
</style>
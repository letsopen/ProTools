<template>
  <div class="converter">
    <el-page-header title="返回" content="📏 单位转换器" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="converter-container">
      <el-form :model="formData" label-position="top">
        <el-form-item label="转换类型：">
          <el-select 
            v-model="formData.category" 
            placeholder="选择转换类型"
            @change="onCategoryChange"
            style="width: 100%"
          >
            <el-option label="长度" value="length" />
            <el-option label="重量" value="weight" />
            <el-option label="温度" value="temperature" />
            <el-option label="面积" value="area" />
            <el-option label="体积" value="volume" />
            <el-option label="速度" value="speed" />
            <el-option label="数据存储" value="data" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="从：">
              <el-input 
                v-model.number="formData.fromValue" 
                type="number"
                placeholder="输入数值"
                @input="convertUnit"
                style="margin-bottom: 10px;"
              />
              <el-select 
                v-model="formData.fromUnit" 
                placeholder="原单位"
                @change="convertUnit"
                style="width: 100%"
              >
                <el-option 
                  v-for="unit in unitOptions[formData.category]" 
                  :key="unit.value" 
                  :label="unit.label" 
                  :value="unit.value" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="到：">
              <el-input 
                v-model="formData.toValue" 
                readonly
                style="margin-bottom: 10px;"
              />
              <el-select 
                v-model="formData.toUnit" 
                placeholder="目标单位"
                @change="convertUnit"
                style="width: 100%"
              >
                <el-option 
                  v-for="unit in unitOptions[formData.category]" 
                  :key="unit.value" 
                  :label="unit.label" 
                  :value="unit.value" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="转换公式：">
          <el-input v-model="formData.formula" readonly />
        </el-form-item>
      </el-form>

      <el-divider />

      <el-button @click="clearAll">清空</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UnitConverter',
  data() {
    return {
      formData: {
        category: 'length',
        fromValue: 1,
        fromUnit: 'meter',
        toValue: '',
        toUnit: 'kilometer',
        formula: ''
      },
      unitOptions: {
        length: [
          { label: '纳米 (nm)', value: 'nanometer' },
          { label: '微米 (μm)', value: 'micrometer' },
          { label: '毫米 (mm)', value: 'millimeter' },
          { label: '厘米 (cm)', value: 'centimeter' },
          { label: '分米 (dm)', value: 'decimeter' },
          { label: '米 (m)', value: 'meter' },
          { label: '千米 (km)', value: 'kilometer' },
          { label: '英寸 (in)', value: 'inch' },
          { label: '英尺 (ft)', value: 'foot' },
          { label: '码 (yd)', value: 'yard' },
          { label: '英里 (mi)', value: 'mile' }
        ],
        weight: [
          { label: '毫克 (mg)', value: 'milligram' },
          { label: '克 (g)', value: 'gram' },
          { label: '千克 (kg)', value: 'kilogram' },
          { label: '吨 (t)', value: 'ton' },
          { label: '盎司 (oz)', value: 'ounce' },
          { label: '磅 (lb)', value: 'pound' }
        ],
        temperature: [
          { label: '摄氏度 (°C)', value: 'celsius' },
          { label: '华氏度 (°F)', value: 'fahrenheit' },
          { label: '开尔文 (K)', value: 'kelvin' }
        ],
        area: [
          { label: '平方毫米 (mm²)', value: 'squareMillimeter' },
          { label: '平方厘米 (cm²)', value: 'squareCentimeter' },
          { label: '平方米 (m²)', value: 'squareMeter' },
          { label: '公顷 (ha)', value: 'hectare' },
          { label: '平方公里 (km²)', value: 'squareKilometer' },
          { label: '平方英寸 (in²)', value: 'squareInch' },
          { label: '平方英尺 (ft²)', value: 'squareFoot' },
          { label: '英亩 (ac)', value: 'acre' }
        ],
        volume: [
          { label: '毫升 (mL)', value: 'milliliter' },
          { label: '升 (L)', value: 'liter' },
          { label: '立方米 (m³)', value: 'cubicMeter' },
          { label: '茶匙 (tsp)', value: 'teaspoon' },
          { label: '汤匙 (tbsp)', value: 'tablespoon' },
          { label: '液盎司 (fl oz)', value: 'fluidOunce' },
          { label: '杯 (cup)', value: 'cup' },
          { label: '品脱 (pt)', value: 'pint' },
          { label: '夸脱 (qt)', value: 'quart' },
          { label: '加仑 (gal)', value: 'gallon' }
        ],
        speed: [
          { label: '米/秒 (m/s)', value: 'meterPerSecond' },
          { label: '千米/小时 (km/h)', value: 'kilometerPerHour' },
          { label: '英里/小时 (mph)', value: 'milePerHour' },
          { label: '节 (kt)', value: 'knot' }
        ],
        data: [
          { label: '比特 (bit)', value: 'bit' },
          { label: '字节 (B)', value: 'byte' },
          { label: '千字节 (KB)', value: 'kilobyte' },
          { label: '兆字节 (MB)', value: 'megabyte' },
          { label: '吉字节 (GB)', value: 'gigabyte' },
          { label: '太字节 (TB)', value: 'terabyte' },
          { label: '拍字节 (PB)', value: 'petabyte' }
        ]
      }
    }
  },
  mounted() {
    this.onCategoryChange();
    this.convertUnit();
  },
  methods: {
    onCategoryChange() {
      // 设置默认单位
      this.formData.fromUnit = this.unitOptions[this.formData.category][0].value;
      this.formData.toUnit = this.unitOptions[this.formData.category][1]?.value || this.unitOptions[this.formData.category][0].value;
      this.convertUnit();
    },
    convertUnit() {
      if (typeof this.formData.fromValue !== 'number' || isNaN(this.formData.fromValue)) {
        this.formData.toValue = '';
        return;
      }

      const category = this.formData.category;
      const fromValue = parseFloat(this.formData.fromValue);
      let result;

      if (category === 'temperature') {
        result = this.convertTemperature(fromValue, this.formData.fromUnit, this.formData.toUnit);
      } else {
        // 对于非温度单位，先转换为基础单位，再转换为目标单位
        const baseValue = this.toBaseUnit(fromValue, this.formData.fromUnit, category);
        result = this.fromBaseUnit(baseValue, this.formData.toUnit, category);
      }

      this.formData.toValue = result.toFixed(6);
      this.updateFormula();
    },
    toBaseUnit(value, unit, category) {
      switch (category) {
        case 'length':
          switch (unit) {
            case 'nanometer': return value / 1000000000;
            case 'micrometer': return value / 1000000;
            case 'millimeter': return value / 1000;
            case 'centimeter': return value / 100;
            case 'decimeter': return value / 10;
            case 'meter': return value;
            case 'kilometer': return value * 1000;
            case 'inch': return value * 0.0254;
            case 'foot': return value * 0.3048;
            case 'yard': return value * 0.9144;
            case 'mile': return value * 1609.344;
            default: return value;
          }
        case 'weight':
          switch (unit) {
            case 'milligram': return value / 1000000;
            case 'gram': return value / 1000;
            case 'kilogram': return value;
            case 'ton': return value * 1000;
            case 'ounce': return value * 0.0283495;
            case 'pound': return value * 0.453592;
            default: return value;
          }
        case 'area':
          switch (unit) {
            case 'squareMillimeter': return value / 1000000;
            case 'squareCentimeter': return value / 10000;
            case 'squareMeter': return value;
            case 'hectare': return value * 10000;
            case 'squareKilometer': return value * 1000000;
            case 'squareInch': return value * 0.00064516;
            case 'squareFoot': return value * 0.092903;
            case 'acre': return value * 4046.86;
            default: return value;
          }
        case 'volume':
          switch (unit) {
            case 'milliliter': return value / 1000;
            case 'liter': return value;
            case 'cubicMeter': return value * 1000;
            case 'teaspoon': return value * 0.00492892;
            case 'tablespoon': return value * 0.0147868;
            case 'fluidOunce': return value * 0.0295735;
            case 'cup': return value * 0.24;
            case 'pint': return value * 0.473176;
            case 'quart': return value * 0.946353;
            case 'gallon': return value * 3.78541;
            default: return value;
          }
        case 'speed':
          switch (unit) {
            case 'meterPerSecond': return value;
            case 'kilometerPerHour': return value / 3.6;
            case 'milePerHour': return value * 0.44704;
            case 'knot': return value * 0.514444;
            default: return value;
          }
        case 'data':
          switch (unit) {
            case 'bit': return value / 8;
            case 'byte': return value;
            case 'kilobyte': return value * 1024;
            case 'megabyte': return value * 1024 * 1024;
            case 'gigabyte': return value * 1024 * 1024 * 1024;
            case 'terabyte': return value * 1024 * 1024 * 1024 * 1024;
            case 'petabyte': return value * 1024 * 1024 * 1024 * 1024 * 1024;
            default: return value;
          }
        default: return value;
      }
    },
    fromBaseUnit(value, unit, category) {
      switch (category) {
        case 'length':
          switch (unit) {
            case 'nanometer': return value * 1000000000;
            case 'micrometer': return value * 1000000;
            case 'millimeter': return value * 1000;
            case 'centimeter': return value * 100;
            case 'decimeter': return value * 10;
            case 'meter': return value;
            case 'kilometer': return value / 1000;
            case 'inch': return value / 0.0254;
            case 'foot': return value / 0.3048;
            case 'yard': return value / 0.9144;
            case 'mile': return value / 1609.344;
            default: return value;
          }
        case 'weight':
          switch (unit) {
            case 'milligram': return value * 1000000;
            case 'gram': return value * 1000;
            case 'kilogram': return value;
            case 'ton': return value / 1000;
            case 'ounce': return value / 0.0283495;
            case 'pound': return value / 0.453592;
            default: return value;
          }
        case 'area':
          switch (unit) {
            case 'squareMillimeter': return value * 1000000;
            case 'squareCentimeter': return value * 10000;
            case 'squareMeter': return value;
            case 'hectare': return value / 10000;
            case 'squareKilometer': return value / 1000000;
            case 'squareInch': return value / 0.00064516;
            case 'squareFoot': return value / 0.092903;
            case 'acre': return value / 4046.86;
            default: return value;
          }
        case 'volume':
          switch (unit) {
            case 'milliliter': return value * 1000;
            case 'liter': return value;
            case 'cubicMeter': return value / 1000;
            case 'teaspoon': return value / 0.00492892;
            case 'tablespoon': return value / 0.0147868;
            case 'fluidOunce': return value / 0.0295735;
            case 'cup': return value / 0.24;
            case 'pint': return value / 0.473176;
            case 'quart': return value / 0.946353;
            case 'gallon': return value / 3.78541;
            default: return value;
          }
        case 'speed':
          switch (unit) {
            case 'meterPerSecond': return value;
            case 'kilometerPerHour': return value * 3.6;
            case 'milePerHour': return value / 0.44704;
            case 'knot': return value / 0.514444;
            default: return value;
          }
        case 'data':
          switch (unit) {
            case 'bit': return value * 8;
            case 'byte': return value;
            case 'kilobyte': return value / 1024;
            case 'megabyte': return value / (1024 * 1024);
            case 'gigabyte': return value / (1024 * 1024 * 1024);
            case 'terabyte': return value / (1024 * 1024 * 1024 * 1024);
            case 'petabyte': return value / (1024 * 1024 * 1024 * 1024 * 1024);
            default: return value;
          }
        default: return value;
      }
    },
    convertTemperature(value, fromUnit, toUnit) {
      // 先转换为摄氏度
      let celsius;
      switch (fromUnit) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * 5/9; break;
        case 'kelvin': celsius = value - 273.15; break;
        default: celsius = value;
      }

      // 再从摄氏度转换为目标单位
      switch (toUnit) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
        default: return celsius;
      }
    },
    updateFormula() {
      this.formData.formula = `${this.formData.fromValue} ${this.getUnitLabel(this.formData.fromUnit)} = ${this.formData.toValue} ${this.getUnitLabel(this.formData.toUnit)}`;
    },
    getUnitLabel(unitValue) {
      const category = this.unitOptions[this.formData.category];
      const unit = category.find(u => u.value === unitValue);
      return unit ? unit.label.split('(')[0].trim() : unitValue;
    },
    clearAll() {
      this.formData.fromValue = 1;
      this.formData.toValue = '';
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
</style>
<template>
  <div class="xml-tool">
    <el-page-header title="返回" content="XML格式化工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-tabs v-model="activeTab" type="card">
        <!-- XML格式化 -->
        <el-tab-pane label="XML格式化" name="format">
          <el-form :model="formatForm" label-position="top">
            <el-form-item label="原始XML：">
              <el-input 
                v-model="formatForm.xml" 
                type="textarea"
                :rows="12"
                placeholder="请输入需要格式化的XML数据"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="formatXml">格式化</el-button>
                <el-button @click="validateXml">验证XML</el-button>
                <el-button @click="clearFormatFields">清空</el-button>
              </el-button-group>
            </el-form-item>

            <el-form-item label="格式化结果：">
              <el-input 
                v-model="formatForm.formatted" 
                type="textarea"
                :rows="12"
                readonly
                placeholder="格式化后的XML将显示在这里"
              />
              <el-button @click="copyText(formatForm.formatted)" size="small" style="margin-top: 10px;">复制格式化结果</el-button>
            </el-form-item>

            <el-form-item label="验证结果：">
              <el-input 
                v-model="formatForm.validationResult" 
                type="textarea"
                :rows="2"
                readonly
                :class="validationResultType"
                placeholder="验证结果将显示在这里"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- XML转JSON -->
        <el-tab-pane label="XML转JSON" name="xmlToJson">
          <el-form :model="xmlToJsonForm" label-position="top">
            <el-form-item label="XML数据：">
              <el-input 
                v-model="xmlToJsonForm.xml" 
                type="textarea"
                :rows="10"
                placeholder="请输入XML数据"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertXmlToJson">转换为JSON</el-button>
              <el-button @click="clearXmlToJsonFields">清空</el-button>
            </el-form-item>

            <el-form-item label="JSON结果：">
              <el-input 
                v-model="xmlToJsonForm.json" 
                type="textarea"
                :rows="10"
                readonly
                placeholder="转换后的JSON将显示在这里"
              />
              <el-button @click="copyText(xmlToJsonForm.json)" size="small" style="margin-top: 10px;">复制JSON</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- JSON转XML -->
        <el-tab-pane label="JSON转XML" name="jsonToXml">
          <el-form :model="jsonToXmlForm" label-position="top">
            <el-form-item label="JSON数据：">
              <el-input 
                v-model="jsonToXmlForm.json" 
                type="textarea"
                :rows="10"
                placeholder="请输入JSON数据"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="convertJsonToXml">转换为XML</el-button>
              <el-button @click="clearJsonToXmlFields">清空</el-button>
            </el-form-item>

            <el-form-item label="XML结果：">
              <el-input 
                v-model="jsonToXmlForm.xml" 
                type="textarea"
                :rows="10"
                readonly
                placeholder="转换后的XML将显示在这里"
              />
              <el-button @click="copyText(jsonToXmlForm.xml)" size="small" style="margin-top: 10px;">复制XML</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'XmlTool',
  data() {
    return {
      activeTab: 'format',
      formatForm: {
        xml: '',
        formatted: '',
        validationResult: ''
      },
      xmlToJsonForm: {
        xml: '',
        json: ''
      },
      jsonToXmlForm: {
        json: '',
        xml: ''
      },
      validationResultType: 'is-info'
    };
  },
  methods: {
    // 格式化XML
    formatXml() {
      if (!this.formatForm.xml) {
        this.$message.error('请输入XML数据');
        return;
      }

      try {
        const formatted = this.prettifyXml(this.formatForm.xml);
        this.formatForm.formatted = formatted;
        this.validateXml(); // 同时进行验证
        this.$message.success('XML格式化成功！');
      } catch (error) {
        this.$message.error(`XML格式化失败: ${error.message}`);
      }
    },

    // 验证XML
    validateXml() {
      if (!this.formatForm.xml) {
        this.$message.error('请输入XML数据');
        return;
      }

      try {
        // 尝试解析XML以验证其有效性
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.formatForm.xml, "text/xml");
        
        // 检查是否存在解析错误
        const parserError = xmlDoc.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
          this.formatForm.validationResult = `XML格式错误: ${parserError[0].textContent}`;
          this.validationResultType = 'is-error';
          return;
        }

        this.formatForm.validationResult = 'XML格式正确';
        this.validationResultType = 'is-success';
      } catch (error) {
        this.formatForm.validationResult = `XML验证失败: ${error.message}`;
        this.validationResultType = 'is-error';
      }
    },

    // XML转JSON
    convertXmlToJson() {
      if (!this.xmlToJsonForm.xml) {
        this.$message.error('请输入XML数据');
        return;
      }

      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.xmlToJsonForm.xml, "text/xml");
        
        // 检查解析错误
        const parserError = xmlDoc.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
          throw new Error(`XML格式错误: ${parserError[0].textContent}`);
        }

        const jsonObj = this.xmlToJson(xmlDoc.documentElement);
        this.xmlToJsonForm.json = JSON.stringify(jsonObj, null, 2);
        this.$message.success('XML转换为JSON成功！');
      } catch (error) {
        this.$message.error(`XML转JSON失败: ${error.message}`);
      }
    },

    // JSON转XML
    convertJsonToXml() {
      if (!this.jsonToXmlForm.json) {
        this.$message.error('请输入JSON数据');
        return;
      }

      try {
        const jsonObj = JSON.parse(this.jsonToXmlForm.json);
        const xmlStr = this.jsonToXml(jsonObj, '', 0);
        this.jsonToXmlForm.xml = xmlStr;
        this.$message.success('JSON转换为XML成功！');
      } catch (error) {
        this.$message.error(`JSON转XML失败: ${error.message}`);
      }
    },

    // 格式化XML的辅助函数
    prettifyXml(sourceXml) {
      const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
      const xsltDoc = new DOMParser().parseFromString([
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(node())]">',
        '    <xsl:value-of select="@content-style"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy>',
        '      <xsl:apply-templates select="node()|@*"/>',
        '    </xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>'
      ].join('\n'), 'application/xml');

      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      const resultXml = new XMLSerializer().serializeToString(resultDoc);
      
      // 移除额外的XML声明
      return resultXml.replace(/^<\?xml.*?\?>/, '').trim();
    },

    // XML转JSON的辅助函数
    xmlToJson(xmlNode) {
      const obj = {};

      if (xmlNode.nodeType === Node.TEXT_NODE) {
        return xmlNode.nodeValue.trim();
      }

      if (xmlNode.nodeType === Node.ELEMENT_NODE) {
        // 处理属性
        if (xmlNode.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let i = 0; i < xmlNode.attributes.length; i++) {
            const attr = xmlNode.attributes.item(i);
            obj['@attributes'][attr.nodeName] = attr.nodeValue;
          }
        }

        // 处理子节点
        if (xmlNode.hasChildNodes()) {
          for (let i = 0; i < xmlNode.childNodes.length; i++) {
            const item = xmlNode.childNodes.item(i);
            const nodeName = item.nodeName;

            if (typeof (obj[nodeName]) === "undefined") {
              const childResult = this.xmlToJson(item);
              if (childResult !== '') {
                obj[nodeName] = childResult;
              }
            } else {
              if (typeof (obj[nodeName]).push === "undefined") {
                obj[nodeName] = [obj[nodeName]];
              }
              const childResult = this.xmlToJson(item);
              if (childResult !== '') {
                obj[nodeName].push(childResult);
              }
            }
          }
        }
      }

      return obj;
    },

    // JSON转XML的辅助函数
    jsonToXml(jsonObj, name = '', level = 0) {
      const indent = '  '.repeat(level);
      let xml = '';

      if (jsonObj === null || jsonObj === undefined) {
        return `${indent}<${name}></${name}>`;
      }

      if (typeof jsonObj === 'string' || typeof jsonObj === 'number' || typeof jsonObj === 'boolean') {
        return `${indent}<${name}>${this.escapeXml(jsonObj.toString())}</${name}>`;
      }

      if (Array.isArray(jsonObj)) {
        jsonObj.forEach(item => {
          xml += this.jsonToXml(item, name, level) + '\n';
        });
        return xml;
      }

      if (typeof jsonObj === 'object') {
        xml += `${indent}<${name}>`;
        
        // 检查是否有属性
        const hasAttributes = jsonObj['@attributes'];
        if (hasAttributes) {
          for (const attrName in jsonObj['@attributes']) {
            xml += ` ${attrName}="${this.escapeXml(jsonObj['@attributes'][attrName])}"`;
          }
          xml += '>\n';
        } else {
          xml += name ? '>\n' : '';
        }

        for (const key in jsonObj) {
          if (key === '@attributes') continue;

          if (Array.isArray(jsonObj[key])) {
            jsonObj[key].forEach(item => {
              xml += this.jsonToXml(item, key, level + 1) + '\n';
            });
          } else if (typeof jsonObj[key] === 'object') {
            xml += this.jsonToXml(jsonObj[key], key, level + 1) + '\n';
          } else {
            xml += `${'  '.repeat(level + 1)}<${key}>${this.escapeXml(jsonObj[key].toString())}</${key}>\n`;
          }
        }

        xml += `${indent}</${name}>`;
        return xml;
      }

      return xml;
    },

    // 转义XML特殊字符
    escapeXml(unsafe) {
      return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
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

    // 清空格式化字段
    clearFormatFields() {
      this.formatForm.xml = '';
      this.formatForm.formatted = '';
      this.formatForm.validationResult = '';
      this.validationResultType = 'is-info';
    },

    // 清空XML转JSON字段
    clearXmlToJsonFields() {
      this.xmlToJsonForm.xml = '';
      this.xmlToJsonForm.json = '';
    },

    // 清空JSON转XML字段
    clearJsonToXmlFields() {
      this.jsonToXmlForm.json = '';
      this.jsonToXmlForm.xml = '';
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
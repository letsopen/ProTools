<template>
  <div class="certificate-tool">
    <el-page-header title="返回" content="数字证书工具" @back="$router.go(-1) || $router.push('/')" />
    <el-card class="tool-container">
      <el-form :model="form" label-position="top">
        <el-form-item label="证书内容（PEM格式）：">
          <el-input 
            v-model="form.certificate" 
            type="textarea"
            :rows="12"
            placeholder="请粘贴X.509证书内容（PEM格式），以-----BEGIN CERTIFICATE-----开头"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="parseCertificate">解析证书</el-button>
          <el-button @click="clearFields">清空</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">证书信息</el-divider>
      
      <el-table 
        :data="certificateInfo" 
        stripe 
        style="width: 100%"
        v-if="certificateInfo.length > 0">
        <el-table-column prop="field" label="字段" width="200"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
      </el-table>
      
      <div v-if="certificateInfo.length === 0" class="no-data">
        <p>暂无证书信息，请先解析证书</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import forge from 'node-forge';

export default {
  name: 'CertificateTool',
  data() {
    return {
      form: {
        certificate: ''
      },
      certificateInfo: []
    };
  },
  methods: {
    parseCertificate() {
      if (!this.form.certificate) {
        this.$message.error('请输入证书内容');
        return;
      }

      try {
        // 清空之前的信息
        this.certificateInfo = [];

        // 解析PEM格式的证书
        const certPem = this.form.certificate;
        const cert = forge.pki.certificateFromPem(certPem);

        // 提取证书信息
        this.certificateInfo = [
          { field: '主题', value: this.formatSubject(cert.subject) },
          { field: '颁发者', value: this.formatSubject(cert.issuer) },
          { field: '序列号', value: forge.util.bytesToHex(cert.serialNumber) },
          { field: '版本', value: `Version ${cert.version + 1}` },
          { field: '公钥算法', value: this.getPublicKeyAlgorithm(cert) },
          { field: '签名算法', value: this.getSignatureAlgorithm(cert) },
          { field: '有效期从', value: cert.validity.notBefore.toLocaleString() },
          { field: '有效期至', value: cert.validity.notAfter.toLocaleString() },
          { field: '证书指纹(SHA-256)', value: forge.md.sha256.digest(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).toHex() }
        ];

        // 如果有扩展信息，也添加进来
        if (cert.extensions && cert.extensions.length > 0) {
          for (const ext of cert.extensions) {
            if (ext.name) {
              this.certificateInfo.push({ 
                field: `扩展: ${ext.name}`, 
                value: this.formatExtensionValue(ext) 
              });
            }
          }
        }

        this.$message.success('证书解析成功！');
      } catch (error) {
        this.$message.error(`证书解析失败: ${error.message}`);
      }
    },

    formatSubject(subject) {
      return subject.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', ');
    },

    getPublicKeyAlgorithm(cert) {
      const algorithm = cert.publicKey.type;
      if (algorithm === ' rsaEncryption') {
        return 'RSA';
      } else if (algorithm === 'ecPublicKey') {
        return 'ECDSA';
      } else if (algorithm === 'id-ecPublicKey') {
        return 'ECDH';
      }
      return algorithm;
    },

    getSignatureAlgorithm(cert) {
      // 从证书的签名算法OID中推断算法名称
      const sigAlgOid = cert.signatureOid;
      if (sigAlgOid) {
        if (sigAlgOid.includes('sha256WithRSAEncryption')) {
          return 'SHA256 with RSA';
        } else if (sigAlgOid.includes('sha1WithRSAEncryption')) {
          return 'SHA1 with RSA';
        } else if (sigAlgOid.includes('ecdsa-with-SHA256')) {
          return 'ECDSA with SHA256';
        } else {
          return `Unknown (${sigAlgOid})`;
        }
      }
      return 'Unknown';
    },

    formatExtensionValue(ext) {
      if (ext.name === 'basicConstraints') {
        return `CA=${ext.ca ? 'true' : 'false'}, Path Length Constraint=${ext.pathLenConstraint || 'unlimited'}`;
      } else if (ext.name === 'keyUsage') {
        return ext.digitalSignature ? 'Digital Signature, Key Encipherment' : 'Key Encipherment';
      } else if (ext.name === 'extKeyUsage') {
        const usages = [];
        if (ext.serverAuth) usages.push('Server Auth');
        if (ext.clientAuth) usages.push('Client Auth');
        if (ext.codeSigning) usages.push('Code Signing');
        if (ext.emailProtection) usages.push('Email Protection');
        return usages.join(', ');
      } else if (ext.name === 'subjectAltName') {
        return ext.altNames.map(name => `${name.type === 2 ? 'DNS' : 'IP'}: ${name.value}`).join(', ');
      }
      return JSON.stringify(ext.value || 'N/A');
    },

    clearFields() {
      this.form.certificate = '';
      this.certificateInfo = [];
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

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
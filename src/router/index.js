import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TimestampConverter from '../views/TimestampConverter.vue';
import NumberConverter from '../views/NumberConverter.vue';
import Base64Tool from '../views/Base64Tool.vue';
import HashTool from '../views/HashTool.vue';
import JsonFormatter from '../views/JsonFormatter.vue';
import UrlCoder from '../views/UrlCoder.vue';
import NumberBaseConverter from '../views/NumberBaseConverter.vue';
import ColorConverter from '../views/ColorConverter.vue';
import TextUtils from '../views/TextUtils.vue';
import PasswordGenerator from '../views/PasswordGenerator.vue';
import TimeCalculator from '../views/TimeCalculator.vue';
import UnitConverter from '../views/UnitConverter.vue';
import QRCodeGenerator from '../views/QRCodeGenerator.vue';
import RegexTester from '../views/RegexTester.vue';
import ChecksumTool from '../views/ChecksumTool.vue';
import HttpRequestTool from '../views/HttpRequestTool.vue';
import CodeMinifier from '../views/CodeMinifier.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/timestamp',
    name: 'TimestampConverter',
    component: TimestampConverter
  },
  {
    path: '/number-converter',
    name: 'NumberConverter',
    component: NumberConverter
  },
  {
    path: '/base64',
    name: 'Base64Tool',
    component: Base64Tool
  },
  {
    path: '/hash',
    name: 'HashTool',
    component: HashTool
  },
  {
    path: '/json-formatter',
    name: 'JsonFormatter',
    component: JsonFormatter
  },
  {
    path: '/url-coder',
    name: 'UrlCoder',
    component: UrlCoder
  },
  {
    path: '/number-base-converter',
    name: 'NumberBaseConverter',
    component: NumberBaseConverter
  },
  {
    path: '/color-converter',
    name: 'ColorConverter',
    component: ColorConverter
  },
  {
    path: '/text-utils',
    name: 'TextUtils',
    component: TextUtils
  },
  {
    path: '/password-generator',
    name: 'PasswordGenerator',
    component: PasswordGenerator
  },
  {
    path: '/time-calculator',
    name: 'TimeCalculator',
    component: TimeCalculator
  },
  {
    path: '/unit-converter',
    name: 'UnitConverter',
    component: UnitConverter
  },
  {
    path: '/qrcode-generator',
    name: 'QRCodeGenerator',
    component: QRCodeGenerator
  },
  {
    path: '/regex-tester',
    name: 'RegexTester',
    component: RegexTester
  },
  {
    path: '/checksum-tool',
    name: 'ChecksumTool',
    component: ChecksumTool
  },
  {
    path: '/http-request',
    name: 'HttpRequestTool',
    component: HttpRequestTool
  },
  {
    path: '/code-minifier',
    name: 'CodeMinifier',
    component: CodeMinifier
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
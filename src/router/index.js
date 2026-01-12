import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TimestampConverter from '../views/TimestampConverter.vue';
import NumberConverter from '../views/NumberConverter.vue';
import Base64Tool from '../views/Base64Tool.vue';
import HashTool from '../views/HashTool.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
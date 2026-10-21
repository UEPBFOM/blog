import { defineConfig } from 'astro/config'

// 第一阶段只生成静态页面，不需要服务器适配器。
export default defineConfig({ output: 'static' })

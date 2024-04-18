/* eslint-env node */

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16, // 基准字体大小，由于 tailwindcss 中 rem 的计算基准是 16px，所以为了兼容 tailwindcss，这里的基准字体大小设置为 16
      unitPrecision: 5, // 转换后的rem保留小数点位数
      propList: ['*'], // 要转换的属性，默认转换所有属性
      selectorBlackList: [/^html$/, 'test-high'] // html 选择器中的 px 不做转换
      // exclude: /design/i /(\/|\\)(node_modules)|(var\.scss)$|(\.css)$|(--custom-[^:]+:)/i
      // minPixelValue: 1 // 设置替换的最小像素值
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}

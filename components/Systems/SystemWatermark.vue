<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '@/config/pageConfig'

interface Props {
  /** 水印文字（默认使用全局配置的版权机构名） */
  text?: string
  /** 水印旋转角度（默认 -25deg） */
  rotate?: number
  /** 水印透明度（默认 0.06） */
  opacity?: number
  /** 水印字号（默认 14px） */
  fontSize?: string
  /** 水印颜色（默认 #999） */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: () => siteConfig.siteName,
  rotate: -25,
  opacity: 0.06,
  fontSize: '14px',
  color: '#2b2b2b',
})

// 生成可平铺的 SVG 背景图
const watermarkBg = computed(() => {
  const fontSize = (props.fontSize ?? '14px').replace('px', '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" transform="rotate(${props.rotate} 150 75)" fill="${props.color}" opacity="${props.opacity}" font-size="${fontSize}" font-family="sans-serif">${props.text}</text></svg>`
  const encoded = encodeURIComponent(svg)
  return `url("data:image/svg+xml,${encoded}")`
})
</script>
<!--
水印组件 - 用于系统版权展示

使用说明：
1. 默认用法（使用全局配置的「铁路大数据研究与应用创新中心」）：
   <SystemWatermark />

2. 自定义水印文字：
   <SystemWatermark text="自定义水印" />

3. 自定义样式：
   <SystemWatermark :opacity="0.08" :rotate="-30" />

Props:
  - text: string - 水印文字（默认：GLOBAL_TEXT.copyright.org）
  - rotate: number - 旋转角度（默认：-25）
  - opacity: number - 透明度（默认：0.06）
  - fontSize: string - 字号（默认：14px）
  - color: string - 颜色（默认：#999）
-->
<template>
  <div
    class="system-watermark"
    :style="{ backgroundImage: watermarkBg }"
    aria-hidden="true"
  />
</template>

<style scoped lang="less">
.system-watermark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9998; /* 覆盖在页面内容之上，低于弹窗层(99999) */
  background-repeat: repeat;
  background-position: 0 0;
}
</style>

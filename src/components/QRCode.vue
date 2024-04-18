<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import logoUrl from '@/assets/icons/logo.svg'

const props = withDefaults(
  defineProps<{
    content: string
    width?: number
    colorDark?: string
    colorLight?: string
  }>(),
  {
    width: 230,
    colorDark: '#333',
    colorLight: '#fff'
  }
)

const canvasRef = ref<HTMLCanvasElement>()
const imgSize = Math.floor(props.width * 0.1)
const imgObj = new Image()

onMounted(() => {
  const canvasObj = canvasRef.value
  const ctx = canvasObj?.getContext('2d')
  const imgPosition = props.width / 2 - imgSize / 2

  imgObj.src = logoUrl
  imgObj.onload = () => {
    QRCode.toCanvas(canvasObj, props.content, {
      width: props.width,
      errorCorrectionLevel: 'H',
      color: {
        dark: props.colorDark,
        light: props.colorLight
      }
    }).then(() => {
      if (ctx) {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = 'blue'
        ctx.rect(imgPosition - 5, imgPosition - 5, imgSize + 10, imgSize + 10)
        ctx.stroke()
        ctx.fillStyle = '#fff'
        ctx.fill()
        ctx.drawImage(imgObj, imgPosition, imgPosition, imgSize, imgSize)
      }
    })
  }
})
</script>

<style scoped></style>

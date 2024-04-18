<template>
  <canvas ref="codeImgRef" :width="width" :height="height" class="v-code-img" @click="getImgCode" />
</template>

<script setup lang="ts">
const props = defineProps<{
  width: number
  height: number
}>()

const imgCode = defineModel<string>({ default: '' })
const codeImgRef = ref<HTMLCanvasElement>()

function getImgCode() {
  if (!codeImgRef.value) return

  imgCode.value = drawImg(codeImgRef.value, props.width, props.height)
}

onMounted(() => {
  getImgCode()
})

/** 随机数字 */
function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

/** 随机颜色 */
function randomColor(min: number, max: number) {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)

  return `rgb(${r},${g},${b})`
}

/** 绘制图形 */
function drawImg(imgElement: HTMLCanvasElement, width: number, height: number): string {
  let imgCode = ''

  const NUMBER_STRING = '0123456789'

  const ctx = imgElement.getContext('2d')
  if (!ctx) return imgCode

  ctx.fillStyle = randomColor(180, 230)
  ctx.fillRect(0, 0, width, height)
  for (let i = 0; i < 4; i += 1) {
    const text = NUMBER_STRING[randomNum(0, NUMBER_STRING.length)]
    imgCode += text
    const fontSize = randomNum(18, 41)
    const deg = randomNum(-30, 30)
    ctx.font = `${fontSize}px Simhei`
    ctx.textBaseline = 'top'
    ctx.fillStyle = randomColor(80, 150)
    ctx.save()
    ctx.translate(30 * i + 15, 15)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.fillText(text, -15 + 5, -15)
    ctx.restore()
  }

  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, width), randomNum(0, height))
    ctx.lineTo(randomNum(0, width), randomNum(0, height))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }

  for (let i = 0; i < 41; i += 1) {
    ctx.beginPath()
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }

  return imgCode
}

defineExpose({
  refresh: getImgCode
})
</script>

<style scoped>
.v-code-img {
  cursor: pointer;
}
</style>

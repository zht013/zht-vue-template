import type { Ref } from 'vue'

export function useWatermark(element: Ref<HTMLElement | undefined> | HTMLElement) {
  function setWaterMark(options: { text: string; color?: string }) {
    const elementValue = toValue(element)
    if (elementValue) {
      //创建一个画布
      const canvas = document.createElement('canvas')
      //设置画布的长宽
      canvas.width = 150
      canvas.height = 120

      const canvas2d = canvas.getContext('2d')!
      //旋转角度
      canvas2d.rotate((-15 * Math.PI) / 180)
      canvas2d.font = '18px Vedana'
      //设置填充绘画的颜色、渐变或者模式
      canvas2d.fillStyle = options.color ? options.color : 'rgba(200, 200, 200, 0.60)'
      //设置文本内容的当前对齐方式
      canvas2d.textAlign = 'left'
      //设置在绘制文本时使用的当前文本基线
      // cans.textBaseline = "Middle";
      //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
      canvas2d.fillText(options.text, canvas.width / 8, canvas.height / 2)

      elementValue.style.background = 'url(' + canvas.toDataURL('image/png') + ') left top repeat'
    }
  }

  function clearWaterMark() {
    const elementValue = toValue(element)
    if (elementValue) {
      elementValue.style.background = 'none'
    }
  }

  return { setWaterMark, clearWaterMark }
}

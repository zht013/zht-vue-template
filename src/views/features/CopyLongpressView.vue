<template>
  <div>
    <ElCard>
      <template #header> 复制 </template>

      <p>
        当前的复制：
        {{ text }}
      </p>
      <ElInput v-if="isSupported" type="text" v-model="inputText">
        <template #append>
          <ElButton @click="copy(inputText)">
            {{ copied ? 'Copied' : 'Copy' }}
          </ElButton>
        </template>
      </ElInput>
      <p v-else>Your browser does not support Clipboard API</p>

      <ElButton v-if="isSupportedHtml" type="primary" @click="copyHtml([sourceHtml])" class="mt-5">
        复制HTML
      </ElButton>
      <p v-else>Your browser does not support Clipboard API</p>
      <div ref="divRef" class="hidden">
        <h2 class="font-bold">复制html</h2>
        <p>
          Lorem ipsum dolor sit amet,
          <em class="text-xl font-bold text-orange-400">consectetur adipisicing elit</em>. Numquam
          consequuntur temporibus aliquam aspernatur, nesciunt cupiditate dolore. Quae iste
          molestiae cupiditate omnis sunt, ut ea harum, nemo eveniet, nisi autem veniam.
        </p>
      </div>
      <div v-if="isCopiedHtml" class="mt-5">
        <code>
          {{ copiedHtml }}
        </code>
      </div>
    </ElCard>

    <ElCard class="mt-5">
      <template #header>长按指令</template>

      <ElButton type="primary" v-longpress="onLongpress">长按默认</ElButton>
      <ElButton type="primary" v-longpress:2000="onLongpressCustom">长按指定时间(2s)</ElButton>
      <ElButton type="primary" v-on-long-press.prevent="handleVueUseLongpress">
        VueUse 长按默认
      </ElButton>
      <ElButton
        type="primary"
        v-on-long-press="[
          handleVueUseLongpressWithOptions,
          {
            delay: 2000,
            modifiers: {
              stop: true
            }
          }
        ]"
      >
        VueUse 长按2s(with options)
      </ElButton>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { useClipboard, useClipboardItems } from '@vueuse/core'
import { vOnLongPress } from '@vueuse/components'
import { vLongpress } from '@/directives'

const inputText = ref('http://www.copy.com/a')
const { text, copy, copied, isSupported } = useClipboard()
const divRef = ref<HTMLDivElement>()

const sourceHtml = computed(() => {
  const mime = 'text/html'
  return new ClipboardItem({
    [mime]: new Blob([divRef.value?.outerHTML!], { type: mime })
  })
})
const copiedHtml = ref('<em>dddddd</em>')
const {
  content,
  copy: copyHtml,
  copied: isCopiedHtml,
  isSupported: isSupportedHtml
} = useClipboardItems()

watch(content, () => {
  Promise.all(content.value.map((item) => item.getType('text/html')))
    .then((blobs) => {
      return Promise.all(blobs.map((blob) => blob.text()))
    })
    .then((texts) => {
      copiedHtml.value = texts.join('')
    })
})

const onLongpress = () => {
  ElMessage.success('长按500ms')
}

const onLongpressCustom = () => {
  ElMessage.success('长按2s')
}

const handleVueUseLongpress = () => {
  ElMessage.success('VueUse 长按')
}

const handleVueUseLongpressWithOptions = () => {
  ElMessage.success('VueUse 长按-带参数')
}
</script>

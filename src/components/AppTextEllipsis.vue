<template>
  <ElTooltip
    v-bind="{
      placement: 'top',
      popperClass: 'max-w-[50%]',
      hideAfter: 0,
      ...tooltipProps,
      content: ''
    }"
    :disabled="!isTextEllipsis"
  >
    <template v-if="$slots.content" #content>
      <slot name="content"></slot>
    </template>
    <template v-else-if="tooltipProps?.content" #content>
      {{ tooltipProps.content }}
    </template>
    <template v-else-if="isTextEllipsis" #content>
      <slot></slot>
    </template>

    <ElText
      ref="textRef"
      v-bind="{
        truncated: !lineClamp,
        lineClamp,
        ...$attrs
      }"
      @mouseover.self="handleHover"
    >
      <slot></slot>
    </ElText>
  </ElTooltip>
</template>

<script setup lang="ts">
import type { ElTooltipProps } from 'element-plus'

const props = defineProps<{
  lineClamp?: string | number
  tooltipProps?: Partial<ElTooltipProps>
}>()
const textRef = ref<HTMLElement>()
const isTextEllipsis = ref(false)

const checkTextEllipsis = (el: HTMLElement) => {
  if (!el) return true

  if (!props.lineClamp) {
    // 单行省略判断
    return el.scrollWidth > el.clientWidth
  } else {
    // 多行省略判断
    return el.scrollHeight > el.clientHeight
  }
}

const handleHover = (event: MouseEvent) => {
  isTextEllipsis.value = checkTextEllipsis(event.target as HTMLElement)
}
</script>

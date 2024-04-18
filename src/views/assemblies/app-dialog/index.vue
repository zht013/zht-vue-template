<template>
  <ElCard>
    <template #header> MessageBox 示例演示 </template>
    <ElSpace :wrap="true">
      <ElButton @click="onSizeBtnClick">自定义大小</ElButton>
      <ElButton @click="onAlertBtnClick">测试alert</ElButton>
      <ElButton @click="onConfirmBtnClick">测试confirm</ElButton>
      <ElButton @click="onHComponentBtnClick">弹出组件</ElButton>
      <ElButton @click="onFullScreenBtnClick">全屏</ElButton>
      <ElButton @click="onAutoFocusBtnClick">自动获取组件内焦点</ElButton>
      <ElButton @click="onDragableBtnClick">可拖拽</ElButton>
    </ElSpace>
  </ElCard>
</template>

<script setup lang="ts">
import { AppDialogSize, appMessageBox } from '@/helpers'
import MessgeComponent from './MessgeComponent.vue'
import AutoFocus from './AutoFocus.vue'
import type { Action } from 'element-plus'

const onSizeBtnClick = () => {
  appMessageBox.open({
    title: '自定义大小',
    size: AppDialogSize.large,
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque magni, tempore impedit accusantium dolores amet perferendis accusamus id alias aliquam quod, omnis tenetur eveniet ullam. Sequi, enim veniam facilis nam beatae quos nisi harum itaque inventore quibusdam distinctio dolores sapiente nesciunt accusamus nostrum, suscipit a natus laudantium rem id sit amet eveniet ipsa? Soluta inventore laudantium quasi sequi, voluptatum illum cumque libero aliquid, officiis quo modi doloribus officia pariatur ratione aliquam maxime molestias. Aspernatur aut debitis autem sint voluptate corrupti nihil officia quam aperiam, quasi ipsam dolorem? Natus deleniti officiis voluptatem consequatur magnam doloribus est, corrupti placeat et velit a. '
  })
}

const onAlertBtnClick = () => {
  appMessageBox.alert('ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, unde.')
}

const onConfirmBtnClick = () => {
  appMessageBox.confirm(
    'ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, unde.',
    '测试confirm'
  )
}

const onHComponentBtnClick = () => {
  appMessageBox.open({
    title: '测试弹出组件',
    message: h(MessgeComponent, {
      mtitle: '关闭'
    })
  })
}

const onFullScreenBtnClick = () => {
  const { close, messageBox } = appMessageBox.open({
    title: '测试全屏',
    size: AppDialogSize.fullScreen,
    message: h(MessgeComponent, {
      mtitle: '关闭',
      onClose: function (action: Action) {
        close(action)
        // appMessageBox.close()
      }
    })
  })

  messageBox.then((action) => {
    console.log(action)
  })
}

const onAutoFocusBtnClick = () => {
  appMessageBox.open({
    autofocus: false,
    title: '自动获取焦点',
    message: h(AutoFocus)
  })
}

const onDragableBtnClick = () => {
  appMessageBox.open({
    title: '可拖拽',
    message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque magni',
    draggable: true
  })
}
</script>

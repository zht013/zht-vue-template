<template>
  <div>
    <AutoUpload />
    <FormUpload />
    <LargeFile />
  </div>
</template>

<script setup lang="ts" name="FileUploadView">
import AutoUpload from './AutoUpload.vue'
import FormUpload from './FormUpload.vue'
import LargeFile from './LargeFile.vue'
</script>

<script lang="ts">
export default {
  name: 'FileUploadView'
}
</script>

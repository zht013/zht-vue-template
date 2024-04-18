<template>
  <ElCard class="mt-3">
    <template #header> 结合表单校验进行手动上传 </template>

    <ElForm ref="formRef" :model="formData" :rules="rules">
      <ElFormItem label="附件" prop="fileList">
        <ElUpload
          class="w-2/4"
          v-model:file-list="formData.fileList"
          :auto-upload="false"
          :accept="acceptTypes"
          :limit="3"
          :drag="true"
          :multiple="true"
          :headers="{ Authorization: authorize.token }"
          :on-error="onUploadError"
          :on-exceed="onUploadExceed"
          :on-change="onFileChanged"
        >
          <ElIcon class="el-icon--upload">
            <IconEpUploadFilled />
          </ElIcon>
          <div class="el-upload__text">点击或拖拽上传</div>

          <template #tip>
            <div class="el-upload__tip">上传文件的大小不超过10MB</div>
          </template>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="日期" prop="date">
        <ElDatePicker
          v-model="formData.date"
          type="date"
          label="选择日期"
          placeholder="选择日期"
          class="w-full"
          value-format="YYYY-MM-DD"
        />
      </ElFormItem>

      <ElFormItem>
        <ElButton
          type="primary"
          @click="submitForm(formRef)"
          :disabled="isUploading"
          :loading="showLoadingStatus"
          >提交</ElButton
        >
        <ElButton @click="resetForm(formRef)" :disabled="isUploading">重置</ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
import { authorize } from '@/helpers'
import { fileService } from '@/services/FileService'
import { refDebounced } from '@vueuse/core'
import type { FormInstance, FormRules, UploadFile, UploadProps, UploadUserFile } from 'element-plus'

interface UploadForm {
  fileList: UploadUserFile[]
  date: string
}

const acceptTypes = '.docx,.csv,.pdf,.txt'
const formRef = ref<FormInstance>()
const formData = reactive<UploadForm>({
  fileList: [],
  date: ''
})
const rules = reactive<FormRules<UploadForm>>({
  fileList: [{ type: 'array', required: true, message: '请选择要上传的文件' }],
  date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }]
})

const onUploadError = (error: Error) => {
  ElMessage.error(error.message)
}

const onUploadExceed = () => {
  ElMessage.warning('最多上传 3 个文件')
}

const onFileChanged: UploadProps['onChange'] = (file: UploadFile) => {
  const ext = file.name.substring(file.name.lastIndexOf('.'))
  let hasError = false
  if (!acceptTypes.includes(ext)) {
    ElMessage.warning(`只能上传 ${acceptTypes} 类型的文件`)

    hasError = true
  } else if (file.size! / 1024 / 1024 > 10) {
    ElMessage.warning(`单个文件大小不能超过10M`)

    hasError = true
  }

  if (hasError) {
    formData.fileList.splice(
      formData.fileList.findIndex((tfile) => tfile.uid === file.uid),
      1
    )
  }
}

const isUploading = ref(false)
const showLoadingStatus = refDebounced(isUploading, 200)
const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return

  form.validate((valid) => {
    if (valid) {
      isUploading.value = true
      fileService
        .uploadForm({
          date: formData.date,
          files: formData.fileList.map((ffile) => ffile.raw as File)
        })
        .then((result) => {
          console.log(result)
        })
        .finally(() => {
          isUploading.value = false
        })
    } else {
      return false
    }
  })
}

const resetForm = (form: FormInstance | undefined) => {
  if (!form) return

  form.resetFields()
}
</script>

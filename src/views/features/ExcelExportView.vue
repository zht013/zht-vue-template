<template>
  <div>
    <ElCard
      class="flex h-[--main-con-full-height] flex-col"
      :body-style="{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }"
    >
      <template #header> 导出excel </template>

      <div class="p-2">
        <ElButton type="primary" @click="handleExportExcel" size="default"> 导出 Excel </ElButton>
      </div>
      <div class="mt-3 min-h-0 flex-1">
        <ElAutoResizer>
          <template #default="{ height, width }">
            <ElTableV2
              :columns="columns"
              :data="data"
              :width="width"
              :height="height"
              fixed
            ></ElTableV2>
          </template>
        </ElAutoResizer>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { utils, writeFile } from 'xlsx'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }))

const generateData = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`

        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 500)

const handleExportExcel = () => {
  // 处理行数据
  const res: string[][] = data.map((item: { [key: string]: string }) => {
    const arr: string[] = []
    columns.forEach((column: { [key: string]: string }) => {
      arr.push(item[column.dataKey])
    })
    return arr
  })

  // 处理表头
  const titleList: string[] = []
  columns.forEach((column: { title: string; [key: string]: string }) => {
    titleList.push(column.title)
  })
  res.unshift(titleList)

  const workSheet = utils.aoa_to_sheet(res)
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, workSheet, '数据报表')

  writeFile(workBook, 'ex-tableV2.xlsx')
}
</script>

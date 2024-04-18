import SparkMD5 from 'spark-md5'

/**
 * 对文件进行 MD5 Hash
 * @param file 要 Hash 的文件
 * @param onProgress Hash 进度
 * @param chunkSize Hash 时的切片大小
 * @returns Hash 值
 */
export function sparkMd5File(
  file: File,
  onProgress?: (percentage: number) => void,
  chunkSize = 1024 * 1024 * 2
) {
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()

  function loadNext() {
    const start = currentChunk * chunkSize
    const end = Math.min(file.size, start + chunkSize)

    fileReader.readAsArrayBuffer(file.slice(start, end))
  }

  loadNext()

  return new Promise<string>((resolve, reject) => {
    fileReader.onload = function (ev: ProgressEvent<FileReader>) {
      spark.append(ev.target?.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        console.log('finished MD5')
        resolve(spark.end())
      }

      if (onProgress) {
        onProgress(Math.round((currentChunk / chunks) * 100))
      }
    }

    fileReader.onerror = function () {
      reject('oops, something went wrong.')
    }
  })
}

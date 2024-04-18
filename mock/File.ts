import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/file/placeholder',
    method: 'get',
    timeout: 10000,
    response: () => {
      console.log('file body', new Date().toLocaleString())
    }
  },
  {
    url: '/file/form',
    response: () => {
      console.log('file body', new Date().toLocaleString())
    }
  },
  {
    url: '/file/upload',
    method: 'post',
    response: () => {
      console.log('file/upload', new Date().toLocaleString())
      return {
        success: true
      }
    }
  },
  {
    url: '/file/merge',
    method: 'post',
    response: ({ body }) => {
      console.log('file/merge', ' ', body.folder, ' ', new Date().toLocaleString())
    }
  },
  {
    url: '/file/verify',
    method: 'post',
    response: () => {
      console.log('file/verify', new Date().toLocaleString())

      return {
        shouldUpload: true,
        uploadedList: []
      }
    }
  },
  {
    url: '/file/cancel-upload',
    method: 'post',
    response: ({ body }) => {
      console.log('file/cancel-upload', ' ', body.folder, ' ', new Date().toLocaleString())

      return {
        success: true
      }
    }
  }
])

import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/wx',
    method: 'post',
    response: (req) => {
      console.log(req.query)

      return {
        name: '测试'
      }
    }
  }
])

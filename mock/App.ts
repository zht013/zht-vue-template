import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/app/config',
    method: 'get',
    // timeout: 2000,
    response: () => {
      return {
        success: true,
        code: 200,
        data: {
          title: 'zht-learn',
          tokenExpiresIn: 30 * 60
        }
      }
    }
  }
])

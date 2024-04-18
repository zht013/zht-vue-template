// 根据角色动态生成路由
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { faker } from '@faker-js/faker'
import { jwtHelper } from './helpers/JWTHelper'

export default defineFakeRoute([
  {
    url: '/user/login',
    method: 'post',
    response: ({ body }) => {
      if (body.password === '123456abc') {
        const token = jwtHelper.sign(
          {
            username: body.username
          },
          body.rememberMeDays ? `${body.rememberMeDays}d` : undefined
        )

        if (body.username === 'admin') {
          return {
            success: true,
            code: 200,
            data: token
          }
        } else {
          return {
            success: true,
            code: 200,
            data: token
          }
        }
      } else {
        return {
          success: false,
          code: 200,
          message: '用户名或密码不正确'
        }
      }
    }
  },
  {
    url: '/user/info',
    method: 'get',
    response: (req, req1, res) => {
      const payload = jwtHelper.verifyToken(req.headers.authorization as string, res)
      if (!payload) {
        return
      }

      if (payload.username === 'admin') {
        return {
          success: true,
          code: 200,
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            username: 'admin',
            roles: ['admin'],
            menus: [''],
            avatar: faker.image.avatar()
          }
        }
      } else {
        return {
          success: true,
          code: 200,
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            username: 'common',
            roles: ['common'],
            menus: [''],
            avatar: faker.image.avatar()
          }
        }
      }
    }
  },
  {
    url: '/user/logout',
    method: 'get',
    response: () => {
      return {
        success: true,
        code: 200
      }
    }
  }
])

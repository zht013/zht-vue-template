import { appHttp } from '@/helpers'

class GithubService {
  async getProjects(): Promise<unknown> {
    const result = await appHttp.get<unknown>('/github/user/followers')

    return result
  }
}

const githubService = new GithubService()

export { githubService }

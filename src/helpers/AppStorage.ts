class AppStorage {
  get local(): Storage {
    return localStorage
  }

  get session(): Storage {
    return sessionStorage
  }
}

const appStorage = new AppStorage()

export { appStorage }

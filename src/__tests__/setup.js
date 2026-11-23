import { beforeEach } from 'vitest'

// The public data cache lives in localStorage; start every test without remembered data.
beforeEach(() => {
  window.localStorage.clear()
})

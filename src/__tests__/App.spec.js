import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import router from '../router'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('App', () => {
  it('mounts App component properly', () => {
    const pinia = createPinia()
    const head = createHead()
    setActivePinia(pinia)

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, head, router],
        directives: {
          reveal: () => {},
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

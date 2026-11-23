import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingIdentityTab from '../components/panel/settings/SettingIdentityTab.vue'
import SettingHeroTab from '../components/panel/settings/SettingHeroTab.vue'

// Simulate the user picking a file in the hidden <input type="file"> of ImageUploader.
const pickFile = async (wrapper, file) => {
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
  await input.trigger('change')
}

const png = () => new File(['x'], 'logo.png', { type: 'image/png' })

describe('Settings image upload fields', () => {
  it('identity tab emits update-logo with the picked file', async () => {
    const wrapper = mount(SettingIdentityTab, {
      props: { form: { logo_url: null, logo_file: null }, errors: {} },
    })

    await pickFile(wrapper, png())

    const events = wrapper.emitted('update-logo')
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBeInstanceOf(File)
  })

  it('hero tab emits update-hero with the picked file', async () => {
    const wrapper = mount(SettingHeroTab, {
      props: { form: { hero_image_url: null, hero_file: null }, errors: {} },
    })

    await pickFile(wrapper, png())

    const events = wrapper.emitted('update-hero')
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBeInstanceOf(File)
  })

  it('rejects files that are not images without emitting', async () => {
    const wrapper = mount(SettingIdentityTab, {
      props: { form: { logo_url: null, logo_file: null }, errors: {} },
    })

    await pickFile(wrapper, new File(['x'], 'catatan.txt', { type: 'text/plain' }))

    expect(wrapper.emitted('update-logo')).toBeUndefined()
    expect(wrapper.text()).toContain('Format file tidak didukung')
  })
})

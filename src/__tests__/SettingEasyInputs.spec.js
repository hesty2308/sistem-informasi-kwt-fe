import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageLinkSelect from '../components/panel/settings/PageLinkSelect.vue'
import { extractMapEmbedUrl } from '../utils/mapEmbed'
import { settingSections, settingNavEntries, settingSectionTitle } from '../config/settingSections'

describe('PageLinkSelect', () => {
  it('lets the user pick a public page instead of typing a path', async () => {
    const wrapper = mount(PageLinkSelect, { props: { modelValue: '/kegiatan', label: 'Halaman Tujuan' } })
    const select = wrapper.find('select')
    expect(select.element.value).toBe('/kegiatan')

    await select.setValue('/galeri')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['/galeri'])
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('shows a free text field for external links when allowed', async () => {
    const wrapper = mount(PageLinkSelect, {
      props: { modelValue: 'https://wa.me/6282188991234', label: 'Tautan', allowExternal: true },
    })
    expect(wrapper.find('select').element.value).toBe('__other__')
    expect(wrapper.find('input').element.value).toBe('https://wa.me/6282188991234')
  })
})

describe('extractMapEmbedUrl', () => {
  it('keeps only the src of a pasted Google Maps iframe', () => {
    const code =
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18&amp;x=1" width="600" height="450" style="border:0;"></iframe>'
    expect(extractMapEmbedUrl(code)).toBe('https://www.google.com/maps/embed?pb=!1m18&x=1')
  })

  it('returns plain URLs and empty values unchanged', () => {
    expect(extractMapEmbedUrl(' https://www.google.com/maps/embed?pb=abc ')).toBe(
      'https://www.google.com/maps/embed?pb=abc'
    )
    expect(extractMapEmbedUrl(null)).toBe('')
  })
})

describe('settingSections', () => {
  it('tells the user where each sub-page appears', () => {
    for (const section of settingSections) {
      expect(section.appearsOn, section.slug).toBeTruthy()
    }
  })

  it('groups the four About pages under "Tentang" in the sidebar', () => {
    const group = settingNavEntries.find((entry) => entry.type === 'group')
    expect(group.label).toBe('Tentang')
    expect(group.sections.map((s) => s.label)).toEqual(['Identitas', 'Visi & Misi', 'Sejarah', 'Pengurus'])
    expect(settingSectionTitle(group.sections[0])).toBe('Tentang - Identitas')
  })
})

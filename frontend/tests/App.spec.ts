import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'
import StockTable from '@/components/StockTable.vue'

describe('App', () => {
  it('renders the title', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('TDD Hands-on')
  })

  it('renders the stock table', () => {
    const wrapper = mount(App)

    expect(wrapper.findComponent(StockTable).exists()).toBe(true)
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import StockTable from '@/components/StockTable.vue'

const stocks = [
  { name: 'A社', shares: 100, price: 1500 },
  { name: 'B社', shares: 200, price: 800 },
]

const cellTexts = (row: { findAll: (s: string) => { text: () => string }[] }) =>
  row.findAll('th, td').map((cell) => cell.text())

describe('StockTable', () => {
  it('renders the headers', () => {
    const wrapper = mount(StockTable, { props: { stocks } })

    expect(cellTexts(wrapper.get('thead tr'))).toEqual(['銘柄', '株数', '価格', '合計'])
  })

  it('renders each stock with shares times price as the total', () => {
    const wrapper = mount(StockTable, { props: { stocks } })

    const rows = wrapper.findAll('tbody tr')
    expect(cellTexts(rows[0]!)).toEqual(['A社', '100', '1500', '150000'])
    expect(cellTexts(rows[1]!)).toEqual(['B社', '200', '800', '160000'])
  })

  it('renders the grand total in the last row with 総計 in the price column', () => {
    const wrapper = mount(StockTable, { props: { stocks } })

    expect(cellTexts(wrapper.get('tfoot tr'))).toEqual(['', '', '総計', '310000'])
  })
})

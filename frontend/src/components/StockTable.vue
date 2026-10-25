<script setup lang="ts">
import { computed } from 'vue'

export type Stock = {
  name: string
  shares: number
  price: number
}

const props = defineProps<{ stocks: Stock[] }>()

const grandTotal = computed(() =>
  props.stocks.reduce((sum, stock) => sum + stock.shares * stock.price, 0),
)
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>銘柄</th>
        <th>株数</th>
        <th>価格</th>
        <th>合計</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stock in stocks" :key="stock.name">
        <td>{{ stock.name }}</td>
        <td>{{ stock.shares }}</td>
        <td>{{ stock.price }}</td>
        <td>{{ stock.shares * stock.price }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td></td>
        <th>総計</th>
        <td>{{ grandTotal }}</td>
      </tr>
    </tfoot>
  </table>
</template>

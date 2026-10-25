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
  <table class="border-collapse text-sm">
    <thead>
      <tr>
        <th class="border border-gray-300 bg-gray-100 px-4 py-2">銘柄</th>
        <th class="border border-gray-300 bg-gray-100 px-4 py-2">株数</th>
        <th class="border border-gray-300 bg-gray-100 px-4 py-2">価格</th>
        <th class="border border-gray-300 bg-gray-100 px-4 py-2">合計</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stock in stocks" :key="stock.name">
        <td class="border border-gray-300 px-4 py-2">{{ stock.name }}</td>
        <td class="border border-gray-300 px-4 py-2 text-right">{{ stock.shares }}</td>
        <td class="border border-gray-300 px-4 py-2 text-right">{{ stock.price }}</td>
        <td class="border border-gray-300 px-4 py-2 text-right">
          {{ stock.shares * stock.price }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="border border-gray-300 px-4 py-2 text-right"></td>
        <td class="border border-gray-300 px-4 py-2 text-right"></td>
        <th class="border border-gray-300 bg-gray-100 px-4 py-2">総計</th>
        <td class="border border-gray-300 px-4 py-2 text-right">{{ grandTotal }}</td>
      </tr>
    </tfoot>
  </table>
</template>

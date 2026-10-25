<script setup lang="ts">
import StockTable, { type Stock } from '@/components/StockTable.vue'

const stocks: Stock[] = [
  { name: 'A社', shares: 100, price: 1500 },
  { name: 'B社', shares: 200, price: 800 },
]
</script>

<template>
  <h1>TDD Hands-on</h1>
  <StockTable :stocks="stocks" />
</template>

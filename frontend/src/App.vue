<script setup lang="ts">
import StockTable, { type Stock } from '@/components/StockTable.vue'

const stocks: Stock[] = [
  { name: 'IBM', shares: 1000, price: 25 },
  { name: 'GE', shares: 400, price: 100 },
]
</script>

<template>
  <main class="p-8">
    <h1 class="mb-4 text-2xl font-bold">TDD Hands-on</h1>
    <StockTable :stocks="stocks" />
  </main>
</template>

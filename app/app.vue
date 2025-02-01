<script setup>
import { useSeoMeta, useHead } from '#imports'
import { NuxtLoadingIndicator, NuxtPage, NuxtRouteAnnouncer } from '#components'
import Toaster from '@/components/ui/toast/Toaster.vue'

useSeoMeta({
  title: 'imagene',
  description: 'Generate images with AI',
})

useHead({
  htmlAttrs: {
    class: 'dark',
  },
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
  <Toaster />
</template>

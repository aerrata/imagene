<script setup>
import { ref, reactive } from '#imports'
import { useToast } from '@/components/ui/toast/use-toast'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader, Sparkles } from 'lucide-vue-next'

const { toast } = useToast()

const form = reactive({
  prompt: '',
  style: 'none',
  steps: 4,
})

const loading = ref(false)
const image = ref('')

const generateImage = async () => {
  if (loading.value || !form.prompt) return
  loading.value = true

  try {
    const { pathname } = await $fetch('/api/generate', {
      method: 'post',
      body: {
        prompt: form.prompt,
        style: form.style,
        steps: form.steps,
      },
    })
    image.value = `/images/${pathname}`
  } catch (error) {
    toast({ title: 'Error', description: error.message })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-10 w-full min-h-screen max-w-lg mx-auto px-4 lg:px-0 pt-6 pb-20 sm:py-10">
    <h1 class="text-3xl font-bold text-center">imagene</h1>

    <form class="w-full" @submit.prevent="generateImage()">
      <div class="space-y-4">
        <div class="grid w-full gap-1.5">
          <Label>Image prompt</Label>
          <Textarea v-model="form.prompt" placeholder="A cat driving a sport car in a game" />
        </div>

        <div class="grid w-full gap-1.5">
          <Label>Image style</Label>
          <Select v-model="form.style">
            <SelectTrigger>
              <SelectValue placeholder="Select an image style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">none</SelectItem>
                <SelectItem value="photorealistic">photorealistic</SelectItem>
                <SelectItem value="comic-book">comic-book</SelectItem>
                <SelectItem value="neon-punk">neon-punk</SelectItem>
                <SelectItem value="isometric">isometric</SelectItem>
                <SelectItem value="line-art">line-art</SelectItem>
                <SelectItem value="pixel-art">pixel-art</SelectItem>
                <SelectItem value="3d-model">3d-model</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="grid w-full gap-4">
          <div class="flex justify-between">
            <Label>Number of steps</Label>
            <Label>{{ form.steps }}</Label>
          </div>
          <Slider :modelValue="[form.steps]" @update:modelValue="(value) => (form.steps = value[0])" :min="1" :max="8" />
        </div>
      </div>

      <Button type="submit" :disabled="!form.prompt" class="w-full mt-10">
        <Loader v-if="loading" class="size-4 animate-spin" />
        <Sparkles v-else class="size-4" />
        {{ loading ? 'Generating..' : 'Generate' }}
      </Button>
    </form>

    <img v-if="image" :src="image" class="w-full rounded-md" />
  </div>
</template>

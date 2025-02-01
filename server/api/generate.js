import { eventHandler, readValidatedBody, hubBlob, hubAI } from '#imports'
import { z } from 'zod'

const model = '@cf/black-forest-labs/flux-1-schnell'

const imageStyles = {
  none: '',
  photorealistic: ', photorealistic, highly detailed, 8k, sharp focus, perfect lighting, high quality, professional',
  'comic-book': 'comic book, bold outlines, flat colors, action lines',
  'neon-punk': ', cyberpunk, neon lights, high contrast, futuristic',
  isometric: 'isometric projection, 3D geometric style',
  'line-art': 'line art, black and white, clean lines, minimalist',
  'pixel-art': 'pixel art, pixel illustration, pixel drawing, pixel graphic novel, pixel superhero',
  '3d-model': '3d model, realistic textures, studio lighting',
}

export default eventHandler(async (event) => {
  const { prompt, steps, style } = await readValidatedBody(
    event,
    z.object({
      prompt: z.string().min(1, 'Prompt must be at least 1 character long').max(2048, 'Prompt cannot exceed 2048 characters'),
      steps: z.number().int().max(8, 'Steps cannot exceed 8').default(4),
      style: z.enum(Object.keys(imageStyles)).default('none'),
    }).parse
  )

  const { image } = await hubAI().run(model, {
    prompt: `${prompt}, ${imageStyles[style]}`,
    num_steps: steps,
  })

  const blob = new Blob([Buffer.from(image, 'base64')], { type: 'image/png' })

  const pathname = `${Date.now()}.png`

  const blobObject = await hubBlob().put(pathname, blob, {
    customMetadata: {
      prompt,
      style,
      steps: String(steps),
    },
  })

  return blobObject
})

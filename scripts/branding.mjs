import fs from 'node:fs/promises'
import sharp from 'sharp'

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="256" fill="#dcebf2"/><circle cx="256" cy="256" r="220" fill="#659eb9"/><path d="M126 328V184h30l41 79 41-79h30v144h-32v-83l-39 72-39-72v83zM292 184h104v32h-70v29h61v31h-61v52h-34z" fill="#fff"/></svg>'
await fs.mkdir('public/favicon', { recursive: true })
await fs.writeFile('public/favicon/favicon.svg', svg)
// Generate favicons only; preserve the user-provided avatar.
for (const [name, size] of [
  ['apple-touch-icon', 180],
  ['favicon-32x32', 32],
  ['favicon-16x16', 16],
  ['android-chrome-192x192', 192],
  ['android-chrome-512x512', 512]
]) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile('public/favicon/' + name + '.png')
}
const png = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header[6] = 32
header[7] = 32
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(22, 18)
await fs.writeFile('public/favicon/favicon.ico', Buffer.concat([header, png]))
await fs.writeFile(
  'public/favicon/site.webmanifest',
  JSON.stringify(
    {
      name: 'MF_xian Blog',
      short_name: 'MF_xian Blog',
      start_url: '/',
      display: 'standalone',
      theme_color: '#659eb9',
      background_color: '#fcfcfd',
      icons: [
        { src: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    null,
    2
  ) + '\n'
)
console.log('MF avatar and favicon assets generated')

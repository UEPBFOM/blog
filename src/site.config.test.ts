import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'

import config, { integ } from './site.config'
import { identity } from './site.identity'

const SITE_NAME = 'MF_xian Blog'
const FORMER_SITE_NAME = ['MF_xian', 'Personal', 'Blog'].join(' ')
const ROOT = join(import.meta.dir, '..')

function textFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.astro') continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      out.push(...textFiles(path))
      continue
    }
    if (/\.(astro|css|html|json|md|mdx|ts|tsx|txt|webmanifest|xml)$/.test(entry)) out.push(path)
  }
  return out
}

describe('site name', () => {
  test('personal installation has its own identity and no active upstream services', () => {
    expect(identity.name).toBe('MF_xian')
    expect(identity.github).toBe('https://github.com/UEPBFOM')
    expect(integ.waline.enable).toBe(false)
    expect(integ.waline.server).toBe('')
    const layout = readFileSync(join(import.meta.dir, 'layouts/BaseLayout.astro'), 'utf8')
    expect(layout).not.toMatch(/umami|data-website-id|<Analytics|<SpeedInsights/)
  })
  test('config title is MF_xian Blog for nav, titles, meta, OG, and RSS', () => {
    expect(config.title).toBe(SITE_NAME)
    const cardName = integ.links?.applyTip?.find((item) => item.name === 'Name')?.val
    expect(cardName).toBe(SITE_NAME)

    const zhRss = readFileSync(join(import.meta.dir, 'pages/rss.xml.ts'), 'utf8')
    const enRss = readFileSync(join(import.meta.dir, 'pages/en/rss.xml.ts'), 'utf8')
    expect(zhRss).toContain('title: config.title,')
    expect(enRss).toContain('title: `${config.title} (EN)`,')
  })

  test('web app manifest uses the site name', () => {
    const manifest = JSON.parse(
      readFileSync(join(ROOT, 'public/favicon/site.webmanifest'), 'utf8')
    ) as { name: string; short_name: string }
    expect(manifest.name).toBe(SITE_NAME)
    expect(manifest.short_name).toBe(SITE_NAME)
  })

  test('nav brand stays on one line', () => {
    const header = readFileSync(join(import.meta.dir, 'components/Header.astro'), 'utf8')
    expect(header).toContain('whitespace-nowrap')
    expect(header).toContain('{config.title}')
  })

  test('the former site name is gone from source and static pages', () => {
    const paths = [
      ...textFiles(join(ROOT, 'src')),
      ...textFiles(join(ROOT, 'public')),
      join(ROOT, 'DESIGN.md')
    ]
    const hits = paths.filter((path) => readFileSync(path, 'utf8').includes(FORMER_SITE_NAME))
    expect(hits).toEqual([])
  })
})

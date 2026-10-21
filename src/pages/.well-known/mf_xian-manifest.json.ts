import type { APIRoute } from 'astro'
import { identity, siteUrl } from '@/site.identity'

import { buildSiteFs } from '@/components/terminal/fs/server'

export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify({
      version: '0.1',
      name: identity.title,
      site: siteUrl,
      description: identity.description,
      tree: await buildSiteFs(),
      links: { github: identity.github, rss: siteUrl + '/rss.xml' }
    }),
    { headers: { 'content-type': 'application/json; charset=utf-8' } }
  )

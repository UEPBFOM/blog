---
title: 'How frontend and backend communicate'
description: 'Follow an article request from the browser to the server.'
date: 2026-10-21
type: note
status: ready
tags: ['web', 'learning']
language: en
translationKey: first-note
---

When a reader opens a post, the frontend may send a GET request. The backend selects a handler by method and path, checks permissions, loads the data, and returns a response.

The frontend handles presentation and interaction. The backend handles business rules and data access. This blog stores posts as Astro content files and does not need a database.

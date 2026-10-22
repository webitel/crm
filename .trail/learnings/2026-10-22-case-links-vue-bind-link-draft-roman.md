---
title: "case-links.vue: bind link draft inputs with v-model"
author: Roman
date: 2026-10-22
standing: true
id: l-be9a9af3
scope: repo
status: active
touches:
  - src/modules/cases/modules/attachments/modules/links/components/case-links.vue
---

## Decided
In `src/modules/cases/modules/attachments/modules/links/components/case-links.vue`, bind the `wt-input-text` fields straight to the `linkDraft` properties (`linkDraft.url`, `linkDraft.name`) with `v-model`. Do not use `:model-value` plus `@update:model-value="linkDraft.x = $event"` or separate update handlers.
Example: in PR #1136, the url and name inputs used a manual `:model-value` and `@update:model-value` pair, and the reviewer asked for `v-model`.

_From review on #1136 here, merged Oct 1._

---
title: "contacts-table.vue: reuse the existing column enum, not new literals"
author: Roman
date: 2026-10-22
standing: true
id: l-080f40b9
scope: repo
status: active
touches:
  - src/modules/contacts/_shared/components/contacts-table.vue
---

## Decided
In `src/modules/contacts/_shared/components/contacts-table.vue`, build lists such as `communicationColumns` from the enum that already exists for contact columns. Do not repeat string literals.
Example: in PR #1117, `communicationColumns` was written with hardcoded values and the reviewer asked to use the existing enum.

_From review on #1117 here, merged Sep 15._

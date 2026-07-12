# Feature: Notification Preferences

> **Status:** Active &nbsp;·&nbsp; **Owner:** \<name\> &nbsp;·&nbsp; **Requirements covered:** 7–8
>
> **Shape:** config-only — a single settings form, no list, no delete. Use this spec as the template for "settings"-style modules.

## Context

Every user needs to control how and when they receive notifications (email, in-app, digest frequency). Unlike `item-catalog`, this feature has **no list view and no delete flow** — there is exactly one settings record per user, edited in place.

## Functional requirements

Use RFC 2119 (MUST / SHOULD / MAY) and stable IDs `RF-NOTIF-NN`.

- **RF-NOTIF-01:** Any authenticated user MUST be able to view their current notification preferences.
- **RF-NOTIF-02:** Any authenticated user MUST be able to update their preferences (channel toggles, digest frequency) via a single form.
- **RF-NOTIF-03:** The system MUST persist changes immediately on save, with a confirmation toast, and MUST NOT require a page reload to reflect the new state.
- **RF-NOTIF-04:** If no preferences exist yet for a user, the system MUST show sensible defaults rather than an empty/broken form.

## Non-functional requirements

- Applies: `RNF-GLOBAL-01` (auth — a user can only edit their own preferences), `RNF-GLOBAL-02` (i18n/a11y).

## Main flows

### Flow 1 — Update preferences (happy path)
1. User opens their notification settings.
2. Toggles a channel and/or changes digest frequency.
3. Submits; server action validates and persists; success toast shown; form reflects saved state.

### Flow 2 — First-time defaults
1. User with no existing preference record opens the settings page.
2. System renders the form pre-filled with default values (not an empty state).
3. On first save, a preferences record is created for that user.

## Business rules

- **[BR-02](../../01-business-rules.md):** a user can only read/write their own preferences record — enforced server-side, not just hidden in the UI.

## Acceptance criteria (Gherkin)

```gherkin
Scenario: Update notification channel
  Given a user is on their notification preferences page
  When they disable the "email" channel and save
  Then the preference is persisted
  And a success notification is shown
  And reloading the page shows "email" still disabled

Scenario: Defaults shown for a first-time user
  Given a user has no notification preferences record yet
  When they open the settings page
  Then the form is pre-filled with default values
  And saving creates a new preferences record
```

- [ ] AC-NOTIF-01 — preferences persist and reload correctly.
- [ ] AC-NOTIF-02 — defaults are shown for users without an existing record.
- [ ] AC-NOTIF-03 — a user cannot read or write another user's preferences.

## Dependencies

- **Requires:** none (self-contained example).
- **Affects:** none.

## Open questions

- None — this is a template example. Replace with real open questions for your feature.

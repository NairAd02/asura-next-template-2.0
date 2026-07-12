# Edge Cases: Notification Preferences

> Corner cases, validation failures, and exceptional flows kept out of `spec.md`. Add entries as they are discovered (code review, QA, production).

| ID | Scenario | Expected behavior | Source |
|---|---|---|---|
| EC-NOTIF-01 | User disables every notification channel | Allowed, but show a non-blocking warning that they will receive no notifications | RF-NOTIF-02 |
| EC-NOTIF-02 | Save request fails (network/server error) | Show an error toast; keep the form's unsaved values so the user doesn't lose their edits | RF-NOTIF-03 |
| EC-NOTIF-03 | User's account is deactivated while preferences page is open | Subsequent save attempts MUST be rejected server-side (`RNF-GLOBAL-01`) | BR-02 |

## Notes

- This file is a generic example — add real edge cases as they surface during implementation and QA.

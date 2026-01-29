Playwright selector recommendations
===============================

- Use a stable test hook for controls that are UI/label text sensitive.
- Add `data-testid` attributes to inputs that tests must reliably locate.

Example: for the Comparison Mode checkbox in `LifeInsuranceTool.tsx` add:

```tsx
<input data-testid="comparison-mode" type="checkbox" />
```

In Playwright tests, prefer `getByTestId` when the visible label may change or the
control is rendered inside complex markup. Example:

```ts
await page.getByTestId('comparison-mode').check()
```

This avoids brittle role/label matching when layout or helper text changes.

-- Recommendation by the development agent

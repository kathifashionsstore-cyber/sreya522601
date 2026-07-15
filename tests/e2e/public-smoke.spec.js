import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const axeSource = fs.readFileSync(path.join(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8')

async function runAxe(page) {
  await page.addScriptTag({ content: axeSource })
  return page.evaluate(async () => window.axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
  }))
}

test('home page renders and has no critical accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading').first()).toBeVisible()
  const results = await runAxe(page)
  const critical = results.violations.filter((violation) => violation.impact === 'critical')
  expect(critical).toEqual([])
})

test('404 route renders', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByText(/not found/i)).toBeVisible()
})

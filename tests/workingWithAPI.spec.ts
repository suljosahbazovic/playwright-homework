import { test, expect } from '@playwright/test';

 test.beforeEach( async({page}) => {
  await page.goto('https://conduit.bondaracademy.com')
})

test('Demo test', async ({page}) => {
  await page.getByRole('link', { name: 'Sign in' }).click()
  await page.getByPlaceholder('Email').fill('pwtest@test.com')
  await page.getByPlaceholder('Password').fill('Welcome2')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('link', { name: 'New Article' }).click()

  const randomTitle = `Test Article  ${Date.now()}`;
  const articleBody = 'This is test article body content';

  await page.getByPlaceholder('Article Title').fill(randomTitle)
  await page.getByPlaceholder("What's this article about?").fill('Short description for test')
  await page.getByPlaceholder('Write your article (in markdown)').fill(articleBody)
  await page.getByPlaceholder('Enter tags').fill('test, demo')
  await page.getByRole('button', { name: 'Publish Article' }).click()
  
  await expect(page.locator('.banner h1')).toHaveText(randomTitle)
  await expect(page.locator('.article-content')).toContainText(articleBody)
});
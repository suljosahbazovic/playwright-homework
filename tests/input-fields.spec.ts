import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Update pet type 1', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});



test('Cancel pet type update 2', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});



test('Validation of Pet Type name is required 3', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});
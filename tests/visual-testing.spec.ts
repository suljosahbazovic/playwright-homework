import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe('NavBar OWNERS', () => {
  test.beforeEach(async ({ page }) => {
    //1. Navigate to the ONWERS menu and select the "ADD NEW" menu item
    await page.getByRole('button', {name: 'Owners'}).click()
    await page.getByRole('link', {name: 'Add New'}).click()
  })
  test('1. Visual Testing', { tag: ['@testing', '@visual'] }, async ({ page }) => {
    //2. On the New Owner page, add a visual assertion that the "Add Owner" button is grayed out and inactive
    const addOwnerButton = page.getByRole('button', { name: 'Add Owner'})

    await expect(addOwnerButton).toBeDisabled()
    await expect(addOwnerButton).toHaveCSS('opacity', '0.65')
    await expect(addOwnerButton).toHaveScreenshot('add-owner-disabled.png')

    //3. Fill out the owner information form
    await page.locator('input[name="firstName"]').fill('Suljo')
    await page.locator('input[name="lastName"]').fill('Sahbazovic')
    await page.locator('input[name="address"]').fill('Address 279E')
    await page.locator('input[name="city"]').fill('Sarajevo')
    await page.locator('input[name="telephone"]').fill('0611234567')

    //4. Add a visual assertion that the "Add Owner" button became active
    await expect(addOwnerButton).toBeEnabled()
    await expect(addOwnerButton).toHaveScreenshot('add-owner-active.png')
  })
})
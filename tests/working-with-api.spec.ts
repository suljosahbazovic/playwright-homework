import { test, expect, request } from '@playwright/test'
import ownersinformation from '../test-data/ownersinformation.json'

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/owners', async route => {
    await route.fulfill({
      body: JSON.stringify(ownersinformation)
    })
  })
  await page.goto('https://petclinic.bondaracademy.com/')
})

test('Mocking API Response - Display owners and their pets', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Petclinic' })).toBeVisible()
    //1. Navigate to the Owners page. Two owners have to be displayed in the list of owners. Use any random names, as well as other owner details. The first owner should have 2 pets, the second owner should have 5 pets (names of pets should be displayed in the pets column)
    await page.getByRole('button', {name: 'Owners'}).click()
    await page.getByRole('link', {name: 'Search'}).click()

    const firstOwnerRow = page.getByRole('row', { name: 'Suljo Sahbazovic' })
    const secondOwnerRow = page.getByRole('row', { name: 'Mirza Sahbazovic' })
    const firstOwnerPets = firstOwnerRow.locator('td').nth(4)
    const secondOwnerPets = secondOwnerRow.locator('td').nth(4)

    await expect(firstOwnerRow).toBeVisible()
    await expect(secondOwnerRow).toBeVisible()
    await expect(firstOwnerPets.locator('tr')).toHaveCount(2)
    await expect(secondOwnerPets.locator('tr')).toHaveCount(5)

    //2. Add the assertion that the length of the Owners list should be 2
    const ownersList = page.locator('tbody > tr')
    await expect(ownersList).toHaveCount(2)

    //3. Select the first owner. The owner information page should open.
    await page.route('**/api/owners/1001', async route => {
    await route.fulfill({
            status: 200,
            body: JSON.stringify(ownersinformation.find(owner => owner.id === 1001))
        })
    })
    await page.getByRole('link', { name: 'Suljo Sahbazovic' }).click()

    //4. Owner details should match the information from the Owners page. Add the assertions accordingly
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()

    //5. Add the assertions that the Owner Information page has two pets and their names match the names from the Owners page
    const ownerPets = page.locator('app-pet-list')
    await expect(ownerPets).toHaveCount(2)
    await expect(ownerPets.nth(0)).toContainText('Lessy')
    await expect(ownerPets.nth(1)).toContainText('Tom & Jerry')

    //6. The first pet should have a history of 10 visits displayed on the Owner Information page
    await expect(page.locator('app-pet-list').first().locator('app-visit-list tr:has(td)')).toHaveCount(10)

    //7. Add the assertion that the length of the list with visits is 10
    expect((await page.locator('app-pet-list').first().locator('app-visit-list tr:has(td)').all()).length).toBe(10)
})
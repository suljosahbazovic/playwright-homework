import { expect } from '@playwright/test'
import { test } from '../fixtures'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Test with fixture', async ({ page, ownerWithPetAndVisit }) => {
    await page.getByRole('button', {name: 'Owners'}).click()
    await page.getByRole('link', {name: 'Search'}).click()

    await page.locator('input[name="lastName"]').fill('Sahbazovic')
    await page.getByRole('button', { name: 'Find Owner'}).click()

    await page.getByRole('link', { name: 'Suljo Sahbazovic' }).click()

    const mickeyDogPetAndVisits = page.locator('app-pet-list', { hasText: 'Micky Dog' })
    const massageTherapyVisitRow = mickeyDogPetAndVisits.locator('app-visit-list tr', { hasText: 'massage therapy' })
    await massageTherapyVisitRow.getByRole('button', { name: 'Delete Visit' }).click()
    await page.waitForResponse('**/*/visits/*')
    await expect(massageTherapyVisitRow).not.toBeVisible()
    await mickeyDogPetAndVisits.getByRole('button', { name: 'Delete Pet' }).click()
    await page.waitForResponse('**/*/pets/*')
    await expect(mickeyDogPetAndVisits).not.toBeVisible()
})
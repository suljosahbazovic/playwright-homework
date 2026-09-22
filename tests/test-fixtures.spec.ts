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
    const visit = mickeyDogPetAndVisits.locator('app-visit-list tr').filter({ hasText: 'massage therapy' })
    await mickeyDogPetAndVisits.locator('app-visit-list tr').nth(1).getByRole('button', { name: 'Delete Visit' }).click()
    await expect(visit).not.toBeVisible()
    
    await mickeyDogPetAndVisits.getByRole('button', { name: 'Delete Pet' }).click()
    await expect(mickeyDogPetAndVisits).not.toBeVisible()
})
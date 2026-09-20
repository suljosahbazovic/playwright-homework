import { test as base, expect } from '@playwright/test'

type Fixtures = {
    ownerId:    number
    petId:      number
    visitId:    number
}

export const test = base.extend<{ testData: Fixtures }>({
    testData: async ({ request }, use) => {
        const ownerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners',
            {
                data: {
                    firstName: 'Suljo',
                    lastName: 'Sahbazovic',
                    address: 'Test 279E',
                    city: 'Sarajevo',
                    telephone: '061728392'
                } 
            }
        )
        expect(ownerResponse.status()).toEqual(201)
        const ownerResponseBody = await ownerResponse.json()
        const ownerId = ownerResponseBody.id

        const petResponse = await request.post(
            `https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`,
            {
                data: {
                    name: 'Micky Dog',
                    birthDate: '2000-09-07',
                    type: {
                        name: 'dog',
                        id: 2936
                    }
                }
            }
        )
        expect(petResponse.status()).toEqual(201)
        const petJSON = await petResponse.json()
        const petId = petJSON.id

        const visitResponse = await request.post(
            `https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`,
            {
                data: {
                    date: '2026-07-20',
                    description: 'massage therapy'
                }
            }
        )
        expect(visitResponse.status()).toEqual(201)
        const visitJSON = await visitResponse.json()
        const visitId = visitJSON.id
        
        await use({ ownerId, petId, visitId })

        const deleteOwnerResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}`)
        expect(deleteOwnerResponse.status()).toEqual(204)
    }
})

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Test with fixture', async ({ page, testData }) => {
    // console.log(testData.ownerId)
    // console.log(testData.petId)
    // console.log(testData.visitId)

    await page.getByRole('button', {name: 'Owners'}).click()
    await page.getByRole('link', {name: 'Search'}).click()

    await page.locator('input[name="lastName"]').fill('Sahbazovic')
    await page.getByRole('button', { name: 'Find Owner'}).click()

    await page.getByRole('link', { name: 'Suljo Sahbazovic' }).click()
    await page.waitForResponse('**/*/owners/*')

    const mickeyDogPetAndVisits = page.locator('app-pet-list', { hasText: 'Micky Dog' })
    const visit = mickeyDogPetAndVisits.locator('app-visit-list tr').filter({ hasText: 'massage therapy' })
    await mickeyDogPetAndVisits.locator('app-visit-list tr').nth(1).getByRole('button', { name: 'Delete Visit' }).click()
    await expect(visit).not.toBeVisible()
    
    await mickeyDogPetAndVisits.getByRole('button', { name: 'Delete Pet' }).click()
    await expect(mickeyDogPetAndVisits).not.toBeVisible()

    await page.getByRole('button', {name: 'Back'}).click()
    await expect(page.locator('tbody tr').last()).not.toHaveText('Suljo Sahbazovic')
})
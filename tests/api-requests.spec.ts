import { test, expect } from '@playwright/test'

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Performing API Request - Validation of delete specialty', async ({ page, request }) => {
    //1. Using API request, create a new specialty with the name "api testing expert". Add assertion of the response status code
    const specialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: { name: 'api testing expert' }
    })
    expect(specialtyResponse.status()).toEqual(201)

    //2. Navigate to the Specialties page
    await page.getByRole('link', { name: 'Specialties' }).click()

    //3. Add the assertion that the specialty "api testing expert" is displayed in the list of specialties
    await expect(page.locator('input[name="spec_name"]').last()).toHaveValue('api testing expert')

    //4. Click the "Delete" button for the "api testing expert" specialty
    await page.getByRole('row', { name: 'api testing expert' }).getByRole('button', { name: 'Delete' }).click()

    //5. Add an assertion that the specialty "api testing expert" is deleted from the list of specialties
    await expect(page.locator('input[name="spec_name"]').last()).not.toHaveValue('api testing expert')
})

test('Performing API Request - Add and delete veterinarian', async ({ page, request }) => {
    //1. Using API, create a new Veterinarian without the specialties assigned. Save the veterinarian ID from the response to the constant for later use. Add assertion of the response status code and name of the veterinarian
    const veterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: { firstName: 'API', lastName: 'Testing', specialties: [] }
    })
    expect(veterinarianResponse.status()).toEqual(201)
    const veterinarianResponseBody = await veterinarianResponse.json()
    const veterinarianId = veterinarianResponseBody.id

    expect(veterinarianResponseBody.firstName).toEqual('API')
    expect(veterinarianResponseBody.lastName).toEqual('Testing')

    //2. Navigate to the Veterinarians page
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()

    //3. Add the assertion that newly created veterinarian is available in the list, and it does not have specialties assigned
    const veterinarianRow = page.getByRole('row', { name: 'API Testing' })
    await expect(veterinarianRow).toBeVisible()
    await expect(veterinarianRow.locator('td').nth(1)).toBeEmpty()
    
    //4. Click the "Edit Vet" button for the newly created veterinarian
    await veterinarianRow.getByRole('button', { name: 'Edit Vet' }).click()

    //5. On "Edit Veterinarian" page, select "dentistry" specialty from the drop-down, and click the Save Vet button
    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: 'dentistry'}).check()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()

    //6. Add the assertion that the "dentistry" specialty is displayed for the test veterinarian
    await expect(veterinarianRow).toContainText('dentistry')

    //7. Using API request, delete the created test veterinarian. Add assertion of response status code. (Tip: use the ID from the step 1)
    const deleteVeterinarianResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${veterinarianId}`)
    expect(deleteVeterinarianResponse.status()).toEqual(204)

    //8. Using API request, get the list of veterinarians. Make the assertion that the deleted veterinarian does not exist in the response body
    const veterinariansResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets')
    expect(veterinariansResponse.status()).toEqual(200)
    const veterinariansResponseBody = await veterinariansResponse.json()
    const veterinarian = veterinariansResponseBody.find(
        (vet: { id: number }) => vet.id === veterinarianId
    )
    expect(veterinarian).toBeUndefined()
})

test('Performing API Request - New specialty is displayed', async ({ page, request }) => {
    //1. Using API request, create a new specialty with the name "api testing ninja". Add assertion of the response status code
    const specialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: { name: 'api testing ninja' }
    })
    expect(specialtyResponse.status()).toEqual(201)
    const specialtiesJSON = await specialtyResponse.json()
    const specialtiesId = specialtiesJSON.id

    const specialtiesResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')
    const specialties = await specialtiesResponse.json()
    const surgery = specialties.find(
        (specialty: { id: number; name: string }) => specialty.name === 'surgery'
    )

    //2. Using API request, create a new veterinarian with a specialty "surgery". Add assertion of the response status code.
    const veterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
            data: { firstName: 'API',
                    lastName: 'Testing',
                    specialties: [{
                        id:     surgery.id,
                        name:   surgery.name
                    }]}
    })
    expect(veterinarianResponse.status()).toEqual(201)
    const veterinarianResponseBody = await veterinarianResponse.json()
    const veterinarianId = veterinarianResponseBody.id

    //3. Navigate to the Veterinarians page
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()

    //4. Add the assertion that newly created veterinarian is available in the list and it has specialty "surgery"
    const veterinarianAPITestingRow = page.getByRole('row', { name: 'API Testing' })
    await expect(veterinarianAPITestingRow).toContainText('surgery')

    //5. Click on the "Edit Vet" button
    await veterinarianAPITestingRow.getByRole('button', { name: 'Edit Vet' }).click()

    //6. On Edit Veterinarian page, change the specialty from "surgery" to "api testing ninja" and click "Save Vet" button
    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: 'api testing ninja'}).check()
    await page.getByRole('checkbox', { name: 'surgery'}).uncheck()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()

    //7. Add the assertion that the veterinarian has a specialty "api testing ninja"
    await expect(veterinarianAPITestingRow).toContainText('api testing ninja')

    //8. Using an API request, delete the created test veterinarian. Add assertion of the response status code
    const deleteVeterinarianAPITestingResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${veterinarianId}`)
    expect(deleteVeterinarianAPITestingResponse.status()).toEqual(204)

    //9. Using API request, delete the specialty "api testing ninja". Add assertion of the response status code
    const deleteSpecialtiesAPITestingResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtiesId}`)
    expect(deleteSpecialtiesAPITestingResponse.status()).toEqual(204)

    //10. Navigate to the Specialties page and add an assertion that "api testing ninja" does not exist in the list of specialties
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.locator('input[name="spec_name"]').last()).not.toHaveValue('api testing ninja')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(veterinarianAPITestingRow).not.toBeVisible()
})
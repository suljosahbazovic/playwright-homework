import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
})

    test.describe('NavBar Petclinic OWNERS - Datepickers', () => {
        test.beforeEach(async ({ page }) => {
            //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            await page.getByRole('button', {name: 'Owners'}).click()
            await page.getByRole('link', {name: 'Search'}).click()
        })

    test('1. Select the desired date in the calendar', async ({ page }) => {
        //2. In the list of the Owners, locate the owner by the name "Harold Davis" and select this owner
        await page.getByRole('link', { name: 'Harold Davis' }).click()
        // const haroldDavisRowOwners = page.getByRole('row', { name: 'Harold Davis' })
        // await haroldDavisRowOwners.getByRole('link', { name: 'Harold Davis' }).click()

        //3. On the Owner Information page, select the "Add New Pet" button
        await page.getByRole('button', { name: 'Add New Pet' }).click()

        //4. In the Name field, type any new pet name, for example, "Tom"
        // await page.waitForResponse('**/api/owners/')
        const newPetForm = page.locator('app-pet-add form')
        const newPetNameInput = newPetForm.locator('#name')
        await newPetNameInput.fill('Tom')

        //5. Add the assertion of icon in the input field, that it changed from "X" to "V"
        await expect(newPetForm.locator('.glyphicon-ok')).toBeVisible()

        //6. Click on the calendar icon for the "Birth Date" field
        await newPetForm.getByRole('button', { name: 'Open calendar' }).click()

        const calendarHeader = page.locator('mat-calendar-header')
        const chooseDateYearButton = calendarHeader.locator('.mat-calendar-period-button')
        const choosePreviousButton = calendarHeader.locator('.mat-calendar-previous-button')
        await chooseDateYearButton.click()
        await choosePreviousButton.click()
        await page.getByRole('button', { name: '2014', exact: true }).click()
        await page.getByRole('gridcell', { name: '05 2014' }).click()
        await page.getByRole('gridcell', { name: '2014/05/02' }).click()
      
        //8. Add the assertion of the input field is in the format "2014/05/02"
        const birthDateInputFieldFormat = newPetForm.locator('input[name="birthDate"]')
        await expect(birthDateInputFieldFormat).toHaveValue('2014/05/02')

        //9. Select the type of pet "dog" and click "Save Pet" button
        const petTypeDropDownMenuSelect = page.locator('#type')
        await petTypeDropDownMenuSelect.selectOption('dog')
        await page.getByRole('button', { name: 'Save Pet' }).click()

        //10. On the Owner Information page, add assertions for the newly created pet. Name is Tom, Birth Date is in the format "2014-05-02", Type is dog
        const tomPetSection = page.locator('app-pet-list', { hasText: 'Tom' })
        await expect(tomPetSection.locator('dt').filter({ hasText: 'Name' }).locator('+ dd')).toHaveText('Tom')
        await expect(tomPetSection.locator('dt').filter({ hasText: 'Birth Date' }).locator('+ dd')).toHaveText('2014-05-02')
        await expect(tomPetSection.locator('dt').filter({ hasText: 'Type' }).locator('+ dd')).toHaveText('dog')

        //11. Click the "Delete Pet" button for the new pet "Tom"
        await tomPetSection.getByRole('button', { name: 'Delete Pet' }).click()

        //12. Add an assertion that Tom does not exist in the list of pets anymore
        await expect(tomPetSection).not.toBeVisible()
    }) 
})
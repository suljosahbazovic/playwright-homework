import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
})

    test.describe('NavBar Petclinic OWNERS', () => {
        test.beforeEach(async ({ page }) => {
            //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            await page.getByRole('button', {name: 'Owners'}).click()
            await page.getByRole('link', {name: 'Search'}).click()
        })

    test('1. Validate selected pet types from the list', async ({ page }) => {
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading')).toHaveText('Owners')

        //3. Select the first owner, "George Franklin"
        await page.getByRole('link', { name: 'George Franklin' }).click()

        //4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
        await expect(page.getByRole('heading', { name: 'Owner Information'})).toBeVisible()
        await expect(page.locator('tr', { hasText: 'Name' }).locator('td b')).toHaveText('George Franklin')

        //5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Leo"
        await page.locator('tr', { hasText: 'Leo' }).getByRole('button', { name: 'Edit Pet' }).click()

        //6. Add assertion of "Pet" text displayed as a header on the page
        await expect(page.getByRole('heading')).toHaveText('Pet')

        //7. Add the assertion "George Franklin" name is displayed in the "Owner" field
        await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
        
        //8. Add the assertion that the value "cat" is displayed in the "Type" field
        const petTypeField = page.locator('#type1')
        await expect(petTypeField).toHaveValue('cat')

        //9. Using a loop, select the values from the drop-down one by one, and add the assertion that every selected value from the drop-down is displayed in the "Type" field
        const petTypeDropDownMenu = page.locator('#type')
        for(const petType of await petTypeDropDownMenu.locator('option').allInnerTexts()){
            await petTypeDropDownMenu.selectOption({label: petType})
            await expect(petTypeField).toHaveValue(petType)
        }
    }) 

    test('2. Validate the pet type update', async ({ page }) => {
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading')).toHaveText('Owners')

        //3. Select the owner "Eduardo Rodriquez"
        await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()

        //4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Rosy"
        const rosyPetSection = page.locator('app-pet-list', { hasText: 'Rosy' })
        await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click()

        //5. Add the assertion that the name "Rosy" is displayed in the input field "Name"
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')

        //6. Add the assertion the value "dog" is displayed in the "Type" field
        const petTypeReadOnlyField = page.locator('#type1')
        await expect(petTypeReadOnlyField).toHaveValue('dog')

        //7. From the drop-down menu, select the value "bird"
        const petTypeDropDownMenuSelect = page.locator('#type')
        await petTypeDropDownMenuSelect.selectOption('bird')

        //8. On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
        await expect(petTypeReadOnlyField).toHaveValue('bird')
        await expect(petTypeDropDownMenuSelect).toHaveValue('bird')

        //9. Select the "Update Pet" button
        await page.getByRole('button', { name: 'Update Pet' }).click()

        //10. On the "Owner Information" page, add the assertion that the pet "Rosy" has a new value of the Type "bird"
        await expect(rosyPetSection.locator('dd').last()).toHaveText('bird')
        
        //11. Select the "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
        await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click()
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')
        await expect(petTypeReadOnlyField).toHaveValue('bird')
        await expect(petTypeDropDownMenuSelect).toHaveValue('bird')
        await petTypeDropDownMenuSelect.selectOption('dog')
        await expect(petTypeReadOnlyField).toHaveValue('dog')
        await expect(petTypeDropDownMenuSelect).toHaveValue('dog')
        await page.getByRole('button', { name: 'Update Pet' }).click()
        await expect(rosyPetSection.locator('dd').last()).toHaveText('dog')
    })
})
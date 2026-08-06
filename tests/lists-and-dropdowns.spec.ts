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
        await page.locator('tr', { hasText: 'George Franklin' }).getByRole('link', { name: 'George Franklin' }).click()

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
        for(const petType of await petTypeDropDownMenu.locator('option').all()){
            const value = await petType.getAttribute('value')
            if(value != null) {
                await petTypeDropDownMenu.selectOption(value)
                await expect(petTypeField).toHaveValue(value)
            }
        }
    })

    test('2. Validate the pet type update', async ({ page }) => {
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading')).toHaveText('Owners')

        //3. Select the owner "Eduardo Rodriquez"
        await page.locator('tr', { hasText: 'Eduardo Rodriquez' }).getByRole('link', { name: 'Eduardo Rodriquez' }).click()

        //4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Rosy"
        const editPetButtonRosy = page.locator('tr .table').filter({ hasText: 'Rosy' }).getByRole('button', {name: 'Edit Pet'})
        await editPetButtonRosy.click()

        //5. Add the assertion that the name "Rosy" is displayed in the input field "Name"
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')

        //6. Add the assertion the value "dog" is displayed in the "Type" field
        const typeValueName = page.locator('#type1')
        await expect(typeValueName).toHaveValue('dog')

        //7. From the drop-down menu, select the value "bird"
        const typeDropDownMenuSelect = page.locator('#type')
        await typeDropDownMenuSelect.selectOption('bird')

        //8. On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
        await expect(typeValueName && typeDropDownMenuSelect).toHaveValue('bird')

        //9. Select the "Update Pet" button
        const updatePetButton = page.getByRole('button', {name: 'Update Pet'})
        await updatePetButton.click()

        //10. On the "Owner Information" page, add the assertion that the pet "Rosy" has a new value of the Type "bird"
        const petRosyType = page.locator('tr .table.table-striped', { hasText: 'Rosy' }).locator('dt:has-text("Type") + dd')
        await expect(petRosyType).toHaveText('bird')
        
        //11. Select the "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
        await editPetButtonRosy.click()
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')
        await expect(typeValueName && typeDropDownMenuSelect).toHaveValue('bird')
        await typeDropDownMenuSelect.selectOption('dog')
        await expect(typeValueName && typeDropDownMenuSelect).toHaveValue('dog')
        await updatePetButton.click()
        await expect(petRosyType).toHaveText('dog')
    })
})
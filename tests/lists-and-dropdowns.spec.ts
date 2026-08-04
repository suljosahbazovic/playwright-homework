import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
})

    test.describe('NavBar Petclinic', () => {
        test.beforeEach(async ({ page }) => {
            //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            await page.getByRole('button', {name: 'Owners'}).click()
            await page.getByRole('link', {name: 'Search'}).click()
        })

        test('1. Validate selected pet types from the list', async ({ page }) => {
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading')).toHaveText('Owners')

        //3. Select the first owner, "George Franklin"
        const name = page.locator('#ownersTable .ownerFullName').filter({ hasText: 'George Franklin' })
        await name.getByRole('link', {name: 'George Franklin'}).click()

        //4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
        await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
        await expect(page.locator('b').filter({ hasText: 'George Franklin' })).toBeVisible()

        //5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Leo"
        const petName = page.locator('tr').filter({ hasText: 'Leo' })
        await petName.getByRole('button', {name: 'Edit Pet'}).click()

        //6. Add assertion of "Pet" text displayed as a header on the page
        //await expect(page.getByRole('heading', { name: 'Pet' })).toBeVisible()
        await expect(page.getByRole('heading')).toHaveText('Pet')

        //7. Add the assertion "George Franklin" name is displayed in the "Owner" field
        await expect(page.locator('#owner_name.form-control')).toHaveValue('George Franklin')
        
        //8. Add the assertion that the value "cat" is displayed in the "Type" field 
        await expect(page.locator('#type1.form-control')).toHaveValue('cat')

        //9. Using a loop, select the values from the drop-down one by one, and add the assertion that every selected value from the drop-down is displayed in the "Type" field
        const petTypeDropDownMenu = page.locator('#type')
        const petTypes = await petTypeDropDownMenu.locator('option').all()
        for(const petType of petTypes){
                const value = await petType.getAttribute('value')
                if(value !== null){ {
                    await page.locator('#type.form-control').selectOption(value)
                    await expect(page.locator('#type1.form-control')).toHaveValue(value)
                }
            }
        }
    })

    test('2. Validate the pet type update', async ({ page }) => {
        //2. Add assertion of the "Owners" text displayed
        await expect(page.getByRole('heading')).toHaveText('Owners')

        //3. Select the owner "Eduardo Rodriquez"
        const name = page.locator('#ownersTable .ownerFullName').filter({ hasText: 'Eduardo Rodriquez' })
        await name.getByRole('link', {name: 'Eduardo Rodriquez'}).click()

        //4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Rosy"
        const petName = page.locator('tr .table').filter({ hasText: 'Rosy' })
        await petName.getByRole('button', {name: 'Edit Pet'}).click()

        //5. Add the assertion that the name "Rosy" is displayed in the input field "Name"
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')

        //6. Add the assertion the value "dog" is displayed in the "Type" field
        await expect(page.locator('#type1.form-control')).toHaveValue('dog')

        //7. From the drop-down menu, select the value "bird"
        const bird = page.locator('#type.form-control')
        await bird.selectOption('bird')

        //8. On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
        for (const bird of ['#type1.form-control', '#type.form-control']) {
            await expect(page.locator(bird)).toHaveValue('bird');
        }

        //9. Select the "Update Pet" button
        const updatePetButton = page.getByRole('button', {name: 'Update Pet'})
        await updatePetButton.click()

        //10. On the "Owner Information" page, add the assertion that the pet "Rosy" has a new value of the Type "bird"
        const petType = page.locator('tr .table.table-striped').filter({ hasText: 'Rosy' })
        await expect(petType.locator('dd').nth(2)).toHaveText('bird')
        
        //11. Select the "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
        await petName.getByRole('button', {name: 'Edit Pet'}).click()
        await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')
        for (const bird of ['#type1.form-control', '#type.form-control']) {
            await expect(page.locator(bird)).toHaveValue('bird');
        }
        await bird.selectOption('dog')
        for (const dog of ['#type1.form-control', '#type.form-control']) {
            await expect(page.locator(dog)).toHaveValue('dog');
        }
        await updatePetButton.click()
        await expect(petType.locator('dd').nth(2)).toHaveText('dog')
    })
})
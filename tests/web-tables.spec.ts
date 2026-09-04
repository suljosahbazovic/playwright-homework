import { test, expect } from '@playwright/test';

test.describe('Petclinic Full Test Suite', () => {

    test.beforeEach( async({page}) => {
        await page.goto('/')
    })

    test.describe('Petclinic Web Tables - Owners Search', () => {
        test.beforeEach(async ({ page }) => {
            //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            await page.getByRole('button', {name: 'Owners'}).click()
            await page.getByRole('link', {name: 'Search'}).click()
        })

        test('1. Validate the pet name city of the owner', async ({ page }) => {
            //2. In the list of Owners, locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
            await expect(page.getByRole('row', { name: 'Jeff Black' }).locator('td').nth(2)).toHaveText('Monona')
            await expect(page.getByRole('row', { name: 'Jeff Black' }).locator('td').nth(4)).toContainText('Lucky')
        })

        test('2. Validate owners count of the Madison city', async ({ page }) => {
            //2. In the list of Owners, locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
            await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4)
        })

        test('3. Validate search by Last Name', async ({ page }) => {
            //2. On the Owners page, in the "Last name" input field, type the last name "Black" and click the  "Find Owner" button
            //3. Add the assertion that the displayed owner in the table has a last name "Black"            
            //4. In the "Last name" input field, type the last name "Davis" and click the "Find Owner" button
            //5. Add the assertion that each owner displayed in the table has a last name "Davis"
            //6. In the "Last name" input field, type the partial match for the last name "Es" and click the "Find Owner" button
            //7. Add the assertion that each owner displayed in the table has a last name containing "Es"
            //8. In the "Last name" input field, type the last name "Playwright", and click the "Find Owner" button
            //9. Add the assertion of the message "No owners with LastName starting with "Playwright"" 
            const lastNames = ['Black', 'Davis', 'Es', 'Playwright']
            const displayedOwnerNames = page.locator('td.ownerFullName a')
            for (const lastName of lastNames) {
                await page.getByRole('textbox').fill(lastName)
                await page.getByRole('button', { name: 'Find Owner' }).click()

                if (lastName === 'Playwright') {
                    await expect(page.getByText(`No owners with LastName starting with "${lastName}"`)).toBeVisible()
            
                }else {
                    await expect(displayedOwnerNames.first()).toContainText(lastName)
                    for (const owner of await displayedOwnerNames.all()) {
                        await expect(owner).toContainText(lastName)
                    }
                }
            }
        })

        test('4. Validate phone number and pet name on the Owner Information page', async ({ page }) => {
            // 2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and save it to the variable. Click on this owner.
            const targetRowPhoneNumber = page.getByRole('row', {name: '6085552765'})
            const petsName = (await targetRowPhoneNumber.locator('td').nth(4).innerText()).trim()
            await targetRowPhoneNumber.getByRole('link').click()
            
            // 3. On the Owner Information page, add the assertion that "Telephone" value in the Owner Information card is "6085552765"
            await expect(page.getByRole('heading', { name: 'Owner Information'})).toBeVisible()
            await expect(page.locator('tr', { hasText: 'Telephone' }).locator('td')).toHaveText('6085552765')

            // 4. Add the assertion that Pet Name in the Owner Information card matches the name extracted from the page in step 2
            const georgePetsAndVisitsSection = page.locator('app-pet-list', { hasText: petsName }).locator('dt').filter({ hasText: 'Name' }).locator('+ dd')
            await expect(georgePetsAndVisitsSection).toHaveText(petsName)
        })

        test('5. Validate pets of the Madison city', async ({ page }) => {
            //2. On the Owners page, perform the assertion that Madison city has a list of pets: Leo, George, Mulligan, and Freddy
            const madisonPetsArray: string[] = []
            const madisonRows = page.getByRole('row', {name: 'Madison'})
            await page.waitForResponse('**/api/owners')
            for (const row of await madisonRows.all()) {
                const pets = await row.locator('td').nth(4).innerText()
                madisonPetsArray.push(pets.trim())
            }
            expect(madisonPetsArray).toEqual(['Leo', 'George', 'Mulligan', 'Freddy'])
        })
    })

    test.describe('Petclinic Web Tables - 6. Validate specialty update', () => {

        test.beforeEach(async ({ page }) => {
            //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
            await page.getByRole('button', {name: 'Veterinarians'}).click()
            await page.getByRole('link', {name: 'All'}).click()
        })

        test('6. Validate specialty update', async ({ page }) => {            
            //2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
            const rafaelOrtegaRow = page.getByRole('row', {name: 'Rafael Ortega'}).locator('td').nth(1)
            await expect(rafaelOrtegaRow).toContainText('surgery')

            //3. Select the SPECIALTIES menu item in the navigation bar
            await page.getByRole('link', {name: 'Specialties'}).click()

            //4. Add assertion of the "Specialties" header displayed above the table
            await expect(page.getByRole('heading')).toHaveText('Specialties')

            //5. Click on "Edit" button for the "surgery" specialty
            await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click()

            //6. Add assertion "Edit Specialty" page is displayed
            await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

            //7. Update the specialty from "surgery" to "dermatology" and click "Update button"
            await page.waitForResponse('**/specialties/*')
            await page.getByRole('textbox').fill('dermatology')
            await page.getByRole('button', { name: 'Update' }).click()

            //8. Add an assertion that "surgery" was changed to "dermatology" in the list of specialties
            await expect(page.locator('input[id="1"]')).toHaveValue('dermatology')

            //9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
            await page.getByRole('button', {name: 'Veterinarians'}).click()
            await page.getByRole('link', {name: 'All'}).click()

            //10. On the Veterinarians page, add an assertion that "Rafael Ortega" has specialty in dermatology"
            await expect(rafaelOrtegaRow).toContainText('dermatology')

            //11. Navigate to the SPECIALTIES page, revert the changes, renaming "dermatology" back to "surgery"
            await page.getByRole('link', {name: 'Specialties'}).click()
            await expect(page.getByRole('heading')).toHaveText('Specialties')
            await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click()
            await expect(page.getByRole('heading')).toHaveText('Edit Specialty')
            await page.waitForResponse('**/specialties/*')
            await page.getByRole('textbox').fill('surgery')
            await page.getByRole('button', { name: 'Update' }).click()
            await expect(page.locator('input[id="1"]')).toHaveValue('surgery')
        })
    })

    test.describe('Petclinic Web Tables - 7. Validate specialty lists', () => {

        test.beforeEach(async ({ page }) => {
            //1. Select the SPECIALTIES menu item in the navigation bar
            await page.getByRole('link', {name: 'Specialties'}).click()
        })

        test('7. Validate specialty lists', async ({ page }) => {
            //2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
            const addNewSpecialtySection = page.locator('app-specialty-add', { hasText: 'New Specialty' })
            await page.getByRole('button', { name: 'Add' }).click()            
            
            await addNewSpecialtySection.getByRole('textbox').fill('oncology')
            await addNewSpecialtySection.getByRole('button', { name: 'Save' }).click()
            await page.waitForResponse('**/api/specialties')

            //3. Extract all values of specialties and put them into the array.
            const allValuesOfSpecialties: string[] = []
            const specialtyRows = page.locator('#specialties tbody tr')

            for(const row of await specialtyRows.all()) {
                const specialtyValue = await row.locator('input').inputValue()
                allValuesOfSpecialties.push(specialtyValue)
            }

            //4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
            await page.getByRole('button', {name: 'Veterinarians'}).click()
            await page.getByRole('link', {name: 'All'}).click()

            //5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
            const sharonJenkinsRowVeterinarians = page.getByRole('row', { name: 'Sharon Jenkins' })
            await sharonJenkinsRowVeterinarians.getByRole('button', { name: 'Edit' }).click()

            //6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
            await page.locator('.dropdown-display').click()
            const specialtiesOptionsFromDropDown = await page.locator('.dropdown-content div').allTextContents()

            //7. Add the assertion that the array of specialties collected in step 3 is equal the the array from drop-down menu
            expect(specialtiesOptionsFromDropDown).toEqual(allValuesOfSpecialties)

            //8. Select the "oncology" specialty and click "Save vet" button
            await page.getByRole('checkbox', { name: 'oncology'}).check()
            await page.locator('.dropdown-display').click()
            await page.getByRole('button', { name: 'Save vet' }).click()

            //9. On the Veterinarians page, add assertion that "Sharon Jenkins" has a specialty "oncology"
            await expect(sharonJenkinsRowVeterinarians).toContainText('oncology')

            //10. Navigate to the SPECIALTIES page. Click "Delete" for "oncology" specialty
            await page.getByRole('link', {name: 'Specialties'}).click()
            const oncologySpecialtiesDeleteRow = page.getByRole('row', { name: 'oncology' })
            await oncologySpecialtiesDeleteRow.getByRole('button', { name: 'Delete' }).click()

            //11. Navigate to the VETERINARIANS page. Add an assertion that "Sharon Jenkins" has no specialty assigned
            await page.getByRole('button', {name: 'Veterinarians'}).click()
            await page.getByRole('link', {name: 'All'}).click()
            await expect(sharonJenkinsRowVeterinarians).not.toContainText('oncology')
        })
    })
})
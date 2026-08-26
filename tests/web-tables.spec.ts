import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe('Petclinic Web Tables', () => {
    test.beforeEach(async ({ page }) => {
        //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
        await page.getByRole('button', {name: 'Owners'}).click()
        await page.getByRole('link', {name: 'Search'}).click()
    })

    test('1. Validate the pet name city of the owner', async ({ page }) => {
        //2. In the list of Owners, locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        const targetRowByOwner = page.getByRole('row', {name: 'Jeff Black'})
        await expect(targetRowByOwner).toContainText('Monona')
        await expect(targetRowByOwner).toContainText('Lucky')
    })

    test('2. Validate owners count of the Madison city', async ({ page }) => {
        //2. In the list of Owners, locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        const targetRowByCity = page.getByRole('row', {name: 'Madison'}).filter({has: page.locator('td').nth(2).getByText('Madison')})
        await expect(targetRowByCity).toHaveCount(4)
    })

    test('3. Validate search by Last Name', async ({ page }) => {
        //2. On the Owners page, in the "Last name" input field, type the last name "Black" and click the  "Find Owner" button
        const lastNameInputField = page.getByRole('textbox')
        const findOwnerButton = page.getByRole('button',  { name: 'Find Owner' })
        await lastNameInputField.fill('Black')
        await findOwnerButton.click()

        //3. Add the assertion that the displayed owner in the table has a last name "Black"
        await expect(page.locator('td').nth(0)).toContainText('Black')
        
        //4. In the "Last name" input field, type the last name "Davis" and click the "Find Owner" button
        await lastNameInputField.fill('Davis')
        await findOwnerButton.click()

        //5. Add the assertion that each owner displayed in the table has a last name "Davis"
        const displayedOwnerNames = page.locator('td.ownerFullName a')
        await expect(displayedOwnerNames).not.toHaveCount(0)
        for (const owner of await displayedOwnerNames.all()) {
            await expect(owner).toContainText('Davis')
        }

        //6. In the "Last name" input field, type the partial match for the last name "Es" and click the "Find Owner" button
        await lastNameInputField.fill('Es')
        await findOwnerButton.click()

        //7. Add the assertion that each owner displayed in the table has a last name containing "Es"
        await expect(displayedOwnerNames.first()).toContainText('Es')
        for (const owner of await displayedOwnerNames.allInnerTexts()) {
            expect(owner).toContain('Es')
        }

        //8. In the "Last name" input field, type the last name "Playwright", and click the "Find Owner" button
        await lastNameInputField.fill('Playwright')
        await findOwnerButton.click()

        //9. Add the assertion of the message "No owners with LastName starting with "Playwright"" 
        await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible()
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

        const ownerRows = page.locator('tbody > tr')
        await expect(ownerRows.filter({ hasText: 'Madison' }).first()).toBeVisible()

        for(let row of await ownerRows.all()){
            const cityValue = await row.locator('td').nth(2).innerText()

            if (cityValue.trim() === 'Madison')
            {
                const pets = await row.locator('td').nth(4).innerText()
                madisonPetsArray.push(pets.trim())
            }
        }
        expect(madisonPetsArray).toEqual(['Leo', 'George', 'Mulligan', 'Freddy'])
    })
})

test('6. Validate specialty update', async ({ page }) => {
    //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', {name: 'Veterinarians'}).click()
    await page.getByRole('link', {name: 'All'}).click()
    
    //2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
    const targetRowBySpecialties = page.getByRole('row', {name: 'Rafael Ortega'})
    await expect(targetRowBySpecialties).toContainText('surgery')

    //3. Select the SPECIALTIES menu item in the navigation bar
    await page.getByRole('link', {name: 'Specialties'}).click()

    //4. Add assertion of the "Specialties" header displayed above the table
    await expect(page.getByRole('heading')).toHaveText('Specialties')

    //5. Click on "Edit" button for the "surgery" specialty
    const surgeryRow = page.getByRole('row', { name: 'surgery' })
    await surgeryRow.getByRole('button', { name: 'Edit' }).click()

    //6. Add assertion "Edit Specialty" page is displayed
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

    //7. Update the specialty from "surgery" to "dermatology" and click "Update button"
    await page.getByRole('textbox').fill('dermatology')
    await page.getByRole('button', { name: 'Update' }).click()

    // const specialtyInput = page.locator('#name')
    // await specialtyInput.fill('dermatology')
    // console.log('Input:', await specialtyInput.inputValue())
    // const responsePromise = page.waitForResponse(response =>
    //     response.url().includes('/specialties/4831') &&
    //     response.request().method() === 'PUT'
    // )
    // await page.getByRole('button', { name: 'Update' }).click()
    // const response = await responsePromise
    // console.log('Request body:', response.request().postData())
    
})
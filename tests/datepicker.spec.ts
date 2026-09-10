import { test, expect } from '@playwright/test';
import { time } from 'console';

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

        //3. On the Owner Information page, select the "Add New Pet" button
        await page.waitForResponse('**/api/owners/**')
        await page.getByRole('button', { name: 'Add New Pet' }).click()
        
        //4. In the Name field, type any new pet name, for example, "Tom"
        //5. Add the assertion of icon in the input field, that it changed from "X" to "V"
        await expect(page.locator('#name + span')).toHaveClass(/glyphicon-remove/)
        await page.getByRole('textbox', { name: 'Name' }).fill('Tom')
        await expect(page.locator('#name + span')).toHaveClass(/glyphicon-ok/)

        //6. Click on the calendar icon for the "Birth Date" field
        await page.getByRole('button', { name: 'Open calendar' }).click()

        //7. Using the calendar selector, select the date "May 2nd, 2014"
        await page.getByRole('button', {name: 'Choose month and year'}).click()
        await page.getByRole('button', {name: 'Previous 24 years'}).click()
        await page.getByRole('button', { name: '2014' }).click()
        await page.getByRole('gridcell', { name: '05 2014' }).click()
        await page.getByRole('gridcell', { name: '2014/05/02' }).click()
      
        //8. Add the assertion of the input field is in the format "2014/05/02"
        await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02')

        //9. Select the type of pet "dog" and click "Save Pet" button
        await page.locator('#type').selectOption('dog')
        await page.getByRole('button', { name: 'Save Pet' }).click()

        //10. On the Owner Information page, add assertions for the newly created pet. Name is Tom, Birth Date is in the format "2014-05-02", Type is dog
        const tomPetSection = page.locator('app-pet-list', { hasText: 'Tom' })
        await expect(tomPetSection.locator('dt', { hasText: 'Name' }).locator('+ dd')).toHaveText('Tom')
        await expect(tomPetSection.locator('dt', { hasText: 'Birth Date' }).locator('+ dd')).toHaveText('2014-05-02')
        await expect(tomPetSection.locator('dt', { hasText: 'Type' }).locator('+ dd')).toHaveText('dog')

        //11. Click the "Delete Pet" button for the new pet "Tom"
        await tomPetSection.getByRole('button', { name: 'Delete Pet' }).click()

        //12. Add an assertion that Tom does not exist in the list of pets anymore
        await expect(tomPetSection).not.toBeVisible()
    })

    test('2. Select the dates of visits and validate dates order.', async ({ page }) => {
        //2. In the list of the Owners, locate the owner by the name "Jean Coleman" and select this owner
        await page.getByRole('link', { name: 'Jean Coleman' }).click()

        //3. In the list of pets, locate the pet with a name "Samantha" and click "Add Visit" button
        const samanthaPetSection = page.locator('app-pet-list', { hasText: 'Samantha' })
        await samanthaPetSection.getByRole('button', { name: 'Add Visit' }).click()

        //4. Add the assertion that "New Visit" is displayed as the header of the page
        await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible()

        //5. Add the assertion that the pet name is "Samantha" and owner's name is "Jean Coleman"
        await expect(page.locator('app-visit-add', { hasText: 'Pet' }).getByText('Samantha')).toBeVisible()
        await expect(page.locator('app-visit-add', { hasText: 'Pet' }).getByText('Jean Coleman')).toBeVisible()

        //6. Click on the calendar icon and select the current date in date picker
        let currentDate = new Date()
        const currentDay = currentDate.getDate().toLocaleString('En-US', { minimumIntegerDigits: 2 })
        const currentMonth = currentDate.toLocaleString('En-US', { month: '2-digit' })
        const expectedYear = currentDate.getFullYear()
        const currentDateFormatted = `${expectedYear}/${currentMonth}/${currentDay}`
        await page.getByRole('button', { name: 'Open calendar' }).click()
        await page.getByRole('button', { name: currentDateFormatted }).click()

        //7. Add an assertion that the selected date is displayed and it is in the format "YYYY/MM/DD"
        await expect(page.locator('input[name="date"]')).toHaveValue(currentDateFormatted)

        //8. Type the description in the field, for example, "dermatologists visit" and click "Add Visit" button
        await page.locator('#description').fill('dermatologists visit')
        await page.getByRole('button', { name: 'Add Visit' }).click()

        //9. Add an assertion that the selected date of visit is displayed at the top of the list of visits for "Samantha" pet on the "Owner Information" page and is in the format "YYYY-MM-DD"
        await expect(samanthaPetSection.locator('app-visit-list tr').nth(1).locator('td').first()).toHaveText(currentDateFormatted.replace(/\//g, '-'))

        //10. Add one more visit for "Samantha" pet by clicking "Add Visit" button
        await samanthaPetSection.getByRole('button', { name: 'Add Visit' }).click()

        //11. Click on the calendar icon and select the date which is 45 days back from the current date
        await page.getByRole('button', { name: 'Open calendar' }).click()
        currentDate.setDate(currentDate.getDate() - 45)
        const expectedDay = currentDate.getDate().toLocaleString('En-US', { minimumIntegerDigits: 2 })
        const expectedMonth = currentDate.toLocaleString('En-US', { month: '2-digit' })
        const date45DaysBack = `${expectedYear}/${expectedMonth}/${expectedDay}`

        let calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent()!
        const expectedMonthAndYear = `${expectedMonth} ${expectedYear}`

        while (!calendarMonthAndYear!.includes(expectedMonthAndYear)) {
            await page.getByRole('button', { name: 'Previous month' }).click()
            calendarMonthAndYear =  await page.getByRole('button', { name: 'Choose month and year' }).textContent()!
        }
        await page.getByRole('gridcell', { name: date45DaysBack }).click()

        //12. Type the description in the field, for example, "massage therapy" and click "Add Visit" button
        await page.locator('#description').fill('massage therapy')
        await page.getByRole('button', { name: 'Add Visit' }).click()

        //13. Add the assertion that the date added at step 11 is in chronological order in relation to the previous dates for "Samantha" pet on the "Owner Information" page. The date of visit above this date in the table should be greater.
        const dateAboveText = await samanthaPetSection.locator('app-visit-list tr').nth(1).locator('td').first().textContent()
        const newVisitDateText = await samanthaPetSection.locator('app-visit-list tr').nth(2).locator('td').first().textContent()
        const dateAbove = new Date(dateAboveText!)
        const newVisitDate = new Date(newVisitDateText!)

        expect(dateAbove > newVisitDate).toBeTruthy()

        //14. Select the "Delete Visit" button for both newly created visits
        await samanthaPetSection.locator('app-visit-list tr').nth(1).getByRole('button', { name: 'Delete Visit' }).click()
        await samanthaPetSection.locator('app-visit-list tr').nth(1).getByRole('button', { name: 'Delete Visit' }).click()

        //15. Add the assertion that deleted visits are no longer displayed in the table on "Owner Information" page
        await expect(samanthaPetSection.locator('app-visit-list tr').nth(1).locator('td').first()).not.toHaveText(currentDateFormatted.replace(/\//g, '-'))
        await expect(samanthaPetSection.locator('app-visit-list tr').nth(1).locator('td').first()).not.toHaveText(date45DaysBack.replace(/\//g, '-'))        
    })
})
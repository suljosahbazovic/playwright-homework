import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('1. Update pet type', async ({ page }) => {
    // 1. Select the PET TYPES menu item in the navigation bar
    await page.getByTitle("pettypes").click()

    // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
    //await expect(page.locator('h2')).toHaveText('Pet Types')
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

    // 3. Click on "Edit" button for the "cat" pet type
    await page.getByRole('button', {name: 'Edit'}).first().click()

    //4. Add assertion of the "Edit Pet Type" text displayed
    await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

    // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button
    await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/2935')
    //await expect(page.getByRole('textbox')).toHaveValue('rabbit') // for first run it's 'cat', then change to rabbit, for next runs, it will be rabbit, so we need to change it back to cat
    await page.getByRole('textbox').fill('rabbit')
    await page.getByRole('button', { name: 'Update' }).click()

    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')

    // 6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
    await expect(page.locator('input[name="pettype_name"]').first()).toHaveValue('rabbit')

    // 7. Click on "Edit" button for the same "rabbit" pet type
    await page.getByRole('button', {name: 'Edit'}).first().click()

    // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
    await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/2935')
    await page.getByRole('textbox').fill('cat')
    await page.getByRole('button', {name: 'Update'}).click()

    await expect(page.locator('[id="0"]')).toHaveValue('cat')

    // 9. Add the assertion that the first pet type in the list of names has a value "cat" 
    await expect(page.locator('input[name="pettype_name"]').first()).toHaveValue('cat')
});

test('2. Cancel pet type update', async ({page}) => {
    // 1. Select the PET TYPES menu item in the navigation bar
    await page.getByTitle("pettypes").click()

    // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

    // 3. Click on "Edit" button for the "dog" pet type
    await page.getByRole('button', {name: 'Edit'}).nth(1).click()
    //await page.getByRole('row', { name: /dog/i }).getByRole('button', { name: 'Edit' }).click()

    // 4. Type the new pet type name "moose"
    await page.getByRole('textbox').fill('moose')

    // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
    await expect(page.locator('#name')).toHaveValue('moose')

    // 6. Click on "Cancel" button
    await page.getByRole('button', { name: 'Cancel' }).click()

    // 7. Add the assertion the value "dog" is still displayed in the list of pet types
    await expect(page.getByRole('heading', { name: 'Pet Types'})).toBeVisible();
    await expect(page.locator('input[name="pettype_name"][id="1"]').first()).toHaveValue('dog');

});

test('3. Validation of Pet Type name is required', async ({page}) => {
    test.slow()
    // 1. Select the PET TYPES menu item in the navigation bar
    await page.getByTitle("pettypes").click()

    // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

    // 3. Click on "Edit" button for the "lizard" pet type
    await page.getByRole('button', {name: 'Edit'}).nth(2).click()

    // 4. On the Edit Pet Type page, clear the input field
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').clear()

    // 5. Add the assertion for the "Name is required" message below the input field
    await expect(page.getByText('Name is required')).toBeVisible()

    // 6. Click on "Update" button
    await page.getByRole('button', { name: 'Update' }).click()
    
    // 7. Add assertion that "Edit Pet Type" page is still displayed
    await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

    // 8. Click on the "Cancel" button
    await page.getByRole('button', { name: 'Cancel' }).click()

    // 9. Add assertion that "Pet Types" page is displayed
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
});
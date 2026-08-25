import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe('NavBar PET TYPES', () => {
  test.beforeEach(async ({ page }) => {
    //1. Select the PET TYPES menu item in the navigation bar
    await page.getByRole('link', {name: 'Pet Types'}).click()
  })

  test('1. Add and delete pet type', async ({ page }) => {
    //2. On the "Pet Types" page, add an assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole('heading')).toHaveText('Pet Types')

    //3. Click on the "Add" button
    await page.getByRole('button', {name: 'Add'}).click()

    //4. Add assertions of "New Pet Type" section title, "Name" header for the input field and the input field is visible
    const newPetTypeNameInputField = page.locator('app-pettype-add', { hasText: 'New Pet Type'})
    await expect(newPetTypeNameInputField.getByRole('heading')).toHaveText('New Pet Type')
    await expect(newPetTypeNameInputField.getByText('Name')).toHaveText('Name')
    await expect(newPetTypeNameInputField.locator('#name')).toBeVisible()    

    //5. Add a new pet type with the name "pig" and click "Save" button
    await newPetTypeNameInputField.getByRole('textbox').fill('pig')
    await newPetTypeNameInputField.getByRole('button', { name: 'Save'}).click()

    //6. Add an assertion that the last item in the list of pet types has the value of "pig"
    const petTypesNameItem = page.locator('#pettypes tbody tr').last()
    await expect(petTypesNameItem.locator('input[name="pettype_name"]')).toHaveValue('pig')

    //7. Click on the "Delete" button for the "pig" pet type
    //8. Add an assertion to validate the message of the dialog box "Delete the pet type?"
    //9. Click on the OK button on the dialog box
    page.once('dialog', async dialog => {        
        expect(dialog.message()).toEqual('Delete the pet type?')        
        await dialog.accept()
    })
    await petTypesNameItem.getByRole('button', {name: 'Delete'}).last().click()

    //10. Add an assertion that the last item in the list of pet types is not the "pig"
    await expect(petTypesNameItem.locator('input[name="pettype_name"]')).not.toHaveValue('pig')
  })
})
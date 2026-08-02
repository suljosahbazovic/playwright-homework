import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('1. Validate selected specialties', async ({ page }) => {

  //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
  await page.getByRole('button', {name: 'Veterinarians'}).click()
  await expect(page.locator('li.dropdown.open .dropdown-menu')).toBeVisible()
  await page.getByRole('link', {name: 'All'}).click()

  //2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
  await expect(page.locator('h2')).toHaveText('Veterinarians');

  //3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
  const name = page.locator('tr').filter({hasText: 'Helen Leary'})
  await name.getByRole('button', {name: 'Edit Vet'}).click()

  //4. Add assertion of the "Specialties" field. The value "radiology" is displayed
  await expect(page.locator('.selected-specialties')).toHaveText('radiology')

  //5. Click on the "Specialties" drop-down menu
  const dropDownMenuSpecialties = page.locator('.dropdown-display')
  await dropDownMenuSpecialties.click()

  //6. Add assertion that "radiology" specialty is checked
  const radiologyCheckbox = page.getByRole('checkbox', {name: 'radiology'})
  await expect(radiologyCheckbox).toBeChecked()

  //7. Add assertion that "surgery" and "dentistry" specialties are unchecked
  await expect(page.getByRole('checkbox', {name: 'surgery'})).not.toBeChecked()
  await expect(page.getByRole('checkbox', {name: 'dentistry'})).not.toBeChecked()

  //8. Check the "surgery" item specialty and uncheck the "radiology" item speciality 
  await page.getByRole('checkbox', { name: 'surgery'}).check({force: true})
  await page.getByRole('checkbox', { name: 'radiology'}).uncheck({force: true})

  //9. Add assertion of the "Specialties" field displayed value "surgery"
  await expect(page.locator('.selected-specialties')).toHaveText('surgery')

  //10. Check the "dentistry" item specialty
  await page.getByRole('checkbox', { name: 'dentistry'}).check({force: true})

  //11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
  await expect(page.locator('.selected-specialties')).toHaveText('surgery, dentistry')

  await console.log('All validate selected specialties successfully!')
});

test('2. Select all specialties', async ({ page }) => {
  //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
  await page.getByRole('button', {name: 'Veterinarians'}).click()
  await expect(page.locator('li.dropdown.open .dropdown-menu')).toBeVisible()
  await page.getByRole('link', {name: 'All'}).click()

  //2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
  const name = page.locator('tr').filter({ hasText: 'Rafael Ortega' })
  await name.getByRole('button', {name: 'Edit Vet'}).click()

  //3. Add assertion that "Specialties" field is displayed value "surgery"
  await expect(page.locator('.selected-specialties')).toHaveText('surgery')

  //4. Click on the "Specialties" drop-down menu
  const dropDownMenuSpecialties = page.locator('.dropdown-display')
  await dropDownMenuSpecialties.click()

  //5. Check all specialties from the list
  const checkbox = page.getByRole('checkbox')
  for (const box of await checkbox.all()) {
    await box.check({ force: true })
  }

  //6. Add assertion that all specialties are checked
  for (const checkboxes of await checkbox.all()) {
    //await expect(checkboxes).toBeChecked()
    expect(await checkboxes.isChecked()).toBeTruthy()
  }
  
  //7. Add assertion that all checked specialities are displayed in the "Specialties" field
  //await expect(page.locator('.selected-specialties')).toHaveText('surgery, radiology, dentistry, new specialty')
  const specialties = ['radiology', 'surgery', 'dentistry', 'new specialty']
  const selectedSpecialties = page.locator('.selected-specialties')
  for (const specialty of specialties) {
    await expect(selectedSpecialties).toContainText(specialty)
  } 

  await console.log('Select all specialties successfully!')
});


test('3. Unselect all specialties', async ({ page }) => {
  //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
  await page.getByRole('button', {name: 'Veterinarians'}).click()
  await expect(page.locator('li.dropdown.open .dropdown-menu')).toBeVisible()
  await page.getByRole('link', {name: 'All'}).click()

  //2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
  const name = page.locator('tr').filter({ hasText: 'Linda Douglas' })
  await name.getByRole('button', {name: 'Edit Vet'}).click()
  
  //3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
  const specialties = ['surgery', 'dentistry']
  const selectedSpecialties = page.locator('.selected-specialties')
  for (const specialty of specialties) {
    await expect(selectedSpecialties).toContainText(specialty)
  }

  //4. Click on the "Specialties" drop-down menu
  const dropDownMenuSpecialties = page.locator('.dropdown-display')
  await dropDownMenuSpecialties.click()

  //5. Uncheck all specialties from the list
  const checkbox = page.getByRole('checkbox')
  for (const box of await checkbox.all()) {
    await box.uncheck({ force: true })
  }

  //6. Add assertion that all specialties are unchecked
  for (const checkboxes of await checkbox.all()) {
    //await expect(checkboxes).not.toBeChecked()
    expect(await checkboxes.isChecked()).toBeFalsy()
  }

  //7. Add assertion that "Specialties" field is empty
  await expect(page.locator('.selected-specialties')).toBeEmpty()

  await console.log('Unselect all specialties successfully!')
});
import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe('NavBar Petclinic VETERINARIANS', () => {
  test.beforeEach(async ({ page }) => {
    //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', {name: 'Veterinarians'}).click()
    await page.getByRole('link', {name: 'All'}).click()
  })
  test('1. Validate selected specialties', async ({ page }) => {
    //2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')

    //3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
    await page.locator('tr', {hasText: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click()

    //4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    await expect(page.locator('.selected-specialties')).toHaveText('radiology')

    //5. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click()

    //6. Add assertion that "radiology" specialty is checked
    await expect(page.getByRole('checkbox', {name: 'radiology'})).toBeChecked()

    //7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    await expect(page.getByRole('checkbox', {name: 'surgery'})).not.toBeChecked()
    await expect(page.getByRole('checkbox', {name: 'dentistry'})).not.toBeChecked()

    //8. Check the "surgery" item specialty and uncheck the "radiology" item speciality 
    await page.getByRole('checkbox', { name: 'surgery'}).check()
    await page.getByRole('checkbox', { name: 'radiology'}).uncheck()

    //9. Add assertion of the "Specialties" field displayed value "surgery"
    await expect(page.locator('.selected-specialties')).toHaveText('surgery')

    //10. Check the "dentistry" item specialty
    await page.getByRole('checkbox', { name: 'dentistry'}).check()

    //11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(page.locator('.selected-specialties')).toHaveText('surgery, dentistry')
  })

  test('2. Select all specialties', async ({ page }) => {
    //2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.locator('tr', { hasText: 'Rafael Ortega' }).getByRole('button', {name: 'Edit Vet'}).click()

    //3. Add assertion that "Specialties" field is displayed value "surgery"
    await expect(page.locator('.selected-specialties')).toHaveText('surgery')

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click()

    //5. Check all specialties from the list
    //6. Add assertion that all specialties are checked
    const allCheckboxes = page.getByRole('checkbox')
    for (const box of await allCheckboxes.all()) {
      await box.check()
      await expect(box).toBeChecked()
    }
    
    //7. Add assertion that all checked specialities are displayed in the "Specialties" field
    const specialties = ['radiology', 'surgery', 'dentistry', 'new specialty']
    const selectedSpecialties = page.locator('.selected-specialties')
    for (const specialty of specialties) {
      await expect(selectedSpecialties).toContainText(specialty)
    }
  })

  test('3. Unselect all specialties', async ({ page }) => {
    //2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
    await page.locator('tr', { hasText: 'Linda Douglas' }).getByRole('button', {name: 'Edit Vet'}).click()
    
    //3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    await expect(page.locator('.selected-specialties')).toHaveText('dentistry, surgery')

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click()

    //5. Uncheck all specialties from the list
    //6. Add assertion that all specialties are unchecked
    const allCheckboxes = page.getByRole('checkbox')
    for (const box of await allCheckboxes.all()) {
      await box.uncheck()
      await expect(box).not.toBeChecked()
    }

    //7. Add assertion that "Specialties" field is empty
    await expect(page.locator('.selected-specialties')).toBeEmpty()
  })
})
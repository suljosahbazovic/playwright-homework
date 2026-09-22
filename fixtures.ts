import { test as base, expect } from '@playwright/test'

export type Fixtures = {
    ownerWithPetAndVisit: {
        ownerId:    number
        petId:      number
        visitId:    number
    }
}

export const test = base.extend<Fixtures>({
    ownerWithPetAndVisit: async ({ request }, use) => {
        const ownerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners',
            {
                data: {
                    firstName: 'Suljo',
                    lastName: 'Sahbazovic',
                    address: 'Test 279E',
                    city: 'Sarajevo',
                    telephone: '061728392'
                } 
            }
        )
        expect(ownerResponse.status()).toEqual(201)
        const ownerResponseBody = await ownerResponse.json()
        const ownerId = ownerResponseBody.id

        const petTypesResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes')
        expect (petTypesResponse.status()).toEqual(200)

        const petTypes = await petTypesResponse.json()
        const dogType = petTypes.find(
            (petType: { name: string }) => petType.name === 'dog'
        )
        if (!dogType) {
            throw new Error('Dog pet type was not found')
        }

        const petResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`,
            {
                data: {
                    name: 'Micky Dog',
                    birthDate: '2024-10-02',
                    type: {
                        name: 'dog',
                        id: dogType.id
                    }
                }
            }
        )
        expect(petResponse.status()).toEqual(201)
        const petJSON = await petResponse.json()
        const petId = petJSON.id

        const visitResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`,
            {
                data: {
                    date: '2026-07-20',
                    description: 'massage therapy'
                }
            }
        )
        expect(visitResponse.status()).toEqual(201)
        const visitJSON = await visitResponse.json()
        const visitId = visitJSON.id
        
        await use({ ownerId, petId, visitId })

        const deleteOwnerResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}`)
        expect(deleteOwnerResponse.status()).toEqual(204)
    }
})
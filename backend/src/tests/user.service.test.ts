import { UserRepository } from "../repositories/user.reposiotory.interface"
import MongooseUserRepository from "../repositories/user.repository"
import UserService from "../services/user.service";


describe("Тестирование репозитория",() => {

    var service: UserService;

    beforeAll(async () => {
        service = new UserService();
        
    })

    afterAll(async () => {
    })

    test("Создание пользователя",async () => {
        let result = await service.createUser({
            name: "Test",
            email: "lolka@lal.ru",
            password: "123qwerty"
        })
        expect(result).not.toBe(null)
        if(result) {
            expect(result).toHaveProperty("_id")
            if(result._id)
            {
                let result2 = await service.getUser(result._id)
                expect(result2).not.toBe(null)
                expect(result2).toHaveProperty("_id")
                expect(result2?._id).toBe(result._id)
            }
        }
    })

    test("Обновляет пользователя пользователя",async () => {
        let result = await service.createUser({
            name: "Test",
            email: "lolka2@lal.ru",
            password: "123qwerty"
        })
        expect(result).not.toBe(null)
        if(result) {
            expect(result).toHaveProperty("_id")
            expect(result.name).toBe("Test")
            if(result._id)
            {
                await service.updateUser(result._id,{name: "LALA"})
                let result2 = await service.getUser(result._id)
                expect(result2).not.toBe(null)
                expect(result2).toHaveProperty("_id")
                expect(result2?._id).toBe(result._id)
                expect(result2?.name).toBe("LALA")
            }
        }
    })
})
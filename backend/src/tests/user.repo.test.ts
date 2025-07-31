import { UserRepository } from "../repositories/user.reposiotory.interface"
import MongooseUserRepository from "../repositories/user.repository"


describe("Тестирование репозитория",() => {

    var repo: UserRepository;

    beforeAll(async () => {
        repo = new MongooseUserRepository();
        
    })

    afterAll(async () => {
        repo.end();
    })

    test("Создание пользователя",async () => {
        let result = await repo.createUser({
            name: "Test",
            email: "lolka@lal.ru",
            password: "123qwerty"
        })
        expect(result).not.toBe(null)
        if(result) {
            expect(result).toHaveProperty("_id")
            if(result._id)
            {
                let result2 = await repo.getUser(result._id)
                expect(result2).not.toBe(null)
                expect(result2).toHaveProperty("_id")
                expect(result2?._id).toBe(result._id)
            }
        }
    })

    test("Обновляет пользователя пользователя",async () => {
        let result = await repo.createUser({
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
                await repo.updateUser(result._id,{name: "LALA"})
                let result2 = await repo.getUser(result._id)
                expect(result2).not.toBe(null)
                expect(result2).toHaveProperty("_id")
                expect(result2?._id).toBe(result._id)
                expect(result2?.name).toBe("LALA")
            }
        }
    })
})
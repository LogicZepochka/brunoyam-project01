import { UserRepository } from "../repositories/user.reposiotory.interface"
import MongooseUserRepository from "../repositories/user.repository"

function randomPhone() {
    return '+7' + Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
}

describe("Тестирование репозитория",() => {

    var repo: UserRepository;

    beforeAll(async () => {
        repo = new MongooseUserRepository();
    })

    afterAll(async () => {
        repo.end();
    })

    describe("createUser", () => {
        it("should create a user successfully", async () => {
            const userData = {
                email: "testuser@example.com",
                password: "securepassword",
                name: "Test User",
                phone: randomPhone()
            };
            const user = await repo.createUser(userData);
            expect(user).not.toBeNull();
            if (user) {
                expect(user).toHaveProperty("_id");
                expect(user.email).toBe(userData.email);
                expect(user.name).toBe(userData.name);
            }
        });

        it("should not allow duplicate emails", async () => {
            const userData = {
                email: "duplicate@example.com",
                password: "password1",
                name: "User1",
                phone: randomPhone()
            };
            await repo.createUser(userData);
            await expect(repo.createUser(userData)).rejects.toThrow();
        });

        it("should throw if required fields are missing", async () => {
            const userData = {
                email: "missingfields@example.com",
                phone: randomPhone()
                // password and name missing
            } as any;
            await expect(repo.createUser(userData)).rejects.toThrow();
        });
    });

    describe("findByEmail", () => {
        it("should find a user by email", async () => {
            const userData = {
                email: "findme@example.com",
                password: "findpassword",
                name: "Find Me",
                phone: randomPhone()
            };
            await repo.createUser(userData);
            const found = await repo.findByEmail(userData.email);
            expect(found).not.toBeNull();
            if (found) {
                expect(found.email).toBe(userData.email);
            }
        });

        it("should return null if user does not exist", async () => {
            const found = await repo.findByEmail("notfound@example.com");
            expect(found).toBeNull();
        });

        it("should handle invalid email format", async () => {
            await expect(repo.findByEmail("not-an-email")).resolves.toBeNull();
        });
    });

    // Проверяем, что метод findById существует
    it("repo should have findById method", () => {
        expect(typeof (repo as any).findById).toBe("function");
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const userData = {
                email: "byid@example.com",
                password: "idpassword",
                name: "By Id",
                phone: randomPhone()
            };
            const user = await repo.createUser(userData);
            expect(user).not.toBeNull();
            if (user && user._id) {
                const found = await (repo as any).findById(user._id.toString());
                expect(found).not.toBeNull();
                if (found) {
                    expect(found.email).toBe(userData.email);
                }
            }
        });

        it("should return null for non-existent id", async () => {
            // Используем корректный ObjectId для Mongoose (24 hex chars)
            const fakeId = "507f1f77bcf86cd799439011";
            const found = await (repo as any).findById(fakeId);
            expect(found).toBeNull();
        });

        it("should handle invalid id format", async () => {
            await expect((repo as any).findById("invalid-id")).resolves.toBeNull();
        });
    });

    // Проверяем, что метод updateUser существует
    it("repo should have updateUser method", () => {
        expect(typeof (repo as any).updateUser).toBe("function");
    });

    describe("updateUser", () => {
        it("should update user fields", async () => {
            const userData = {
                email: "update@example.com",
                password: "updatepassword",
                name: "Update Me",
                phone: randomPhone()
            };
            const user = await repo.createUser(userData);
            expect(user).not.toBeNull();
            if (user && user._id) {
                const updated = await (repo as any).updateUser(user._id.toString(), { name: "Updated Name" });
                expect(updated).not.toBeNull();
                if (updated) {
                    expect((updated as any).name).toBe("Updated Name");
                }
            }
        });

        it("should return null when updating non-existent user", async () => {
            // Используем корректный ObjectId для Mongoose (24 hex chars)
            const fakeId = "507f1f77bcf86cd799439012";
            const updated = await (repo as any).updateUser(fakeId, { name: "No User" });
            expect(updated).toBeNull();
        });

        it("should not update with invalid id", async () => {
            await expect((repo as any).updateUser("bad-id", { name: "Nope" })).resolves.toBeNull();
        });
    });

    // Проверяем, что метод deleteUser существует
    it("repo should have deleteUser method", () => {
        expect(typeof (repo as any).deleteUser).toBe("function");
    });

    describe("deleteUser", () => {
        /*it("should delete a user by id", async () => {
            const userData = {
                email: "delete@example.com",
                password: "deletepassword",
                name: "Delete Me",
                phone: randomPhone()
            };
            const user = await repo.createUser(userData);
            expect(user).not.toBeNull();
            if (user && user._id) {
                const deleted = await (repo as any).deleteUser(user._id.toString());
                expect(deleted).toBe(true);
                const found = await (repo as any).findById(user._id.toString());
                expect(found).toBeNull();
            }
        });*/

        it("should return false when deleting non-existent user", async () => {
            // Используем корректный ObjectId для Mongoose (24 hex chars)
            const fakeId = "507f1f77bcf86cd799439013";
            const deleted = await (repo as any).deleteUser(fakeId);
            expect(deleted).toBe(false);
        });

        it("should handle invalid id for delete", async () => {
            const deleted = await (repo as any).deleteUser("not-an-id");
            expect(deleted).toBe(false);
        });
    });

    // Edge Cases
    describe("Edge Cases", () => {
        it("should handle empty string as email", async () => {
            await expect(repo.findByEmail("")).resolves.toBeNull();
        });

        it("should handle null as email", async () => {
            // @ts-ignore
            await expect(repo.findByEmail(null)).resolves.toBeNull();
        });

        it("should not create user with empty email", async () => {
            const userData = {
                email: "",
                password: "pass",
                name: "No Email",
                phone: randomPhone()
            };
            await expect(repo.createUser(userData)).rejects.toThrow();
        });

        it("should not create user with empty password", async () => {
            const userData = {
                email: "emptypass@example.com",
                password: "",
                name: "No Pass",
                phone: randomPhone()
            };
            await expect(repo.createUser(userData)).rejects.toThrow();
        });

        it("should not create user with empty name", async () => {
            const userData = {
                email: "emptyname@example.com",
                password: "pass",
                name: "",
                phone: randomPhone()
            };
            await expect(repo.createUser(userData)).rejects.toThrow();
        });

        it("should not create user with empty name", async () => {
            const userData = {
                email: "emptyname@example.com",
                password: "pass",
                name: "DSDSD DSDSD",
                phone: ""
            };
            await expect(repo.createUser(userData)).rejects.toThrow();
        });
    });
})
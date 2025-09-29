import RegistrationService from "../services/registration.service";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import { User } from "../repositories/types";
import * as argon2 from "argon2";

// Mock argon2 module once to avoid redefining its properties
jest.mock("argon2", () => ({
	__esModule: true,
	hash: jest.fn().mockResolvedValue("hashed-pass")
}));


describe("RegistrationService", () => {
	let repo: jest.Mocked<UserRepository>;
	let service: RegistrationService;

	beforeEach(() => {
		repo = {
			createUser: jest.fn(),
			updateUser: jest.fn(),
			deleteUser: jest.fn(),
			getUser: jest.fn(),
			findByEmail: jest.fn(),
			findByPhone: jest.fn(),
			end: jest.fn()
		};
		service = new RegistrationService(repo);
		(argon2.hash as jest.MockedFunction<typeof argon2.hash>).mockResolvedValue("hashed-pass" as any);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("RegisterUser", () => {
		const payload = { name: "John", phone: "+71234567890", email: "john@example.com", password: "plain" } as any;

		it("returns true when user is created", async () => {
			repo.createUser.mockResolvedValueOnce({ _id: "u1", email: payload.email } as User);
			await expect(service.RegisterUser(payload)).resolves.toBe(true);
			expect(argon2.hash).toHaveBeenCalledWith("plain");
			expect(repo.createUser).toHaveBeenCalledWith({
				name: payload.name,
				phone: payload.phone,
				email: payload.email,
				password: "hashed-pass"
			});
		});

		it("returns false when repo returns null", async () => {
			repo.createUser.mockResolvedValueOnce(null);
			await expect(service.RegisterUser(payload)).resolves.toBe(false);
		});

		it("returns false when repo throws", async () => {
			repo.createUser.mockRejectedValueOnce(new Error("db error"));
			await expect(service.RegisterUser(payload)).resolves.toBe(false);
		});

		it("returns false when hashing throws", async () => {
			(argon2.hash as jest.MockedFunction<typeof argon2.hash>).mockRejectedValueOnce(new Error("hash fail") as any);
			await expect(service.RegisterUser(payload)).resolves.toBe(false);
			expect(repo.createUser).not.toHaveBeenCalled();
		});
	});

	describe("IsEmailFree", () => {
		it("returns true when findByEmail returns null", async () => {
			repo.findByEmail.mockResolvedValueOnce(null);
			await expect(service.IsEmailFree("free@example.com")).resolves.toBe(true);
		});

		it("returns false when user exists", async () => {
			repo.findByEmail.mockResolvedValueOnce({ _id: "1", email: "x" } as User);
			await expect(service.IsEmailFree("busy@example.com")).resolves.toBe(false);
		});

		it("throws with detailed message when repo throws", async () => {
			repo.findByEmail.mockRejectedValueOnce(new Error("email lookup fail"));
			await expect(service.IsEmailFree("err@example.com")).rejects.toThrow("Failed to search user email:");
		});

		it("handles empty email string (passes to repo)", async () => {
			repo.findByEmail.mockResolvedValueOnce(null);
			await expect(service.IsEmailFree("")).resolves.toBe(true);
			expect(repo.findByEmail).toHaveBeenCalledWith("");
		});
	});

	describe("isPhoneFree", () => {
		it("returns true when findByPhone returns null", async () => {
			repo.findByPhone.mockResolvedValueOnce(null);
			await expect(service.isPhoneFree("+70000000000")).resolves.toBe(true);
		});

		it("returns false when user with phone exists", async () => {
			repo.findByPhone.mockResolvedValueOnce({ _id: "1", phone: "+7000" } as User);
			await expect(service.isPhoneFree("+7000")).resolves.toBe(false);
		});

		it("throws with detailed message when repo throws", async () => {
			repo.findByPhone.mockRejectedValueOnce(new Error("phone lookup fail"));
			await expect(service.isPhoneFree("+7999")).rejects.toThrow("Failed to search user phone:");
		});

		it("handles empty phone string (passes to repo)", async () => {
			repo.findByPhone.mockResolvedValueOnce(null);
			await expect(service.isPhoneFree("")).resolves.toBe(true);
			expect(repo.findByPhone).toHaveBeenCalledWith("");
		});
	});
});

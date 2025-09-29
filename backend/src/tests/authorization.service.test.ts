import AuthorizationService from "../services/authorization.service";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import { User } from "../repositories/types";
import ApiException from "../etc/ApiError";
import { ApiError } from "../builders/api/errors.enum";
import * as argon2 from "argon2";

// Mock argon2 once to control verify behavior
jest.mock("argon2", () => ({
	__esModule: true,
	verify: jest.fn()
}));


describe("AuthorizationService", () => {
	let repo: jest.Mocked<UserRepository>;
	let service: AuthorizationService;

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
		service = new AuthorizationService(repo);
		(argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockReset();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("AuthorizeUser", () => {
		const email = "user@example.com";
		const plain = "password";

		it("returns user when email exists and password matches", async () => {
			const stored: User = { _id: "u1", email, password: "hashed" } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			(argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValueOnce(true as any);

			const result = await service.AuthorizeUser(email, plain);
			expect(repo.findByEmail).toHaveBeenCalledWith(email);
			expect(argon2.verify).toHaveBeenCalledWith("hashed", plain);
			expect(result).toBe(stored);
		});

		it("throws ApiException Forbidden when user not found", async () => {
			repo.findByEmail.mockResolvedValueOnce(null);
			await expect(service.AuthorizeUser(email, plain)).rejects.toBeInstanceOf(ApiException);
			await expect(service.AuthorizeUser(email, plain)).rejects.toMatchObject({ name: ApiError.Forbidden });
		});

		it("throws Error when user password is null", async () => {
			const stored: User = { _id: "u1", email, password: undefined } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			await expect(service.AuthorizeUser(email, plain)).rejects.toThrow("User password is null");
		});

		it("throws ApiException Forbidden when password mismatch", async () => {
			const stored: User = { _id: "u1", email, password: "hashed" } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			(argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValueOnce(false as any);
			await expect(service.AuthorizeUser(email, plain)).rejects.toBeInstanceOf(ApiException);
			await expect(service.AuthorizeUser(email, plain)).rejects.toMatchObject({ name: ApiError.Forbidden });
		});

		it("propagates argon2.verify rejection", async () => {
			const stored: User = { _id: "u1", email, password: "hashed" } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			(argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockRejectedValueOnce(new Error("verify failed"));
			await expect(service.AuthorizeUser(email, plain)).rejects.toThrow("verify failed");
		});
	});

	// Edge cases
	describe("Edge cases", () => {
		it("treats empty email as not found", async () => {
			repo.findByEmail.mockResolvedValueOnce(null);
			await expect(service.AuthorizeUser("", "pwd")).rejects.toBeInstanceOf(ApiException);
			await expect(service.AuthorizeUser("", "pwd")).rejects.toMatchObject({ name: ApiError.Forbidden });
			expect(repo.findByEmail).toHaveBeenCalledWith("");
		});

		it("throws when stored password is empty string", async () => {
			const stored: User = { _id: "u1", email: "a@b.c", password: "" as any } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			await expect(service.AuthorizeUser("a@b.c", "pwd")).rejects.toThrow("User password is null");
		});

		it("forbids when provided password is empty but stored exists", async () => {
			const stored: User = { _id: "u1", email: "a@b.c", password: "hashed" } as any;
			repo.findByEmail.mockResolvedValueOnce(stored);
			(argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValueOnce(false as any);
			await expect(service.AuthorizeUser("a@b.c", "")).rejects.toBeInstanceOf(ApiException);
			await expect(service.AuthorizeUser("a@b.c", "")).rejects.toMatchObject({ name: ApiError.Forbidden });
		});

		it("propagates repository errors from findByEmail", async () => {
			repo.findByEmail.mockRejectedValueOnce(new Error("lookup failed"));
			await expect(service.AuthorizeUser("someone@example.com", "pwd")).rejects.toThrow("lookup failed");
		});
	});
});

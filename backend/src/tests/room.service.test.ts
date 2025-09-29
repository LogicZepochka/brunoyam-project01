import RoomService from "../services/room.service";
import { RoomRepository } from "../repositories/room.repository.interface";
import { roomStatus, Room, User, PaginationResult } from "../repositories/types";


describe("RoomService", () => {
	let repo: jest.Mocked<RoomRepository>;
	let service: RoomService;

	beforeEach(() => {
		repo = {
			createRoom: jest.fn(),
			updateRoom: jest.fn(),
			deleteRoom: jest.fn(),
			getRoom: jest.fn(),
			getRoomOwner: jest.fn(),
			getRooms: jest.fn(),
			incrementRoomView: jest.fn(),
			incrementRoomContactView: jest.fn(),
			end: jest.fn()
		};
		service = new RoomService(repo);
	});

	describe("getRooms", () => {
		it("returns active rooms with pagination", async () => {
			const paginated: PaginationResult<any> = {
				data: [{ _id: "1" }],
				total: 1,
				page: 1,
				limit: 10,
				totalPages: 1
			};
			repo.getRooms.mockResolvedValueOnce(paginated as any);

			const res = await service.getRooms(1, 10);
			expect(repo.getRooms).toHaveBeenCalledWith(1, 10, { status: roomStatus.ACTIVE });
			expect(res).toBe(paginated as any);
		});

		it("propagates repository errors (rejects)", async () => {
			repo.getRooms.mockRejectedValueOnce(new Error("DB error"));
			await expect(service.getRooms(1, 10)).rejects.toThrow("DB error");
		});
	});

	describe("getRoom", () => {
		it("returns room when repo resolves", async () => {
			const room: Room = { _id: "r1", title: "T" };
			repo.getRoom.mockResolvedValueOnce(room);
			await expect(service.getRoom("r1")).resolves.toBe(room);
		});

		it("returns null when repo throws", async () => {
			repo.getRoom.mockRejectedValueOnce(new Error("boom"));
			await expect(service.getRoom("bad" as any)).resolves.toBeNull();
		});
	});

	describe("incrementRoomView", () => {
		it("calls repo.incrementRoomView", async () => {
			await service.incrementRoomView("id1");
			expect(repo.incrementRoomView).toHaveBeenCalledWith("id1");
		});

		it("rejects when repo fails", async () => {
			repo.incrementRoomView.mockRejectedValueOnce(new Error("fail"));
			await expect(service.incrementRoomView("id1")).rejects.toThrow("fail");
		});
	});

	describe("incrementRoomContactView", () => {
		it("calls repo.incrementRoomContactView", async () => {
			await service.incrementRoomContactView("id2");
			expect(repo.incrementRoomContactView).toHaveBeenCalledWith("id2");
		});

		it("rejects when repo fails", async () => {
			repo.incrementRoomContactView.mockRejectedValueOnce(new Error("fail2"));
			await expect(service.incrementRoomContactView("id2")).rejects.toThrow("fail2");
		});
	});

	describe("getRoomOwner", () => {
		it("returns owner when repo resolves", async () => {
			const owner: User = { _id: "u1", name: "Alice" };
			repo.getRoomOwner.mockResolvedValueOnce(owner);
			await expect(service.getRoomOwner("r1")).resolves.toBe(owner);
		});

		it("returns null and logs when repo throws", async () => {
			repo.getRoomOwner.mockRejectedValueOnce(new Error("no owner"));
			await expect(service.getRoomOwner("r1")).resolves.toBeNull();
		});
	});

	describe("createRoom", () => {
		it("returns created room and logs on success", async () => {
			const newRoom: Room = { title: "T", status: roomStatus.ACTIVE };
			const created: Room = { _id: "r1", title: "T", status: roomStatus.ACTIVE };
			repo.createRoom.mockResolvedValueOnce(created);
			const result = await service.createRoom(newRoom, "owner1");
			expect(repo.createRoom).toHaveBeenCalledWith(newRoom, "owner1");
			expect(result).toBe(created);
		});

		it("returns null when repo throws", async () => {
			repo.createRoom.mockRejectedValueOnce(new Error("create failed"));
			await expect(service.createRoom({ title: "T" }, "o1")).resolves.toBeNull();
		});
	});

	describe("updateRoom", () => {
		it("returns true when repo resolves", async () => {
			repo.updateRoom.mockResolvedValueOnce();
			await expect(service.updateRoom("r1", { name: "X" } as any)).resolves.toBe(true);
			expect(repo.updateRoom).toHaveBeenCalledWith("r1", { name: "X" });
		});

		it("returns false when repo throws", async () => {
			repo.updateRoom.mockRejectedValueOnce(new Error("update fail"));
			await expect(service.updateRoom("r1", { name: "X" } as any)).resolves.toBe(false);
		});
	});

	describe("changeRoomStatus", () => {
		it("delegates to updateRoom with status", async () => {
			repo.updateRoom.mockResolvedValueOnce();
			await service.changeRoomStatus("r1", roomStatus.HIDDEN);
			expect(repo.updateRoom).toHaveBeenCalledWith("r1", { status: roomStatus.HIDDEN });
		});

		it("rejects when repo fails", async () => {
			repo.updateRoom.mockRejectedValueOnce(new Error("status fail"));
			await expect(service.changeRoomStatus("r1", roomStatus.DELETED)).rejects.toThrow("status fail");
		});
	});

	// Edge cases
	describe("Edge cases", () => {
		it("getRoom returns null for empty id when repo throws", async () => {
			repo.getRoom.mockRejectedValueOnce(new Error("bad id"));
			// @ts-ignore
			await expect(service.getRoom("")).resolves.toBeNull();
		});

		it("updateRoom gracefully handles empty data object", async () => {
			repo.updateRoom.mockResolvedValueOnce();
			await expect(service.updateRoom("r1", {} as any)).resolves.toBe(true);
		});

		it("createRoom passes through partial room", async () => {
			const created: Room = { _id: "r2" };
			repo.createRoom.mockResolvedValueOnce(created);
			const result = await service.createRoom({}, "owner2");
			expect(repo.createRoom).toHaveBeenCalledWith({}, "owner2");
			expect(result).toBe(created);
		});
	});
});

export class RoomDoesNotExistError extends Error {
  constructor(roomNumber: number) {
    super(`The room ${roomNumber} does not exist`);
  }
}

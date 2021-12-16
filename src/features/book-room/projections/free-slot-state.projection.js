fromStream('manager.room-added')
  .when({
    $init: function () {
      return {
        123: [],
        209: [],
      };
    },
    RoomAddedEvent: function (state, event) {
      state[event.body.roomNumber].push([
        event.body.freeFromDate,
        event.body.freeToDate,
      ]);
    },
  })
  .outputState();

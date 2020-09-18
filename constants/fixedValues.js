export const ROOM_DATA = [
  { room: 1, image: '@assets/rooms/clarice-min.jpeg', name: 'Clarice Lispector' },
  { room: 2, image: '@assets/rooms/carlos-min.jpeg', name: 'Carlos Drummond de Andrade' },
  { room: 3, image: '@assets/rooms/cecilia-min.jpeg', name: 'Cecília Meireles' },
  { room: 4, image: '@assets/rooms/rui-min.jpeg', name: 'Rui Barbosa' },
  { room: 5, image: '@assets/rooms/machado-min.jpeg', name: 'Machado de Assis' },
  { room: 6, image: '@assets/rooms/monteiro-min.jpeg', name: 'Monteiro Lobato' },
  { room: 7, image: '@assets/rooms/luis-min.jpeg', name: 'Luís Fernando Veríssimo' },
  { room: 8, image: '@assets/rooms/cora-min.jpeg', name: 'Cora Coralina' },
  { room: 9, image: '@assets/rooms/carolina-min.jpeg', name: 'Carolina de Jesus' },
];

export const ROOM_IDS = ROOM_DATA.map((data) => data.room);

export const ROOM_NAME = ROOM_DATA.map((room) => room.name.split(' ')[0]);

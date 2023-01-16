export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface Albums {
  userId: number,
  id: number,
  title: string,
}

export interface Photos {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface PhotosFull extends Photos {
  album?: Albums;
  owner?: User;
}

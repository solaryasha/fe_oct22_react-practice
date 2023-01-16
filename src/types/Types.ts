export interface Albums {
  userId: number;
  id: number;
  title: string;
}

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
}

export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface PhotoFull extends Photo {
  album?: Albums;
  user?: User;
}

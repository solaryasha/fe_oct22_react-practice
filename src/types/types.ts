export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
}

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export interface AlbumFull extends Album {
  user?: User;
}

export interface PhotoFull extends Photo {
  album?: AlbumFull;
}

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface PreparedAlbum extends Album {
  user?: User,
}

export interface PreparedPhoto extends Photo {
  album?: Album,
}

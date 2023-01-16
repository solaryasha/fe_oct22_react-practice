export interface User {
  id: number,
  name: string,
  sex: string
}

export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface FullPhoto extends Photo {
  user?: User;
  album?: Album;
}

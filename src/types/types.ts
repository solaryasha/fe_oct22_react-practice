export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Album {
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

export interface PhotosFull extends Photos{
  album?: Album,
  user?: User,
}

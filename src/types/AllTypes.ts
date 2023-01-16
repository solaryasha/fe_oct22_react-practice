export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface FullPhotos extends Photo {
  albumTitle?: Album,
  userName?: User,
}

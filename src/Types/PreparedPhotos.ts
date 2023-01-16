interface Album {
  userId: number,
  id: number,
  title: string,
  user?: {
    id: number,
    name: string,
    sex: string,
  },
}

export interface PreparedPhotos {
  albumId: number,
  id: number,
  title: string,
  url: string,
  relatableAlbum?: Album,
}

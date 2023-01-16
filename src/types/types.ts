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

export interface Users {
  id: number,
  name: string,
  sex: string,
}

export interface TotalAlbums extends Albums {
  owner?: Users | null,
}

export interface TotalPhotos extends Photos {
  album?: TotalAlbums | null,
}

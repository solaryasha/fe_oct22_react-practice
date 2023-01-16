// photos as the main interface to find albuls and users in userId
export interface Photos {
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
  id: number,
  name: string,
  sex: string,
}

// to combine everything in one interface
// export interface fullPhotosAlbum extends Photos {
//   album?: Album,
//   user?: User,
// }

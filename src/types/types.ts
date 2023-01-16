export interface Album {
  userId: number
  id: number;
  title: string;
}

export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface PreparedPhotos {
  albumId: number,
  id: number;
  title: string;
  url: string;
  album: Album | null;
  user: User | null;
}

// export interface PreparedPhotos {
//   albumId: number,
//   id: number;
//   title: string;
//   url: string;
//   albumTitle: string | undefined;
//   userName: string | undefined;
// }

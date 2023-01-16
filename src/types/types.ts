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

export interface User {
  id: 1;
  name: 'Roma';
  sex: 'm';
}

export interface PreparedPhotos extends Photo {
  albumtitle: string;
  username: string;
  user: User;
}

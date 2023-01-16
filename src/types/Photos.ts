import { AlbumWithUser } from './Albums';
// import { User } from './Users';

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  // url: string,
}

export interface PhotoFull extends Photo {
  albumWithUser?: AlbumWithUser,
}

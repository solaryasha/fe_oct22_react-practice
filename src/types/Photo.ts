import { Album } from './Album';
import { User } from './User';

export type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
};

export type PhotosFull = Photo & {
  album?: Album;
  user?: User;
};

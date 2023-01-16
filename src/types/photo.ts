import { Album } from './album';
import { User } from './user';

export interface Photo{
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface PreparedProduct extends Photo {
  user?: User;
  alb?: Album;
}

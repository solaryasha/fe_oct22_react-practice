import { Album } from './album';
import { Photo } from './photos';
import { User } from './user';

export interface PreparedPhoto extends Photo {
  album?: Album,
  user?: User
}

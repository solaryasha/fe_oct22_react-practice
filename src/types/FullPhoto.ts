import { Album } from './Album';
import { Photo } from './Photo';
import { User } from './User';

export interface FullPhoto extends Photo {
  album?: Album,
  user?: User,
}

import { PhotosFull } from '../types/types';
import photos from './photos';
import albums from './albums';
import users from './users';

export const getPreparedPhotos = (): PhotosFull[] => {
  return photos.map(photo => {
    const album = albums.find(a => a.id === photo.albumId);
    const user = users.find(u => u.id === album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
};

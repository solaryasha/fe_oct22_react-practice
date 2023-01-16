import { PhotoFull } from '../types/types';
import albums from './albums';
import photos from './photos';
import users from './users';

export const getPreparedPhotos = (): PhotoFull[] => {
  return photos.map(photo => {
    const album = albums
      .find(alb => alb.id === photo.albumId);
    const owner = users
      .find(user => user.id === album?.userId);

    return {
      ...photo,
      album,
      owner,
    };
  });
};

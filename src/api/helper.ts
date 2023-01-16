import { PhotosFull } from '../types/types';

import photos from './photos';
import albums from './albums';
import users from './users';

export const getPreparedProducts = (): PhotosFull[] => {
  return photos.map(photo => {
    const album = albums
      .find(alb => alb.id === photo.albumId);
    const owner = users.find(user => user.id === album?.userId);

    return {
      ...photo,
      album,
      owner,
    };
  });
};

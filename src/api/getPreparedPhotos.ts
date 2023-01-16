import users from './users';
import photos from './photos';
import albums from './albums';

import { PhotoFull } from '../react-app-env';

export const getPreparedPhotos = (): PhotoFull[] => {
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

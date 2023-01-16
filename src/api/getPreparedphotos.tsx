import { fullPhotosAlbum } from '../types';
import photos from './photos';
import albums from './albums';
import users from './users';

// prepare all information about photos inside fullPhotosAlbum array
export const getPreparedPhotos = (): fullPhotosAlbum[] => {
  return photos.map(photo => {
    const album = albums.find(alb => alb.id === photo.albumId);
    const user = users.find(us => us.id === album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
};

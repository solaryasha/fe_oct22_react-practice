import { PhotoFull } from '../types/Photos';

interface Filters {
  query: string,
  selectedUserId: number,
}

export const filterPhotos = (photos: PhotoFull[], filters: Filters) => {
  const {
    query,
    selectedUserId,
  } = filters;

  const normalizedOuery = query.toLowerCase().trim();

  return photos.filter(photo => {
    const photoTitle = photo.title.toLowerCase();

    const isSearchQueryMatch = photoTitle.includes(normalizedOuery);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.albumWithUser?.user?.id === selectedUserId
      : true;

    return isSearchQueryMatch && isUserIdMatch;
  });
};

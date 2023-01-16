import { Prepared } from '../types/Photo';

interface Filters {
  searchQuery: string,
  selectedAlbomsIds: number[],
  selectedUserId: number,
}

export const filterPhotos = (photos: Prepared[], filters: Filters) => {
  const {
    selectedUserId,
    selectedAlbomsIds,
    searchQuery,
  } = filters;

  const preparedSearchQuery = searchQuery.toLowerCase();

  return photos.filter((photo) => {
    const { title } = photo;
    const albumId = photo.albumId || 0;
    const preparedTitle = title.toLowerCase();

    const isSearchQueryMatch = preparedTitle.includes(preparedSearchQuery);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbomsMatch = selectedAlbomsIds.length
      ? selectedAlbomsIds.includes(albumId)
      : true;

    return isSearchQueryMatch && isUserIdMatch && isAlbomsMatch;
  });
};

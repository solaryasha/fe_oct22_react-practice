/* eslint-disable max-len */
import { FC, memo, useState } from 'react';
import cn from 'classnames';

import { FullPhoto } from '../types/Photo';
import { getShortString } from '../helpers/getShortString';
import { SortType } from '../types/SortType';

type Props = {
  photos: FullPhoto[],
};

export const PhotosList: FC<Props> = memo(({ photos }) => {
  const [sortType, setSortType] = useState(SortType.NONE);
  const [isReversed, setIsReversed] = useState(false);
  const [sortClickNum, setSortClickNum] = useState(0);

  const handleSortClick = (newSortType: SortType) => {
    if (sortType !== newSortType) {
      setSortType(newSortType);
      setIsReversed(false);
      setSortClickNum(1);
    } else if (sortClickNum === 1) {
      setIsReversed(true);
      setSortClickNum(2);
    } else {
      setSortType(SortType.NONE);
      setIsReversed(false);
      setSortClickNum(0);
    }
  };

  const getSortedPhotos = () => {
    const sortedProducts = [...photos];

    switch (sortType) {
      case SortType.ID:
        sortedProducts.sort((a, b) => a.id - b.id);
        break;

      case SortType.PHOTO_NAME:
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case SortType.ALBUM_NAME:
        sortedProducts.sort((a, b) => {
          if (a.album && b.album) {
            return a.album.title.localeCompare(b.album.title);
          }

          return 0;
        });
        break;

      case SortType.USER_NAME:
        sortedProducts.sort((a, b) => {
          if (a?.album?.user && b?.album?.user) {
            return a.album.user.name.localeCompare(b.album.user.name);
          }

          return 0;
        });
        break;

      default:
        break;
    }

    if (isReversed) {
      sortedProducts.reverse();
    }

    return sortedProducts;
  };

  const photosForShow = getSortedPhotos();

  return (
    <table
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a href="#/" onClick={() => handleSortClick(SortType.ID)}>
                <span className="icon">
                  <i
                    className={cn(
                      'fas',
                      { 'fa-sort': sortType !== SortType.ID },
                      { 'fa-sort-up': sortType === SortType.ID && sortClickNum === 1 },
                      { 'fa-sort-down': sortType === SortType.ID && sortClickNum === 2 },
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Photo name

              <a href="#/" onClick={() => handleSortClick(SortType.PHOTO_NAME)}>
                <span className="icon">
                  <i
                    className={cn(
                      'fas',
                      { 'fa-sort': sortType !== SortType.PHOTO_NAME },
                      { 'fa-sort-up': sortType === SortType.PHOTO_NAME && sortClickNum === 1 },
                      { 'fa-sort-down': sortType === SortType.PHOTO_NAME && sortClickNum === 2 },
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Album name

              <a href="#/" onClick={() => handleSortClick(SortType.ALBUM_NAME)}>
                <span className="icon">
                  <i
                    className={cn(
                      'fas',
                      { 'fa-sort': sortType !== SortType.ALBUM_NAME },
                      { 'fa-sort-up': sortType === SortType.ALBUM_NAME && sortClickNum === 1 },
                      { 'fa-sort-down': sortType === SortType.ALBUM_NAME && sortClickNum === 2 },
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User name

              <a href="#/" onClick={() => handleSortClick(SortType.USER_NAME)}>
                <span className="icon">
                  <i
                    className={cn(
                      'fas',
                      { 'fa-sort': sortType !== SortType.USER_NAME },
                      { 'fa-sort-up': sortType === SortType.USER_NAME && sortClickNum === 1 },
                      { 'fa-sort-down': sortType === SortType.USER_NAME && sortClickNum === 2 },
                    )}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {photosForShow.map(({ id, title, album }) => (
          <tr key={id}>
            <td className="has-text-weight-bold">
              {id}
            </td>

            <td>{title}</td>
            <td>
              {album?.title && getShortString(album?.title, 21)}
            </td>

            <td
              className={cn({
                'has-text-link': album?.user?.sex === 'm',
                'has-text-danger': album?.user?.sex === 'f',
              })}
            >
              {album?.user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

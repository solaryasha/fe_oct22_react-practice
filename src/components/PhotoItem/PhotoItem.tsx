import React from 'react';
import cn from 'classnames';

import { FullPhoto } from '../../types/types';

type Props = {
  photo: FullPhoto;
  onMoveUp: (photoId: number) => void;
  onMoveDown: (photoId: number) => void;
};

export const PhotoItem: React.FC<Props> = (props) => {
  const { photo, onMoveUp, onMoveDown } = props;

  return (
    <tr>
      <td className="has-text-weight-bold">
        {photo.id}
      </td>

      <td>{photo.title}</td>
      <td>{photo.album?.title}</td>

      <td className={cn(
        { 'has-text-link': photo.user?.sex === 'm' },
        { 'has-text-danger': photo.user?.sex === 'f' },
      )}
      >
        {photo.user?.name}
      </td>

      <td>
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          className="button is-info is-outlined"
          onClick={() => onMoveDown(photo.id)}
        >
          &darr;
        </button>
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          className="button is-info is-outlined"
          onClick={() => onMoveUp(photo.id)}
        >
          &uarr;
        </button>
      </td>
    </tr>
  );
};

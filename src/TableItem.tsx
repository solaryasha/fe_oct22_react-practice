import React from 'react';
import cn from 'classnames';
import { FullPhoto } from './Types/types';

type Props = {
  photo: FullPhoto;
};

export const TableItem: React.FC<Props> = ({ photo }) => {
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
    </tr>
  );
};

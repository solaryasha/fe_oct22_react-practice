export interface Photos {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface Albums {
  userId: number,
  id: number,
  title: string,
}

export interface Users {
  id: number,
  name: string,
  sex: string,
}

export interface FullList extends Photos {
  album: Albums,
  user: Users,
}

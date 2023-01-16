/// <reference types="react-scripts" />

export interface Photo {
  id: number
  albumId: number
  title: string
  url: string

}

export interface Album {
  id: number
  userId: nubmer
  title: string
}

export interface User {
  id: number
  name: string
  sex: string
}

export interface PhotoFull extends Photo {
  album?: Album
  user?: User
}

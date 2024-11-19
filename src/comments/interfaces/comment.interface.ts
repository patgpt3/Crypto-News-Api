export interface Comment {
  id?: string;
  comment?: string;
  item?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  replies?: string[];
  isFlagged?: number;
  // favorites: user[];
}

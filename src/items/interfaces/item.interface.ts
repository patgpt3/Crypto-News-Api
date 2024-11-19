export interface Item {
  id?: string;
  title?: string;
  url?: string;
  text?: string;
  points?: number;
  createdAt?: Date;
  author?: string;
  comments?: string[];
  isFlagged?: number;
}

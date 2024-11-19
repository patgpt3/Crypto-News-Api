export class ItemDTO {
  readonly title?: string;
  readonly url?: string;
  readonly text?: string;
  readonly points?: number;
  readonly createdAt?: string;
  readonly author?: string;
  readonly comments?: string[];
  readonly isFlagged?: number;
}

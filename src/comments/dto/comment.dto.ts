export class CommentDTO {
  readonly title?: string;
  readonly comment?: string;
  readonly item?: string;
  readonly points?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly author?: string;
  readonly replies?: string[];
  readonly isFlagged?: number;
  // favorites: user[];
}

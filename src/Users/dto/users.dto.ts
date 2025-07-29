export class UserDTO {
  readonly username?: string;
  readonly password?: string;
  readonly privyId?: string; // Add Privy ID support
  readonly authToken?: string; // Add Privy auth token for verification
  readonly about?: string;
  readonly email?: string;
  readonly created?: string;
  readonly isFlagged?: number;
  readonly points?: number;
  readonly submissions?: string[];
  readonly comments?: string[];
  readonly upvotedSubmissions?: string[];
  readonly jobs?: string[];
  readonly replies?: string[];
}

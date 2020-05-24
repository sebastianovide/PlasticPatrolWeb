export interface Photo {
  owner_id: string;
  moderated: boolean;
  published: boolean;
  pieces: number;
}

export interface Group {
  displayName: string;
}

export interface User {
  groups?: string[];
}

export interface GroupStats {
  gid: string;
  displayName: string;
  pieces: number;
  uploaded: number;
}

export interface UserStats {
  uid: string;
  displayName: string;
  pieces: number;
  uploaded: number;
}

export interface Stats {
  totalUploaded: number;
  moderated: number;
  published: number;
  rejected: number;
  pieces: number;
  users: UserStats[];
  groups: GroupStats[];
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

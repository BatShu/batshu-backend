import { type RowDataPacket } from 'mysql2';

export interface LocationRow extends RowDataPacket {
  id: number
  x: number
  y: number
}

export interface UserRow extends RowDataPacket {
  id: number
  uid: string
  real_name: string|null
  bank_name: string|null
  account_number: string|null
}

export interface UserAccountUpdate {
  uid: string
  backName: string
  accountNumber: string
  realName: string
}

export interface UserInfoReadType {
  uid: string
  email?: string
  displayName?: string
  googleProfilephotoURL?: string
  backName: string | null
  accountNumber: string | null
  realName: string | null
}
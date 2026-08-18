import { getUser } from './user'
import { getBalanceWallet } from './wallet'

export interface HeaderInfo {
  id: number
  username: string
  balance: number
  exp: number
}

export async function getUserInfo(userId: number): Promise<HeaderInfo> {
  const [user, wallet] = await Promise.all([
    getUser(userId),
    getBalanceWallet(userId),
  ])

  return {
    id: user.id,
    username: user.username,
    balance: wallet.balance,
    exp: user.exp,
  }
}

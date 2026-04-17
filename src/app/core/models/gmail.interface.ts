export interface IGmailResponse {
  userId: number,
  updatedAt: Date,
  createdAt: Date,
  googleId: number,
  email: string,
  firstName: string,
  lastName: string,
  gmailEmail: string,
  gmailHistoryId: string
  gmailAccessToken: string,
  gmailTokenExpiry: Date
  gmailRefreshToken: string,
}

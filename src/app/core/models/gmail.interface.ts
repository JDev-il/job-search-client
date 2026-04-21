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
export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  receivedAt: string;
  unread: boolean;
}

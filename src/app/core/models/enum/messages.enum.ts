export enum AccountMessages {
  redirectMessage = "Redirecting you to your dashboard...",
  accountNotFoundMessage = "We couldn’t find an account with that information. Please check your input and try again."
}

export enum LoginMessages {
  newlogin = "Welcome to ",
  success = "Login successful.",
  loggedin = "You are now logged in.",
  error = "Invalid login credentials. Please try again.",
  welcomeback = "Welcome back, ",
}

export enum IncorrectCredentialsMessages {
  invalidUsername = "Email or password is incorrect.",
  invalidpassword = "Password does not match our records."
}

export enum SessionExpiredMessages {
  expired = "Your session has expired. Please log in again.",
  securityreason = "For security reasons, you have been logged out. Please log in to continue."
}

export enum UserMessages {
  datamissing = "No data found for this user!"
}

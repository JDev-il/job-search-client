export enum AccountMessages {
  redirectMessage = "Redirecting you to your dashboard...",
  accountNotFoundMessage = "We couldn’t find an account with that information. Please check your input and try again.",
  failedMessage = "Http failure response for http://localhost:3000/users/add: 400 Bad Request"
}

export enum UserMessages {
  newuser = "Welcome to ",
  success = "Login successful",
  loggedin = "You are now logged in!",
  error = "Invalid login credentials, please try again",
  welcomeback = "Welcome back, ",
}

export enum ValidationMessages {
  invalidUsername = "Email or password is incorrect.",
  invalidpassword = "Password does not match our records."
}

export enum SessionMessages {
  expired = "Your session has expired. Please log in again.",
  securityreason = "For security reasons, you have been logged out. Please log in to continue."
}

export enum DataMessages {
  datamissing = "We did't find any applictaions.."
}

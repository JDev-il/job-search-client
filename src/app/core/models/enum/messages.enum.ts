export enum AccountMessages {
  redirectMessage = "Redirecting you to your dashboard...",
  accountNotFoundMessage = "We couldn’t find an account with that information. Please check your input and try again.",
  failedMessage = "Http failure response for http://localhost:3000/users/add: 400 Bad Request"
}

export enum NotificationsStatusEnum {
  error = "error",
  successlog = "success-login",
  successreg = "success-register"
}

export enum UserMessages {
  newuserwelcome = "Welcome to ",
  registrationsuccess = "Register successful! Please Wait..",
  loginsuccess = "Loading Your Dashboard..",
  userloggedin = "You are now logged in!",
  welcomeback = "Welcome back, ",
}

export enum ErrorMessages {
  userexistserror = "User already exists!",
  userloginerror = "Invalid login details..",
  invalidcreds = "Invalid credentials",
  invalidusername = "Email or password is incorrect",
  invalidpassword = "Password does not match our records",
}

export enum SessionMessages {
  expired = "Your session has expired. Please log in again.",
  securityreason = "For security reasons, you have been logged out. Please log in to continue."
}

export enum DataMessages {
  datamissing = "We did't find any applictaions.."
}

export enum AccountMessagesEnum {
  redirectMessage = "Redirecting you to your dashboard...",
  accountNotFoundMessage = "We couldn’t find an account with that information. Please check your input and try again.",
  failedMessage = `Http failure response for /users/add: 400 Bad Request`
}

export enum NotificationsStatusEnum {
  error = "error",
  successlog = "success-login",
  successreg = "success-register",
}

export enum ConsentDialogTitlesEnum {
  welcome = "Welcome to CV Tracker!",
  congrats = "Congratulations on Adding Your First CV!",
}

export enum DialogBodyMessagesEnum {
  successMessage = "You've successfully added your first application!",
  welcomeMessage = "We provide many job seekers with easy way of tracking, organizing, and receive valuable insights on their status!",
  autoTrackerMessage = "Would you like our AutoTracker service to help you track and organize your CVs for free?",
}

export enum UserMessagesEnum {
  newuserwelcome = "Welcome to ",
  registrationsuccess = "Register successful! Please Wait..",
  loginsuccess = "Loading Your Dashboard..",
  userloggedin = "You are now logged in!",
  welcomeback = "Welcome back, ",
}

export enum ErrorMessagesEnum {
  userexistserror = "User already exists!",
  userloginerror = "Invalid login details..",
  invalidcreds = "Invalid credentials",
  invalidusername = "Email or password is incorrect",
  invalidpassword = "Password does not match our records",
}

export enum SessionMessagesEnum {
  expired = "Your session has expired. Please log in again.",
  securityreason = "For security reasons, you have been logged out. Please log in to continue."
}

export enum DataMessagesEnum {
  datamissing = "We did't find any applictaions.."
}

export enum NoDataTextEnum {
  noDataTitle = "No data",
  noDataTitleDashboard = "You have no applications",
  noDataDashboard = "Add new applications in the activity table\nto view more insights",
}

export function linkToLogin() {
  return "/login";
}

export function linkToLoginWithRedirectOnSuccess(redirectToOnSuccess: string) {
  return {
    pathname: linkToLogin(),
    state: {
      redirectToOnSuccess
    }
  };
}

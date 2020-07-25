import { user } from "../fixtures/users";
import { routes, selectors, requestUrls } from "../fixtures/common";

describe("sign in", () => {
  beforeEach(() => {
    cy.server();
    cy.route({ url: requestUrls.verifyPassword, method: "POST" }).as(
      "POST/verifyPassword"
    );
    cy.route({ url: requestUrls.getAccountInfo, method: "POST" }).as(
      "POST/getAccount"
    );
  });

  it("users can sign in and login state is persisted", () => {
    cy.visit(routes.login);

    cy.contains("email").click();

    cy.contains("Next").click();

    cy.get(selectors.emailInput).type(user.email);

    cy.contains("Next").click();

    cy.get(selectors.passwordInput).type(user.password);

    cy.contains("Sign In").click();

    cy.wait("@POST/verifyPassword");
    cy.wait("@POST/getAccount");

    cy.visit(routes.home);

    cy.getTestElement("Burger").click();

    cy.contains("Logout");

    // check persisted on reload
    cy.reload();
    cy.getTestElement(selectors.burger).click();
    cy.contains("Logout", { timeout: 20000 });
  });

  it("users that login via the upload photo button are redirected to the new login page", () => {
    cy.visit(routes.home);

    cy.contains("Record").click();
    cy.containsTestElement(selectors.loginButton, "Login").click();

    cy.contains("email").click();

    cy.contains("Next").click();

    cy.get(selectors.emailInput).type(user.email);

    cy.contains("Next").click();

    cy.get(selectors.passwordInput).type(user.password);

    cy.contains("Sign In").click();

    cy.wait("@POST/verifyPassword");
    cy.wait("@POST/getAccount");

    cy.url().should("contain", routes.newPhoto);
  });
});

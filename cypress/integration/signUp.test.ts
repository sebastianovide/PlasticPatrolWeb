import { v4 as uuid } from "uuid";
import { routes, selectors } from "../fixtures/common";

describe("sign up", () => {
  it("users can sign up using email", () => {
    cy.visit(routes.login);

    cy.contains("email").click();

    cy.get(selectors.emailInput).type(`${uuid()}@email.com`);

    cy.contains("Next").click();

    cy.get("#ui-sign-in-name-input").type("test user");

    cy.get("#ui-sign-in-new-password-input").type("asdf1234!"); // not my password

    cy.contains("Save").click();

    cy.getTestElement("Burger").click();

    cy.contains("Logout");

    // check persisted on reload
    cy.reload();
    cy.getTestElement(selectors.burger).click();
    cy.contains("Logout", { timeout: 20000 });
  });
});

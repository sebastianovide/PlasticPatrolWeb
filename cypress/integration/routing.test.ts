import { user } from "../fixtures/users";
import { routes, selectors } from "../fixtures/common";

describe.skip("routing", () => {
  it("if a user goes to the tutorial page from the new photo page they are redirected back to the new photo page", () => {
    cy.login(user.email, user.password);
    cy.wait(5000);

    cy.visit(routes.newPhoto);

    cy.log("testing routing from close button");
    cy.contains("tutorial").click();
    cy.url().should("include", routes.tutorial);

    cy.getTestElement(selectors.close).click();
    cy.url().should("include", routes.newPhoto);

    cy.log("testing routing from get started button");
    cy.contains("tutorial").click();
    cy.getTestElement("NavDot-3").click();

    cy.contains("Get started").click();
    cy.url().should("include", routes.newPhoto);
  });
});

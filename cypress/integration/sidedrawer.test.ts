import { user, moderator } from "../fixtures/users";
import { routes, selectors } from "../fixtures/common";

function checkStaticLinks() {
  cy.contains("Clean-ups").should(
    "have.attr",
    "href",
    "https://planetpatrol.co/clean-ups/"
  );

  cy.contains("Terms and Conditions").should(
    "have.attr",
    "href",
    "https://planetpatrol.co/terms-and-conditions/"
  );

  cy.contains("Privacy Policy").should(
    "have.attr",
    "href",
    "https://planetpatrol.co/privacy-policy/"
  );
}

describe("sidedrawer ui (checks correct values exist)", () => {
  it("anaonymous side drawer ui", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("welcomeShown", "true");
      win.localStorage.setItem("termsAccepted", "Yes");
    });
    cy.visit(routes.home);

    cy.getTestElement(selectors.burger).click();

    checkStaticLinks();

    cy.contains("Account").should("not.exist");
    cy.contains("Photo Approval").should("not.exist");
    cy.contains("Feedback Reports").should("not.exist");

    cy.contains("Leaderboard").should("have.attr", "href", routes.leaderboard);
    cy.contains("Tutorial").should("have.attr", "href", routes.tutorial);
    cy.contains("About").should("have.attr", "href", routes.about);
    cy.contains("Feedback");

    // find the network request that does this
    cy.contains("Login", { timeout: 20000 });

    cy.contains("pieces found so far!");

    cy.getTestElement("SponsorLogo");
  });

  it("standard user side drawer ui", () => {
    cy.login(user.email, user.password);
    // bit gross - waits for fetches to finish
    //TODO: find the right request
    cy.wait(2000);

    cy.getTestElement(selectors.burger).click();

    checkStaticLinks();

    cy.contains("Account").should("have.attr", "href", routes.account);

    cy.contains("Photo Approval").should("not.exist");
    cy.contains("Feedback Reports").should("not.exist");

    cy.contains("Leaderboard").should("have.attr", "href", routes.leaderboard);
    cy.contains("Tutorial").should("have.attr", "href", routes.tutorial);
    cy.contains("About").should("have.attr", "href", routes.about);
    cy.contains("Feedback");

    cy.contains("Logout");

    cy.getTestElement("SponsorLogo");
  });

  it("moderator side drawer ui", () => {
    cy.login(moderator.email, moderator.password);

    cy.getTestElement(selectors.burger).click();

    cy.contains("Account").should("have.attr", "href", routes.account);
    cy.contains("Photo Approval", { timeout: 20000 }).should(
      "have.attr",
      "href",
      routes.photoApproval
    );
    cy.contains("Feedback Reports").should(
      "have.attr",
      "href",
      routes.feedbackReports
    );

    cy.contains("Leaderboard").should("have.attr", "href", routes.leaderboard);

    cy.contains("Tutorial").should("have.attr", "href", routes.tutorial);
    cy.contains("About").should("have.attr", "href", routes.about);
    cy.contains("Feedback");

    cy.contains("Logout");

    cy.getTestElement("SponsorLogo");
  });
});

describe("sidedrawer ui (checks correct values exist)", () => {
  it("anaonymous side drawer ui", () => {
    cy.viewport("iphone-5");

    cy.window().then((win) => {
      win.localStorage.setItem("welcomeShown", "true");
      win.localStorage.setItem("termsAccepted", "Yes");
    });
    cy.visit("/");

    cy.getTestElement("Burger").click();

    cy.contains("Account").should("not.exist");
    cy.contains("Photo Approval").should("not.exist");
    cy.contains("Feedback Reports").should("not.exist");

    cy.contains("Leaderboard");
    cy.contains("Clean-ups").should(
      "have.attr",
      "href",
      "https://plasticpatrol.co.uk/clean-ups/"
    );

    cy.contains("Tutorial");
    cy.contains("About");
    cy.contains("Feedback");

    // find the network request that does this
    cy.contains("Login", { timeout: 20000 });

    cy.contains("pieces found so far!");

    cy.getTestElement("SponsorLogo");

    cy.contains("Terms and Conditions").should(
      "have.attr",
      "href",
      "https://plasticpatrol.co.uk/terms-and-conditions/"
    );

    cy.contains("Privacy Policy").should(
      "have.attr",
      "href",
      "https://plasticpatrol.co.uk/privacy-policy/"
    );
  });
});

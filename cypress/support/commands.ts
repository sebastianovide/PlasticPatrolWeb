// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
  "getTestElement",
  { prevSubject: "optional" },
  (subject, selector: string) =>
    subject
      ? subject.get(`[data-test="${selector}"]`)
      : cy.get(`[data-test="${selector}"]`)
);

Cypress.Commands.add(
  "containsTestElement",
  { prevSubject: "optional" },
  (subject, selector: string, text: string) =>
    subject
      ? subject.contains(`[data-test="${selector}"]`, text)
      : cy.contains(`[data-test="${selector}"]`, text)
);

Cypress.Commands.add("login", (email: string, password: string) => {
  // needs to make sure firebase is on the window
  cy.visit("#/");
  cy.window().then((win) => {
    //@ts-ignore
    const firebase = win.__firebase__;

    return new Cypress.Promise((res, rej) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res)
        .catch((err: Error) => {
          rej(err);
        });
    });
  });
});

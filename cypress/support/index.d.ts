// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getTestElement(selector: string): Chainable<Element>;
    containsTestElement(selector: string, text: string): Chainable<Element>;\

    login(email:string,password:string):void
  }
  

}

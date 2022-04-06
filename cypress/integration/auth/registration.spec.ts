describe("the registration page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should display the first step of registration form", () => {
    cy.get('[data-testid="login-form"]').should("be.visible");
  });

  it("should validate the first step", () => {});

  it("should take the user to the address step if the email does not exist", () => {});
  
  it("should allow the user to register when the form is complete and take the user to the ballot page", () => {
    cy.get('[data-testid="register-form]').should("be.visible");
  });

  
});

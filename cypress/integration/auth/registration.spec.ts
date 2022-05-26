describe("the registration page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should display the first step of registration form", () => {
    cy.get('[data-testid="register-form-1"]').should("be.visible");
  });
});

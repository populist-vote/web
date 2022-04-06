describe("the login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login form", () => {
    cy.get('[data-testid="login-form"]').should("be.visible");
  });

  it("should validate the login form", () => {});

  // the next two tests rely on staging data
  it("should not allow the user to login with invalid credentials", () => {});

  it("should allow the user to login with valid credentials", () => {});
});

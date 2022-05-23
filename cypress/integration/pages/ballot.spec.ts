describe("the ballot page", () => {
  it("should display the login page for an unauthenticated user", () => {
    cy.visit("/ballot");
    cy.get("[data-testid='login-form']").should("be.visible");
  });
});

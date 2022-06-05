describe('smoke tests', () => {
  it('should have hello world', () => {
    cy.visit('/');
    cy.findByText('Hello World');
  });
});

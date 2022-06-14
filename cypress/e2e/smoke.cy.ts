describe('smoke tests', () => {
  it('should have hello world by default', () => {
    cy.visit('/');
    cy.contains('Hello World');
  });
  it('should translate to german', () => {
    cy.visit('/?lng=de');
    cy.contains('Hallo Welt');
  });
});

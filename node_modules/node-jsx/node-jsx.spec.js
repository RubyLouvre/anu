describe('node-jsx', function() {
  it('should work', function() {
    require('./index').install();
    expect(require('./test-module').indexOf('data-reactid')).toBeGreaterThan(-1);
  });
});

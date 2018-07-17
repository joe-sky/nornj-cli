app.get('/#{pageName}#', function(req, res) {
  res.type('html');
  res.render('#{pageName}#', { page: '#{pageName}#/', title: '#{pageName | pascal}#' });
});

//{pages}//
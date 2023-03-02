@app
REPL_APP_SLUG

@http
/*
  method any
  src server

@static
prune true
compression gzip

@aws
cors *
# profile default
region us-east-1

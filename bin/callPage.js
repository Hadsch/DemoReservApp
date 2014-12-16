

var http = require('http');

http.get("http://reserv.herokuapp.com", function(res) {
  console.log("Got response: " + res.statusCode);
  process.exit();
}).on('error', function(e) {
  console.log("Got error: " + e.message);
  process.exit();
});


var express = require('express');
app = express.createServer();
/*app.get('/', function(req, res) {
    res.send('testing');
});*/

app.use(express.static(__dirname + '/public'));

app.listen(process.env.VCAP_APP_PORT || 3000);

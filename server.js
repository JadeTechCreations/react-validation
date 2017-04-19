var express = require('express');
var app     = express();
var morgan  = require('morgan');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.set('port', (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3030));
app.set('ip', (process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'));
app.set('build', (process.env.BUILD || process.env.OPENSHIFT_BUILD_REFERENCE || 'local'));

var BUILD_DIR = path.resolve(__dirname, 'src/dist');

app.use(bodyParser.json());
app.use('/api', upload.array('files'), (req, res) => {
  var build = app.get('build');


  var url = '';
  if(build === 'local'){
    url = 'http://localhost:7700';
  } else {
    url = 'http://validation-pdm-aries2.agn-cloud.availity.net';
  }

  url = url + req.path;

  var formData = {};

  if(req.files != undefined) {
    for (var filekey in req.files) {
      if (req.files.hasOwnProperty(filekey)) {
        //check to see if the array has been created
        if(formData['filedata'] === undefined) {
          formData['filedata'] = [];
        }
        formData['filedata'].push(fs.createReadStream(req.files[filekey].path));
      }
    }
  }

  var body = JSON.parse(JSON.stringify(req.body));

  for (var key in body) {
    if (body.hasOwnProperty(key)) {
      formData[key] = body[key];
    }
  }

  request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      console.error('upload failed:', err);
    }

    res.send(body);
  });

});
// app.use('/api', proxy('pdm-aries2.agn-cloud.availity.net'));

// handle static page routes (js, css)
app.use('/static', express.static(path.join(BUILD_DIR, '/static')));
// handle views
app.set('views', BUILD_DIR);

app.all('*', function(req, res) {
  res.render('index.html');
});

// app.listen(port, ip);
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

module.exports = app;

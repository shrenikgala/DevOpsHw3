var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var proxy = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
    
     var url = 'http://'+server.address().address+':'+server.address().port+req.url;
	
 	client.lpush('url_list',url);       
  client.ltrim('url_list',0,4);
    
	next(); // Passing the request to the next handler in the stack.
});

proxy.use(function(req, res, next){
  client.rpoplpush("servers", "servers", function(err, value){
    console.log('redirecting to ' + value);
    res.redirect(value+req.url);
  });
});




app.get('/set', function(req,res){
    client.set("1","This message will self-destruct in 10 seconds !");
    client.expire("1", 10);
    res.send("The key is set. It will expire in 10 seconds !");
});
app.get('/get', function(req,res){
   client.get("1", function(err,value){
       if(value==null || value == undefined)       // if the key is expired
           res.send("Key has expired !");
       else
           res.send(value)
    });
});
 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		console.log(img);
 	  		client.lpush("img", img);

 		});
 	}

    res.status(204).end()
 }]);


 app.get('/meow', function(req, res) {
 	{

 		client.lpop("img", function(err,image)                            // pop the images from the queue
		{
			console.log(image);
			res.writeHead(200, {'content-type':'text/html'});                 // get html page
			res.write("<h1>\n<img src='data:img.jpg;base64,"+image+"'/></h1>");                    // write the image to the html content
			res.end();                                                        
		});
		
	}
});
app.get('/recent', function(req, res){

	
      client.lrange("url_list", 0, 4, function(err, urls){                        
      var output='List of top 5 recent requests to this server are: <br>';
      for (var i = 0; i < urls.length; i++) {                                 
        output = output + urls[i] +" <br>";                  
        output = output +"\n";                                               
      }
      res.send(output);                                                      
  
      });
  
});
app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = proxy.listen(80, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('proxy server listening at http://%s:%s', host, port);
});

// HTTP SERVER
 var server1 = app.listen(3000, function () {

   var host = server1.address().address
   var port = server1.address().port
   client.lpush("servers",'http://'+ host +':' + port);
   console.log('Example app listening at http://%s:%s', host, port)
 });

  var server2 = app.listen(3001, function () {                            

   var host = server2.address().address
   var port = server2.address().port
    client.lpush("servers",'http://'+ host +':' + port);
   console.log('Example app listening at http://%s:%s', host, port)
 });

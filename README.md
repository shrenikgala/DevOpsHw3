#START PAGE
![Screenshots][image_id]
[image_id]:https://github.com/shrenikgala/DevOpsHw3/blob/master/start%20page.png

#GET ,SET, AND RECENT
![Screenshots][image_id1]
[image_id1]:https://github.com/shrenikgala/DevOpsHw3/blob/master/set.png
![Screenshots][image_id2]
[image_id2]:https://github.com/shrenikgala/DevOpsHw3/blob/master/get
## GET with a delay of 10 secs
![Screenshots][image_id3]
[image_id3]:https://github.com/shrenikgala/DevOpsHw3/blob/master/get%20with%20the%20delay.png
![Screenshots][image_id4]
[image_id4]:https://github.com/shrenikgala/DevOpsHw3/blob/master/recent.png

#UPLOAD AND MEOW
You can upload a pic using the following command
<pre>curl -F "image=@./img/morning.jpg" localhost:3000/upload</pre>
![Screenshots][image_id5]
[image_id5]:https://github.com/shrenikgala/DevOpsHw3/blob/master/uploadmeow.png

#ADDITIONAL SERVER AND PROXY
![Screenshots][image_id6]
[image_id6]:https://github.com/shrenikgala/DevOpsHw3/blob/master/extraserver%20and%20proxy.png

#PROXY SERVER WORKING AND CODE
Created a proxy server using the following code
<pre>
var proxy = express()
proxy.use(function(req, res, next){
  client.rpoplpush("servers", "servers", function(err, value){
    console.log('redirecting to ' + value);
    res.redirect(value+req.url);
  });
});
var server = proxy.listen(80, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('proxy server listening at http://%s:%s', host, port);
});
</pre>

Also adding every http server in a "servers" queue 
<pre> client.lpush("servers",'http://'+ host +':' + port);</pre>

## Screencast
![Image](https://github.com/shrenikgala/DevOpsHw3/blob/master/gif.gif)
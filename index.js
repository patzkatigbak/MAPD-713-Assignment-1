var SERVER_NAME = 'images-api'
var PORT = 5000;
var HOST = '127.0.0.1';
var getCounter = 0
var postCounter = 0



var restify = require('restify')

  // Get a persistence engine for the images
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: %s/images', server.url)
  console.log('Method: GET, POST')
  console.log('******** Resources: **********')
  console.log(' /images')
  console.log(' /images/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Return all of the images in the system
    res.send(images)

    console.log('> images GET: received request')
    getCounter = getCounter+1
    console.log('Processed Request Count --> Get: %s, Post: %s', getCounter, postCounter)
    console.log('--------------------------------------------------')

  })
})

// Get a single image by their id
server.get('/images/:id', function (req, res, next) {

  // Find a single image by their id within save
  imagesSave.findOne({ _id: req.params.id }, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (image) {
      // Send the image if no issues
      res.send(image)
      console.log('> images GET: received request')
      getCounter = getCounter+1
      console.log('Processed Request Count --> Get: %s, Post: %s', getCounter, postCounter)
      console.log('--------------------------------------------------')

    } else {
      // Send 404 header if the image doesn't exist
      res.send(404)
    }
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('url must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('size must be supplied'))
  }
  var newImage = {
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}

  // Create the image using the persistence engine
  imagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the image if no issues
    res.send(201, image)
  })

  console.log('> images POST: received request')
  postCounter = postCounter+1
  console.log('Processed Request Count --> Get: %s, Post: %s', getCounter, postCounter)
  console.log('--------------------------------------------------')


})

// Update a image by their id
server.put('/images/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('url must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('size must be supplied'))
  }
  
  var newImage = {
		_id: req.params.id,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}
  
  // Update the image with the persistence engine
  imagesSave.update(newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete image with the given id
server.del('/images/:id', function (req, res, next) {

  // Delete the image with the persistence engine
  imagesSave.delete(req.params.id, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})

// Delete all images in the system
server.del('/images', function (req, res, next) {
    
  // Delete every entity within the given collection
  imagesSave.deleteMany({}, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    res.send()
  })
})

imagesSave.create(newImage={"name":"Patz Photo",
  "url":"http://Photo.com/PatzPhoto", "size":"500kb"})

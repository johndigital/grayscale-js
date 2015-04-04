# Grayscale.js
> Leverage web workers to generate grayscale versions of any image on the front end.

### The Problem:
There is currently no good way of applying a grayscale effect to images on a given site. There are a few existing 
methods but they all have major drawbacks. Here are some popular ways of achieving grayscale and reasons why they suck:

1. __Using CSS `filter`:__
  This is by far the easiest method, just add some prefixed css properties and you're done! Why does it suck? Performance.

  Your CSS code will probably look something like this:
  ```css
  img.desaturate{
     -webkit-filter: grayscale(100%);
     filter: grayscale(100%);
      filter: gray;
      filter: url("data:image/svg+xml;utf8,<svg...some crazy SVG code here");
  }
  ```
  The problem is that the browser will be applying these filters on the fly as the user browses the page, which means that
  every paint operation the browser does will take a significant amount of time, and is likely to slow down the performance
  of any other animations or javascript you may have going on at the time. If you have found this to be the case then 
  you may have been inclined to try out option two.

2. __Using two copies of every image:__
  This is a more complicated approach that involves having a second grayscale copy of every image on the site, and 
  stacking it on top of the color image to make it look like it changes (assuming you're going for a hover effect.)
  This can be achieved manually, or more likely by using some server-side script that will do all the image conversion
  for you. This removes all the browser rendering from the equation, but it still sucks. If you have a lot of images on your 
  site, loading two copies of each one will double your pageload and your site will appear to be slow at first.
  
  If the site is not very image heavy or you're serving assets from the world's greatest CDN then this may be fine
  for you, but in most cases this is still not ideal.

### The (Possible) Solution:
Grayscale.js allows you to easily send images to a separate javascript thread that will quickly convert them to graysclae and send them back. This way you only send one of each image to the client, the browser processes them once and won't have to paint them on the fly, and the resulting image is stored in their cache to speed up future pageloads.

#### Examples:

The basic syntax looks like this:
`.makeGrayscale( [single ] [, complete ] )`

The `makeGrayscale` method can be called on any collection, but will only process `img` elements within the collection. It has two parameters that both represent callbacks:
* __single__ will be fired each time an image in the collection is finished processing. It receives an object containing data about the image that was processed.
* __complete__ will be fired once all the images in the collection have been successfully processed. It receives an integer representing the total amount of images that were processed.

__Here's a basic example of how it works:__
```js
  $('img').makeGrayscale(function(imgData){
    console.log('an image came back!');
  }, function(total){
    console.log('all images are done processing');
  });
```

`imgData` in this example is an object that will look something like this:
```js
  {
    index: 2,
    height: 960,
    width: 540,
    url: "data:image/png;base64,iVBORw0KGg......",
    img: {/* JS Image() object */}
  }
```

Since the images won't come back in the strict order they're given, the __index__ property is provided so you can keep track of which one is which. The __height__ and __width__ properties are the dimensions of the newly created image and should match the natural dimensions of the source. 
The __url__ property will be a raw data URL of the new image and the __img__ property will be a full Image() object that will be ready to be appended into the DOM. 

__So a more comprehensive example might look like this:__
```js
  $('img').makeGrayscale(function(imgData){
    $('img').eq(imgData.index).after($(imgData.img));
  });
```
This will grayscale every image on the page and place the processed version directly after the original.

#### A note about performance:
There's no way around the processing overhead of creating a processed image in javascript. If you feed a lot of images into grayscale.js, it's going to a take a few seconds to process them. 

This may leave you wondering why you would even bother to use it since loading grayscale images off the server will result in a similar wait time and in some cases may be easier. The advantage of grayscale.js is that running the processing in a separate thread will __not__ affect browser performance while the processing is happening. If you have any animations or transitions happening at the time of processing, your framerate should remain unaffected and the perceived performance of the site will be greater.

Basically running a grayscale effect in this way is not for everyone. There is a slight overhead in complexity, and the overall benefit is small but important.

#### Plans for the future
Here are a few things that I plan to implement in the future:
* ability to process images that are set as backgrounds in css
* full localstorage support for better performance
* more effects other than grayscale (blur, tint, brighten, etc.)
* The ability to extend grayscale.js by rolling your own effects

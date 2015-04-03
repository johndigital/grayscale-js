# Grayscale.js
Leverage web workers to generate grayscale versions of any image on the front end.

### The Problem:
There is currently no good way of applying a grayscale effect to images on a given site. There are a few existing 
methods but they all have major drawbacks. Here are some popular ways of achieving grayscale and reasons why they suck:

1. __Using CSS `filter`:__
  This is by far the easiest method, just add some prefixed css properties and you're done! Why does it suck? Performance.

  Your CSS code will probably look something like this:
  ````css
  img.desaturate{
     -webkit-filter: grayscale(100%);
     filter: grayscale(100%);
      filter: gray;
      filter: url("data:image/svg+xml;utf8,<svg...some crazy SVG code here");
  }
  ````
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
  
  If the site is not very image heavy or 

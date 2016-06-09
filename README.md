# BloggerMap 

BloggerMap is just a Javascript class that renders a list of blogger post entrys to a google maps.

![alt tag](https://raw.githubusercontent.com/henrikborchers/bloggerMap/master/example.png)

## Requirements
  - google account
  - blog on blogger (https://www.blogger.com/)

## Add a new page to your blog
- Create a new page on your blog by navigate to Pages -> New page
- Enter a title 
- Now open Page settings and tick the following radio buttons:
    - Don't allow, hide existing
    - Interpret typed HTML
    - User <br> tag

> Attention: Keep in mind that if your not using this setting there might be some issues! 

## Add the div
```html
<div id="map-canvas" style="background-color: rgba(222, 187, 0,0.3); height: 600px; margin: 0px; padding: 0px; width: 100%;">
</div>
```

## Add the libs
```html 
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
<script src="http://www.geocodezip.com/scripts/v3_epoly.js"></script>
<script src="https://rawgit.com/henrikborchers/bloggerMap/master/bloggerMap.js"></script>
```

## Create a google.maps.Map object
```html 
<script type="text/javascript">
var map;
function initialize(json){
    var postArray = json.feed.entry;
    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(-33, 151),
        mapTypeControl: false,  
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
```

## Use the BloggerMap-Class
```html 
    var bloggerMap = new BloggerMap();
    bloggerMap.init(map);    
    bloggerMap.initialize(postArray);  
```

## Load the feeds from your blog
```html 
<script src="/feeds/posts/default?max-results=499&amp;orderby=published&amp;alt=json-in-script&amp;callback=initialize">
</script>
```

## Post on Blogger
Now when you add a post to your blog add on of the following labels:
- routeoptions:afoot
- routeoptions:bus
- routeoptions:car
- routeoptions:plane
- routeoptions:ship
- routeoptions:bicycle
- routeoptions:train

> Note: if your not using on of these labels on a post it can be that your getting error throw from your js.

## Add your own labels and images
you can add your own images and label-tags if you want. For that just use the mehtods:
```javascript 
    var markerIcons = new Object();
    markerIcons["mylabel"] = "https://mypage.domain/imgae.png"; 
     
    bloggerMap.setMarkerIcons(markerIcons);
```
Or
```javascript     
    var colors = new Object();
    colors["mylabel"] = "#adff2f"; // 173 255 47
    
    bloggerMap.setColorss(colors);
```
> Keep in might that your labe now is "routeoptions:mylabel".

/**
 * Creates an instance of BloggerMap.
 * This class needs a div container, in which it can render the map.
 *
 * @constructor
 * @this {BloggerMap}
 * @param {google.maps.Map} googleMap The map object
 */
function BloggerMap()
{
    var map;
    var colors; 
    var markerIcons; 
    var bounds; 
 
    /**
     * Gets the default MarkerIcons
     * 
     * @this {BloggerMap}
     * 
     * @returns {Object} Key/Value Dic with routeOption as Key and Link to Icon as Value
     */
    var getDefaultMarkerIcons = function (){
        var markerIcons = new Object();
        markerIcons["bus"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/bus.png"; // 173 255 47
        markerIcons["car"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/car.png"; // 255 99 71
        markerIcons["plane"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/airport.png"; //135 206 235
        markerIcons["ship"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/ferry.png"; //25 25 112
        markerIcons["bicycle"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/cycling.png"; //128 0 128
        markerIcons["afoot"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/walkingtour.png"; // 0 0 0
        markerIcons["train"] = "https://rawgit.com/henrikborchers/bloggerMap/master/images/train.png"; // 255 0 0 markerIcons["start"] = "";
        markerIcons["end"] = "";
        return markerIcons;
    }

    /**
     * Gets the default Colors
     * 
     * @this {BloggerMap}
     * 
     * @returns {Object} a Key value dic Key is the routeOption and Value the color of the polyline
     */
    var getDefaultColors = function(){
        var colors = new Object();
        colors["bus"] = "#adff2f"; // 173 255 47
        colors["car"] = "#ff6347"; // 255 99 71
        colors["plane"] = "#87ceeb"; //135 206 235
        colors["ship"] = "#191970"; //25 25 112
        colors["bicycle"] = "#800080"; //128 0 128
        colors["afoot"] = "#000000"; // 0 0 0
        colors["train"] = "#ff0000"; // 255 0 0
        return colors;
    }

    /**
     * Gets the default center position for the map
     *
     * @this {BloggerMap}
     * 
     * @returns {google.maps.LatLng} position on which is shown o the mal if no post is found
     */
    var defaultCenterPosition = function(){
        return new google.maps.LatLng(37.243224433521654,73.33579810898436);
    }

    /**
     * Attaches the transportation icon to the map
     * 
     * @this {BloggerMap}
     * 
     * @param {google.maps.LatLng} position The position where the transportation icon should be shown
     * @param {String} markerKey The marker key that indicate the type of transportation
     */
    var attachRouteWindow = function(position, markerKey){
        var infowindow = new google.maps.InfoWindow({
            content: markerKey,
            maxWidth: 300
        });
        var image = {
            url: markerIcons[markerKey],
            // This marker is 20 pixels wide by 32 pixels tall.
            size: new google.maps.Size(32, 38),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0,0),
            // The anchor for this image is the base of the flagpole at 0,32.
            anchor: new google.maps.Point(16, 24)
        };
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            icon: image
        });
    }

    /**
     * Attaches a clickListener the the marker witch opens a infowindow that shows a post
     * 
     * @this {BloggerMap}
     * 
     * @param {google.maps.Marker} marker The marker (the representation of a post) 
     * @param {String} postLink The link to the post
     * @param {String} postTitle The title of the post
     * @param {String} postContent The content of the post
     */
    var attachMessageToMarker = function(marker, postLink, postTitle, postContent) {
        google.maps.event.addListener(marker, 'click', function() {
            
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+postTitle+'</h1>'+
                '<div id="bodyContent">'+'<p>'+postContent+'</p>'+
                '<p><a href="'+postLink+'">Weitere Details</a></p>'+
                '</div>' + '</div>';
            
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 500
            });

            infowindow.open(marker.get('map'), marker);
        });
    }

    /**
     * Gets the location from a post
     * 
     * @this {BloggerMap}
     * 
     * @param {post-item} item The item that represents a post
     *  
     * @returns {google.maps.LatLng} the location of the post
     */
    var getLocationFromItem = function(item){
        var itemPoint = item.georss$point.$t;
        var res = itemPoint.split(" "); 
        /*var itemLat = item.location.lat;
        var itemLng = item.location.lng;*/

        var itemLat = res[0];
        var itemLng = res[1];

        var itemLocation = new google.maps.LatLng(itemLat,itemLng);
        return itemLocation;
    } 

    /**
     * Gets the transportType from the post labels
     * 
     * @this {BloggerMap}
     * 
     * @param {post-item} The item that represents a post
     * 
     * @returns {String} The routeOption which is configured in the label-tag of the post
     */
    var getRouteLabelForItem = function(item){
        var routeLabel = null;
        if(item.category != null){
            var length = item.category.length;
                
            var element = null;
            for (var j = 0; j < length; j++) {
                element = item.category[j].term;
                var containsindex = element.indexOf("routeoptions:");
                if(containsindex > -1){
                    var doubleDotIndex = element.indexOf(':');
                    routeLabel = element.substring(doubleDotIndex+1, element.length);
                }
            }
        }
        return routeLabel;
    }

    /**
     * Gets the Marker
     * 
     * @this {BloggerMap}
     * 
     * @param {String} itemTitle The title of a post
     * @param {google.maps.LatLng} itemLocation The location of a post
     * 
     * @returns {google.maps.Marker} The marker
     */
    var getMarkerForItem = function(itemTitle, itemLocation){
        var marker = new google.maps.Marker({
            position: itemLocation,
            map: this.map,
            title: itemTitle
        });
        return marker;     
    }

    /**
     * Calculates the coordinates for the marker which represents a post
     * 
     * @this {BloggerMap}
     * 
     * @param {array of post-items} items Array of all posts
     * 
     * @returns {Array of Object} Object = {"lat", "lng", "routeOption"} 
     */
    var calculateRouteCoordinatesAndAddMarkerToMap = function(items){
        var routeCoordinates = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            
            if(item.georss$point != null){

                var itemLocation = getLocationFromItem(item);
                var routeLabel = getRouteLabelForItem(item);
                routeCoordinates[i] = [itemLocation, routeLabel];
            
            var itemTitle = item.title.$t;
            var itemLink = item.link[4].href;
            
            var itemMarker = getMarkerForItem(itemTitle, itemLocation);

            if (items.content != undefined){
                attachMessageToMarker(itemMarker, itemLink, itemTitle, item.content.$t);
            } else if (item.summary != undefined){
                attachMessageToMarker(itemMarker, itemLink, itemTitle,item.summary.$t);
            } else {
                attachMessageToMarker(itemMarker, itemLink, itemTitle,"no content or summary");
            }
            
            }
        }
        return routeCoordinates;
    }
 
    /**
     * Attaches the Route by the calculate coordinates to the map and sets the center of the map the the last post or if no post exists to the default position
     * 
     * @this {BloggerMap}
     * 
     * @param {array of routeCoordinates} items Array of all coordinates
     */
    var attachRouteToMapAndSetCenterPosition = function(routeCoordinates){
        var lastCoordinate = null;
        for (var i = 0; i < routeCoordinates.length; i++) {
            var transportKey = routeCoordinates[i][1];
            
            if(lastCoordinate == undefined){
                lastCoordinate = routeCoordinates[i][0];
            }else{
                var currentCoordinate = routeCoordinates[i][0];
                var coordinateArray = [lastCoordinate,currentCoordinate];
                var coordinatePolyline = new google.maps.Polyline({
                    path: coordinateArray,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                });
                bounds = new google.maps.LatLngBounds();

                var startPoint = lastCoordinate;
                bounds.extend(startPoint);
                var endPoint = currentCoordinate;
                bounds.extend(endPoint);
                var geodesicCenterPoint = bounds.getCenter();  
            
                //coordinatePolyline.GetPointAtDistance(startPoint.distanceFrom(endPoint)/2);
                var normalPolyline = new google.maps.Polyline({
                    path: [startPoint, geodesicCenterPoint, endPoint],
                    strokeColor: colors[transportKey],
                    strokeOpacity: 0.5,
                    strokeWeight: 5,
                    map: this.map
                });
                if(geodesicCenterPoint!=null){
                    attachRouteWindow(geodesicCenterPoint, transportKey);
                }
                lastCoordinate = currentCoordinate;
            }
        }
        if(lastCoordinate!=null){
            this.map.setCenter(lastCoordinate);
        }else{               
            var centerPosition = defaultCenterPosition();
            this.map.setCenter(centerPosition);
        }
    }


    /**
     * Inits the object with its default configurations
     * 
     * @this {BloggerMap}
     * 
     * @param {google.maps.Map} googleMap maps object 
     */ 
   this.init = function(googleMap)   
    {
        map = googleMap;
        colors = getDefaultColors();
        markerIcons = getDefaultMarkerIcons();
    }

    /**
     * Initiates all marker and lines and adds them to the map
     * 
     * @this {BloggerMap}
     * 
     * @param {Array of posts} postArray Posts array of a blog 
     */ 
    this.initialize = function(postArray){
        //sort them all
        var items = postArray.reverse();
        
        var routeCoordinates = calculateRouteCoordinatesAndAddMarkerToMap(items);
        
        attachRouteToMapAndSetCenterPosition(routeCoordinates); 
    }

    /**
     * Set the color array.
     * 
     * @this {BloggerMap}
     * 
     * @param {Array of color-Settings} newColors Key/Value { { "transportationKey" : "html color code"} }
     */
    this.setColors = function(newColors){
        colors = newColors;
    }

    /**
     * Set the markerIcon array.
     * 
     * @this {BloggerMap}
     * 
     * @param {Array of markerIcons-Settings} newMarkerIcons Key/Value { { "transportationKey" : "link to image"} }
     */
    this.setMarkerIcons = function(newMarkerIcons){
        markerIcons = newMarkerIcons;
    }

    /**
     * Gets the color array.
     * 
     * @this {BloggerMap}
     * 
     * @returns {Array of markerIcons-Settings} Key/Value { { "transportationKey" : "link to image"} }
     */
    this.getColors = function()   
    {
        return colors;
    }
    
    /**
     * Set the markerIcon array.
     * 
     * @this {BloggerMap}
     * 
     * @returns {Array of markerIcons-Settings} Key/Value { { "transportationKey" : "link to image"} }
     */
    this.getMarkerIcons = function()   
    {
        return markerIcons ;
    }
}


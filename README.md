

# Betshops

"Betshops"  is a testing assignment to create one page application.
  
Please refer to the screenshots in folder "{platform}_screenshots".

## Behavior:

* Application shows client betshops on map (using a mapping library for the platform of your choice) -> bet shops are located in Romania
* User can move the map and zoom-in/zoom-out
* When clicking on the betshop icon, details are shown and user can see the relevant information about the betshop

## Tips:

* User makes the defined API call and draws markers on the map
* If user denies the location, center of the map is set to center of Bucharest *44.435105, 26.100019* 
* Working time
  * If betshop is OPEN at the moment, clock label should present *Open now until [END TIME]]
  * If betshop is CLOSED, clock label should present *Opens tomorrow at [START TIME]*
* Betshop detail data is presented in 3 rows:
  1. Name
  2. Address
  3. [City] - [County] 
* Selected betshop has different asset (large green pin)
* Fetch the weather from the https://openweathermap.org/forecast5 API
* The weather widget should contain dates for the upcoming 5 days with the corresponding min/max temperature, weather description, cloud percentage and air pressure
* "Today" should be displayed next to the current date and that widget row highlighted with a left blue border
* The min/max temperature tags should be colored based on the actual temperature ( < 14C - blue, 14-20C - green, 20-25C - orange, 25C+ - red

## Layout
* Map:
	* 400px width
	* 2px white border
* Right sidebar:
	* 315px width
	* white background
	* 22px top/bottom, 18px left/right padding
* 15px margins between map/sidebar and sidebar boxes 
* Colors:
	* dark grey: #6e6e6e
	* light grey: #ebebeb
	* odd weather widget row background: #f7f7f7
	* blue: #3e5b9d
	* red: #e82e00
	* orange: #e78f09
	* green: #8bba0a
* Fonts - whatever tickles your fancy :)
* Make the overall layout responsive on viewports below 780px (map shown first)

## Rest API:

**Host**:

* https://sa-proxy.azurewebsites.net/

**Resource**:

* GET /list?boundingBox={0}

**Query parameters**:

 * boundingBox (required, string, `44.581149,26.304202,44.299059,25.553844`) ... bounding box in CSV format "top-right latitude (lat1), top-right longitude (lon1), bottom-left latitude (lat2), bottom-left longitude (lon2)"
    
 **Response** : (HTTP 200)

       [{
		"Id": 2362,
		"Name": "B1 BANEASA",
		"Location": {
			"Lat": 44.493698,
			"Lng": 26.084641
		},
		"Address": "Str. Aerogarii, nr. 14, bl. 2/7, sc. A, ap. 1",
		"CityId": 716,
		"City": "Sector 1",
		"County": "Bucuresti",
		"WorkingHourStart": "12:00",
		"WorkingHourEnd": "20:00",
        "Phone": "(033)216-0058 x0344"
	}, {
		"Id": 2363,
		"Name": "B1 CHIBRIT",
		"Location": {
			"Lat": 44.469661,
			"Lng": 26.050632
		},
		"Address": "Calea Grivitei, nr. 395",
		"CityId": 716,
		"City": "Sector 1",
		"County": "Bucuresti",
		"WorkingHourStart": "12:00",
		"WorkingHourEnd": "20:00",
        "Phone": "(033)216-0058 x0344"
	}]


Example CURL request and response is provided in "curl.log".
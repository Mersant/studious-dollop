
/* -------------------------- Meal Planning Manager --------------------------- */
console.log($("#mealDateSelector").val())
$("#mealDateSelector").change(function() {
    var selectedDate = $("#mealDateSelector").val();
    if(localStorage.getItem(selectedDate)) {
        $("#mealItems").val(localStorage.getItem(selectedDate));
        updateNutrition(localStorage.getItem(selectedDate));
    } else {
        $("#nutritionInfo").html("No items found. Add some above!");
    }
});

$("#saveMealPlan").click( function() {
    var selectedDate = $("#mealDateSelector").val();
    if(selectedDate) {
        // Meals are stored in local storage as a date with an associated meal
        var mealItems = $("#mealItems").val();
        localStorage.setItem(selectedDate, mealItems);
        $("#saveMealPlan").html("Saved!");
        updateNutrition(mealItems)
    } else {
        $("#saveMealPlan").html("Select a date first");
    }
});

$("#clearAllMealPlans").click( function() {
    localStorage.clear();
    $("#nutritionInfo").html("No items found. Add some above!");
});
// updateNutrition accepts a string of ingredients in plain english, i.e. "A can of beans an 16 ounces of coffee" or "coffee and a croissant" and nutritional information via the edamam API such as Calories, fat, alcohol, etc. Example call: updateNutrition("Pasta and sauce");
function updateNutrition(ingredients) {
    $.ajax({
        type: "GET",
        url: "https://api.edamam.com/api/food-database/v2/parser?app_id=08017788&app_key=19280c7005f2a1136addc35fbe298419&ingr=" + ingredients + "&nutrition-type=cooking",
        dataType: "json",
        success: function (result, status, xhr) {
            $("#nutritionInfo").html("");
            // Loop through each ingredient found within the "ingredients" parameter.
            for(var i=0; i<result["parsed"].length; i++) {
                console.log(i)
                // New UL to contain all the nutrition info for this individual ingredient
                $("#nutritionInfo").append("<ul class=nutritionInfoCard id=\"infoCard"+i+"\"></ul>");
                // Now add all the nutrition info
                $("#infoCard"+i).append("<li>Name: " + result["parsed"][i]["food"]["label"]);
                $("#infoCard"+i).append("<li>Calories: " + result["parsed"][i]["food"]["nutrients"]["ENERC_KCAL"]);
                $("#infoCard"+i).append("<li>Protein: " + result["parsed"][i]["food"]["nutrients"]["PROCNT"]+"g");
                $("#infoCard"+i).append("<li>Fat: " + result["parsed"][i]["food"]["nutrients"]["FAT"]+"g");
                $("#infoCard"+i).append("<li>Carbohydrates: " + result["parsed"][i]["food"]["nutrients"]["CHOCDF"]+"g");
                $("#infoCard"+i).append("<li>Fiber: " + result["parsed"][i]["food"]["nutrients"]["FIBTG"]);
            }
            
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
    })
}

//---------------------------------------Weather------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Gets the clients location info
function getLocationInfo(lat, lon){
    var requestUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=02024b9f7001696a944662ca0b291629`
    fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            cityName = data[0].name;
            getWeather(cityName)
        })
}
//Api used to show location
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
  }
  //Api used to get the lat and long of the client
function showPosition(position) {
    var lat = position.coords.latitude 
    console.log(lat)
    var lon = position.coords.longitude
    console.log(lon)
    getLocationInfo(lat, lon)
  }

  console.log(getLocation())

//Gets the weather data of the city passed in by the function
function getWeather(city){

    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&exclude=hourly,daily&appid=02024b9f7001696a944662ca0b291629&units=imperial&cnt=1`


        fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            var temp = `${data.list[0].main.temp}°F`
            var cityTemp = `Temprature ${data.list[0].main.temp}°F`;
            var feelsLike = `Feels like ${data.list[0].main.feels_like}°F`;
            var tempMin = `Low ${data.list[0].main.temp_min}°F`;
            var tempMax = `High ${data.list[0].main.temp_max}°F`;
            var humidity = `Humidity ${data.list[0].main.humidity}%`;
            var cityName = `City ${data.city.name}`;
            var countryName = `Country ${data.city.country}`;
            var population = `Population ${data.city.population}`
            var weather = `Weather ${data.list[0].weather[0].main}`;
            var weatherData = [cityName, countryName, population, weather, cityTemp, tempMin, tempMax, humidity, feelsLike]

            $("#weather").html("");
            var grand = document.querySelector("#grand")
            grand.innerHTML = temp
            var cityNameDiv = document.querySelector("#cityName");
            cityNameDiv.innerHTML = cityName;
            var countryNameDiv = document.querySelector("#countryName")
            countryNameDiv.innerHTML = countryName;
            var cityTempDiv = document.querySelector("#cityTemp");
            var cityTempDivSpan = document.querySelector(".ms-1");
            cityTempDivSpan.innerHTML = cityTemp
            var feelsLikeDiv = document.querySelector("#feelsLike");
            var feelsLikeDivSpan = feelsLikeDiv.querySelector(".ms-1");
            feelsLikeDivSpan.innerHTML = feelsLike;
            var tempMinDiv = document.querySelector("#tempMin");
            var tempMinDivSpan = tempMinDiv.querySelector(".ms-1")
            tempMinDivSpan.innerHTML = tempMin
            var tempMaxDiv = document.querySelector("#tempMax")
            var tempMaxDivSpan = tempMaxDiv.querySelector(".ms-1");
            tempMaxDivSpan.innerHTML = tempMax;
            var humidityDiv = document.querySelector("#humidity");
            var humidityDivSpan = humidityDiv.querySelector(".ms-1");
            humidityDivSpan.innerHTML = humidity

            
        });
}

//----------------------------------------------ToDoList----------------------------------------------------------------------------

getLocationInfo()



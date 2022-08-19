/* --------------------------- Page Manager ----------------------------------- */
$("#mealPlanner").css("display", "none");
$("#generalTodo").css("display", "none");
$("#makeTodoListButton").click(function() {
    $("#mealPlanner").css("display", "none");
    $("#generalTodo").css("display", "block");
});
$("#planMealButton").click(function() {
    $("#mealPlanner").css("display", "block");
    $("#generalTodo").css("display", "none");
});


/* -------------------------- Meal Planning Manager --------------------------- */
// Every time a date is selected on the calender, update the nutritional information for any food that was saved for that date.
$("#mealDateSelector").change(function() {
    var selectedDate = $("#mealDateSelector").val();
    updateNutrition(selectedDate);
});

// Executed whenever the user clicks the "Save" button
$("#saveMealPlan").click( function() {
    var selectedDate = $("#mealDateSelector").val();
    if(selectedDate) {
        // Meals are stored in local storage as a title and date with an associated meal, 
        // e.g. dinner-2022/08/18 with a value of "Bagel and coffee"
        var mealItems = $("#mealItems").val();
        var currentMeal = $("input[name='currentMeal']:checked").val();
        var saveName = `${currentMeal}-${selectedDate}`;
        localStorage.setItem(saveName, mealItems);
        updateNutrition( selectedDate );
        $("#saveMealPlan").html("Saved!");
        $("#mealItems").val("");
        setTimeout(updateSaveMealButton, 1500);
    } else {
        $("#saveMealPlan").html("Select a date first");
        setTimeout(updateSaveMealButton, 2000);
    }
});
function updateSaveMealButton() {
    $("#saveMealPlan").html("Save this meal")
}

// Clears local storage if the user clicks on the clear meal plans button twice within 1 second.
var clearAllClicked = false;
var timeOut;
$("#clearAllMealPlans").click( function() {
    if(!clearAllClicked) {
        $("#clearAllMealPlans").html("Click me again if you're sure");
        clearAllClicked = true;
        timeOut = setTimeout(updateClearButton, 1000); // Interruptable timeout
    }
    else {
        localStorage.clear()
        $("#clearAllMealPlans").html("Cleared!");
        // Clearing the timout prevents the "Cleared!" message from being cleared almost immediately by the updateClearButton() function
        clearTimeout(timeOut);
        setTimeout(updateClearButton, 1000);

        var date = $("#mealDateSelector").val()
        updateNutrition( date )
    }
});
// Make it so the user will have to double click to clear the meal plans. If they don't double click, the button text will reset to its default.
function updateClearButton() {
    clearAllClicked = false;
    $("#clearAllMealPlans").html("Clear all meal plans");
}

// updateNutrition adds the nutritional information of all the food stored in localStorage for a selected day and adds it to the main html page.
function updateNutrition( selectedDate ) {
    $("#breakfastNutrition").html("<h2>Breakfast:</h2>");
    if( localStorage.getItem( `breakfast-${selectedDate}` ) ) {
        fetchAndDisplayNutrition( localStorage.getItem(`breakfast-${selectedDate}`), "#breakfastNutrition" )
    }
    $("#lunchNutrition").html("<h2>Lunch:</h2>");
    if( localStorage.getItem( `lunch-${selectedDate}` ) ) {
        fetchAndDisplayNutrition( localStorage.getItem(`lunch-${selectedDate}`), "#lunchNutrition" )
    }
    $("#dinnerNutrition").html("<h2>Dinner:</h2>");
    if( localStorage.getItem( `dinner-${selectedDate}` ) ) {
        fetchAndDisplayNutrition( localStorage.getItem(`dinner-${selectedDate}`), "#dinnerNutrition" )
    }
}

// fetchAndDisplayNutrition accepts a string of ingredients in plain english, i.e. "A can of beans an 16 ounces of coffee" or "coffee and a croissant" and nutritional information via the edamam API such as Calories, fat, etc. It then appends the nutritional information to the element referenced by appendID Example call: fetchAndDisplayNutrition("Pasta and sauce", "#foodIngredientsListContainer");
function fetchAndDisplayNutrition(ingredients, appendID) {
    $.ajax({
        type: "GET",
        url: `https://api.edamam.com/api/food-database/v2/parser?app_id=08017788&app_key=19280c7005f2a1136addc35fbe298419&ingr=${ingredients}&nutrition-type=cooking`,
        dataType: "json",
        success: function (result, status, xhr) {
            // New UL to contain all the nutrition info for this individual ingredient
            var html = "<ul class='nutritionInfoCard'>"
            // Loop through each ingredient found within the "ingredients" parameter.
            for(var i=0; i<result["parsed"].length; i++) {
                // Now add all the nutritional info
                html += `<li id="foodName">Name: ${result["parsed"][i]["food"]["label"]}</li>`;
                html += `<li>Calories: ${result["parsed"][i]["food"]["nutrients"]["ENERC_KCAL"]}</li>`;
                html += `<li>Protein: ${result["parsed"][i]["food"]["nutrients"]["PROCNT"]}g</li>`;
                html += `<li>Fat: ${result["parsed"][i]["food"]["nutrients"]["FAT"]}g</li>`;
                html += `<li>Carbohydrates: ${result["parsed"][i]["food"]["nutrients"]["CHOCDF"]}g</li>`;
                html += `<li>Fiber: ${result["parsed"][i]["food"]["nutrients"]["FIBTG"]}</li>`;
            }
            html += "</ul>";
            $(appendID).append(html)
            
        },
        error: function (xhr, status, error) {
            alert(`Result: ${status} ${error} ${xhr.status} ${xhr.statusText}`);
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
            console.log(data)
            var temp = `${data.list[0].main.temp}°F`
            var cityTemp = `Temprature ${data.list[0].main.temp}°F`;
            var feelsLike = `Feels like ${data.list[0].main.feels_like}°F`;
            var tempMin = `Low ${data.list[0].main.temp_min}°F`;
            var tempMax = `High ${data.list[0].main.temp_max}°F`;
            var humidity = `Humidity ${data.list[0].main.humidity}%`;
            var cityName = `City ${data.city.name}`;
            var countryName = `Country ${data.city.country}`;
            var population = `Population ${data.city.population}`
            var weather = `${data.list[0].weather[0].main}`;
            var weatherConditions = ["clear sky", "few clouds", "scattered clouds", "broken clouds", "shower rain", "rain", "thunderstorm", "snow", "mist"]
            var weatherConditionsCode = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d"]
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
            
            var weatherDescription = `${data.list[0].weather[0].description}`
            for(let i = 0; i < weatherConditions.length; i++){
                if(weatherConditions[i] === weatherDescription){
                    var weatherIcon = document.querySelector("#wIcon")
                    console.log(weatherConditionsCode[i])
                    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherConditionsCode[i]}@2x.png`
                }
            }
        });
}

function icons(){
    let time = new Date().toLocaleString();
    return time.slice(-2)
}

//-----------------------------------------ToDoList-------------------------------------------------------------
var taskInput = document.querySelector("#task");
var addItemButton = document.querySelector("#addItemButton");
var taskList = document.querySelector("#toDoList")
var clearList = document.querySelector("#clearList")
var iterator = 0
//Function for adding tasks to the list 
function addTask() {
    // Parse the JSON stored in allTasks
    var existingTasks = JSON.parse(localStorage.getItem("allTasks"));
    if(existingTasks == null) existingTasks = [];
    //JSON object for task
    var task = {
        taskInput : taskInput.value
    };
    localStorage.setItem("task", JSON.stringify(task));
    // Save allEntries back to local storage
    existingTasks.push(task);
    localStorage.setItem("allTasks", JSON.stringify(existingTasks));
    //Loop through the items and append the task inserted
    for(const task in existingTasks){
        var taskItem = document.createElement('li')
        console.log(existingTasks[task].taskInput)
        taskList.append(existingTasks[iterator].taskInput, taskItem)
        iterator++;
    }

    
};
//On click of the submit button this function calls the addTask function to execute its role
addItemButton.addEventListener("click", function() {
    addTask();
    // Lis
    var list = localStorage.getItem("allTasks")

    // Last entry inserted

}, false);


//Clears the list by clearing local storage
clearList.addEventListener("click", function(){
    localStorage.clear()
    window.location.reload();
})



//---------------------------------------------------------------------------------------------------------------

getLocationInfo()

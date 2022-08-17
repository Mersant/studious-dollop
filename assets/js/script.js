
/* -------------------------- Meal Planning Manager --------------------------- */
// Every time a date is selected on the calender, check if there are any existing saved meals. If so, update the page so the nutritional breakdowns of said meals are displayed.
$("#mealDateSelector").change(function() {
    var selectedDate = $("#mealDateSelector").val();
    updateNutrition(selectedDate);
});

// Executed whenever the user clicks the "Save" button
$("#saveMealPlan").click( function() {
    var selectedDate = $("#mealDateSelector").val();
    if(selectedDate) {
        // Meals are stored in local storage as a title and date with an associated meal, 
        // e.g. dinner-2022/08/18
        var mealItems = $("#mealItems").val();
        var currentMeal = $("input[name='currentMeal']:checked").val();
        var saveName = currentMeal + "-" + selectedDate;
        localStorage.setItem(saveName, mealItems);
        updateNutrition( selectedDate );
        $("#saveMealPlan").html("Saved!");
    } else {
        $("#saveMealPlan").html("Select a date first");
    }
});

$("#clearAllMealPlans").click( function() {
    localStorage.clear();
    $("#nutritionInfo").html("No items found. Add some above!");
});

function updateNutrition( selectedDate ) {
    $("#breakfastNutrition").html("<h2>Breakfast:</h2>");
    if( localStorage.getItem( "breakfast-"+selectedDate ) ) {
        fetchAndDisplayNutrition( localStorage.getItem("breakfast-"+selectedDate), "#breakfastNutrition" )
    }
    $("#lunchNutrition").html("<h2>Lunch:</h2>");
    if( localStorage.getItem( "lunch-"+selectedDate ) ) {
        fetchAndDisplayNutrition( localStorage.getItem("lunch-"+selectedDate), "#lunchNutrition" )
    }
    $("#dinnerNutrition").html("<h2>Dinner:</h2>");
    if( localStorage.getItem( "dinner-"+selectedDate ) ) {
        fetchAndDisplayNutrition( localStorage.getItem("dinner-"+selectedDate), "#dinnerNutrition" )
    }
}

// updateNutrition accepts a string of ingredients in plain english, i.e. "A can of beans an 16 ounces of coffee" or "coffee and a croissant" and nutritional information via the edamam API such as Calories, fat, alcohol, etc. Example call: updateNutrition("Pasta and sauce");
function fetchAndDisplayNutrition(ingredients, appendID) {
    $.ajax({
        type: "GET",
        url: "https://api.edamam.com/api/food-database/v2/parser?app_id=08017788&app_key=19280c7005f2a1136addc35fbe298419&ingr=" + ingredients + "&nutrition-type=cooking",
        dataType: "json",
        success: function (result, status, xhr) {
            // Loop through each ingredient found within the "ingredients" parameter.
            var html = "<ul class='nutritionInfoCard'>"
            for(var i=0; i<result["parsed"].length; i++) {
                // New UL to contain all the nutrition info for this individual ingredient
                // Now add all the nutrition info
                html += "<li>Name: " + result["parsed"][i]["food"]["label"];
                html += "<li>Calories: " + result["parsed"][i]["food"]["nutrients"]["ENERC_KCAL"];
                html += "<li>Protein: " + result["parsed"][i]["food"]["nutrients"]["PROCNT"]+"g";
                html += "<li>Fat: " + result["parsed"][i]["food"]["nutrients"]["FAT"]+"g";
                html += "<li>Carbohydrates: " + result["parsed"][i]["food"]["nutrients"]["CHOCDF"]+"g";
                html += "<li>Fiber: " + result["parsed"][i]["food"]["nutrients"]["FIBTG"];
            }
            html += "</ul>";
            $(appendID).append(html)
            
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
    })
}


$("#createTodo-btn").on('click', function() { 
    console.log("clicked")
$("#createTodoOptions").css('display', 'block')})
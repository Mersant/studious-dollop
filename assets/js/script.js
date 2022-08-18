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
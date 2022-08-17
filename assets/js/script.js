
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


$("#createTodo-btn").on('click', function() { 
    console.log("clicked")
$("#createTodoOptions").css('display', 'block')})
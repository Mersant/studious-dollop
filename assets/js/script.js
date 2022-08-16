
/* -------------------------- Meal Planning Manager --------------------------- */
// mealSaveData is the string containing a date and what the user p, ex "Apple and a pear"
$("#mealDateSelector").change(function() {
    var selectedDate = $("#mealDateSelector").val()
    if(localStorage.selectedDate) {
        $("#mealItems").val(localStorage.selectedDate);
    } else {
        $("#mealItems").val("Nothing yet. . .")
    }
});

// searchIngredients accepts a string of ingredients in plain english, i.e. "A can of beans an 16 ounces of coffee" or "coffee and a croissant" and nutritional information via the edamam API such as Calories, fat, alcohol, etc. Example call: searchIngredients("Pasta and sauce");
function searchIngredients(ingredients) {
    $.ajax({
        type: "GET",
        url: "https://api.edamam.com/api/food-database/v2/parser?app_id=08017788&app_key=19280c7005f2a1136addc35fbe298419&ingr=" + ingredients + "&nutrition-type=cooking",
        dataType: "json",
        success: function (result, status, xhr) {
            // Loop through each ingredient found within the "ingredients" parameter.
            for(var i=0; i<=result["parsed"].length; i++) {
                /* -- Copy nutrition data to HTML page */
            }
            
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        }
    })
}


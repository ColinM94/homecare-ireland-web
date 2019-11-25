// Takes a component name and loads it into root-component in index.html.
function router(route){
    console.log("Routing to components/" + route)

    $('root-component').load("components/" + route)
}

// This will loop infinitely if all <component> tags don't have unique ids. 
function loadComponents(){
    $("component").each(function() {
        if (isEmpty($(this))) {
            // Component which needs to be loaded. 
            var component = $(this).attr("class")

            // Where to put the component. 
            var location = $(this).attr("id")

            loadComponent(component, location)
        }        
    })
}

function loadComponent(component, location){
    $("#"+location).load("components/" + component)

    console.log("Loading components/" + component + "into " + location + " div")
}

function isEmpty( el ){
    return !$.trim(el.html())
}
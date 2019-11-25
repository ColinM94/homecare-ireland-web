// Takes a component name and loads it into #main-component.
function router(route){
    console.log("Routing to components/" + route + ".html")

    $('root-component').load("components/" + route + ".html")
}

// Components need to have unique ids or it loops infinitely. JUST DONT TOUCH IT!
function loadComponents(){
    $("component").each(function() {
        if (isEmpty($(this))) {
            // Which component needs to be loaded. 
            var component = $(this).attr("class")

            // Where to put component. 
            var location = $(this).attr("id")

            //console.log(component + " " + location)
            loadComponent(component, location)
        }
    })
}

function loadComponent(component, location){
    //$('#'+id).append("dfasdfasdfasdf")
    //$('#'+id).load("components/" + id + ".html")

    $("#"+location).load("components/" + component + ".html")
    console.log("Loading components/" + component + ".html into " + location + " div")
}

function isEmpty( el ){
    return !$.trim(el.html())
}
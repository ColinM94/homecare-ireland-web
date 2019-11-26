// Takes a component name and loads it into root-component in index.html.
function router(route){
    //console.log("Routing to components/" + route)

    // Loads components into <root-component> in index.html 
    $('root-component').load("components/" + route)
}
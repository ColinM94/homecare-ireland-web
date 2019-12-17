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



/*
function loadComponent(component, location, force){
    //console.log("Loading component: components/" + component + "into " + location + " div")

    // Gets the location of the element and inserts the component into it. 
    if($("#"+location).text() == ''){
        $("#"+location).load("components/" + component)
    }else if(force){
        $("#"+location).load("components/" + component)
    }


    //console.log(`Loading js: <script src="components/${component}/${component}.js"></script>`)
    
    // Loads the components js file. 
    //$("#"+location).append(`<script src="components/${component}/${component}.js"></script>`)
    //console.log(`<script src="components/${component}/${component}.js"></script>`)
    //$("#"+location).append('<script src="components/topbar/topbar.js"></script>')
    //$.getScript("components/topbar/topbar.js")
  
}
*/

function isEmpty( el ){
    return !$.trim(el.html())
}

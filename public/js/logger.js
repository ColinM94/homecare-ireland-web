// Custom logger. 

// Default colour
var color = "#0000ff"

function log(msg, type){
    var prepend = ""
    switch(type){
        case "error":   
            color = "#e1414c" 
            prepend = "Error: "
            break;
        case "success":
            color = "green" 
            break;  
        default: 
            color = "lightgrey";
            break;
    }

    console.log('%c' + prepend + msg , 'color: ' + color + ";")
}

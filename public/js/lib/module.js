// // Manages modules loading and unloading. 
// class Module{
//     // Loads new module. 
//     static async load(moduleName, arg){
//         // startLoad()

//         // // Makes first letter of module capital to match module class names. 
//         // moduleName = moduleName[0].toUpperCase() + moduleName.slice(1);

//         const moduleRefs = {
//             // "users": Users,
//             // "clients" : Clients,
//             // "medications" : Medications,
//             "ClientProfile" : ClientProfile,
//             // "UserProfile" : UserProfile,
//             // "VisitDetails" : VisitDetails,
//         }

//         var module = moduleRefs[moduleName]

//         $(`#${moduleName}-module`).append(`<div id="${moduleName}"></div>`)
//         $(`#${moduleName}`).load(`modules/${moduleName}.html`)

//         module.load(arg)

//         // })
//         // var module = moduleRefs[moduleName]

//         // $("main").append(`<div id="${moduleName}" class="module container-fluid"></div>`)

//         // // if($(".tabs").find(`#tab-${moduleName}`).length == 0){
//         // //     $(".tabs").append(`<button class="tablinks" id="tab-${moduleName}" onclick="Module.show('${moduleName}')">${moduleName}<i class="fas fa-times fa-lg"></i></button>`)          
//         // // }
//         // console.log(moduleName)
//         // $(`#${moduleName}`).load("modules/"+moduleName+".html")

//         // module.load(arg).then(()=>{
//         //     // this.listeners()
//         //     endLoad()
//         // })
//     }

//     // static show(moduleName){
//     //     // console.log(moduleName)
//     //     moduleName = moduleName[0].toLowerCase() + moduleName.slice(1)

//     //     $(".module").hide()
//     //     console.log(`#${moduleName}`)
//     //     $(`#${moduleName}`).show()
//     // }
// }
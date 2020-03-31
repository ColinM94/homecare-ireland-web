class SettingsView{
    static load(){
        this.div = "#settings-view"

        $(this.div).text("")
        $(this.div).load("views/settings.html")
    }
}
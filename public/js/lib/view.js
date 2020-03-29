class View{
    static setTitle(div, title){
        $(`${div} .page-header-text`).text(title)
    }

    static setIcon(div, icon){
        $(`${div} .page-header-icon i`).addClass(icon)
    }

    static setSubTitle(div, subtitle){
        $(`${div} .page-header-subtitle`).text(subtitle)
    }
}
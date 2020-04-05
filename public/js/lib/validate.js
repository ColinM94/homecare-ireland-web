class Validate{
    // Src: https://www.autoaddress.ie/support/developer-centre/faqs/do-you-have-a-regex-for-eircode
    static eircode(eircode) {
            var pattern = 
                    '\\b(?:(' +
                    'a(4[125s]|6[37]|7[5s]|[8b][1-6s]|9[12468b])|' +
                    'c1[5s]|' +
                    'd([0o][1-9sb]|1[0-8osb]|2[024o]|6w)|' +
                    'e(2[15s]|3[24]|4[15s]|[5s]3|91)|' +
                    'f(12|2[368b]|3[15s]|4[25s]|[5s][26]|9[1-4])|' +
                    'h(1[2468b]|23|[5s][34]|6[25s]|[79]1)|' +
                    'k(3[246]|4[5s]|[5s]6|67|7[8b])|' +
                    'n(3[79]|[49]1)|' +
                    'p(1[247]|2[45s]|3[126]|4[37]|[5s][16]|6[17]|7[25s]|[8b][15s])|' +
                    'r(14|21|3[25s]|4[25s]|[5s][16]|9[35s])|' +
                    't(12|23|34|4[5s]|[5s]6)|' +
                    'v(1[45s]|23|3[15s]|42|9[2-5s])|' +
                    'w(12|23|34|91)|' +
                    'x(3[5s]|42|91)|' +
                    'y(14|2[15s]|3[45s])' +
                    ')\\s?[abcdefhknoprtsvwxy\\d]{4})\\b';
            
            var reg = new RegExp(pattern, 'i');
            //return the first Eircode
            var i = String(eircode).search(reg);
            if (i!=-1){
                return true
              //return(String(eircode).substring(i,i+8).toUpperCase().replace(' ', '').replace(/O/g, 0).replace(/S/g, 5).replace(/B/g, 8));
            }else{
                return false
            }                             
    }

    static mobile(mobile){
        if(!$.isNumeric(mobile)) return false
        else if(mobile.length > 10 || mobile.length < 10) return false
        else return true
    }

    static email(email) 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true
        return false    
    }
}
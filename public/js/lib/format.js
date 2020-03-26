class Format{
    static address(address1, address2, town, county, eircode){
        
        let address = address1
        
        if(address2 != "")
            address = address + ", " + address2

        address = address + ", " + town + ", " + county + ", " + eircode

        return address
    }
}
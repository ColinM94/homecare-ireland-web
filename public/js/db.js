function setupUI (user) {
    if (user){
        // Account info 
        db.collection('users').doc(user.uid).get().then(doc =>{
            const userInfo = doc.data()
            document.getElementById("name").innerHTML = userInfo.name
        })
    }
}
function getUserInfo(uid){
    db.collection('users').doc(user.uid).get().then(doc =>{
        var userInfo = new userInfo(doc.data())
    })
}

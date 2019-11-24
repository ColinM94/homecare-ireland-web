auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User is signed in")
  } else {
    document.location.href = newUrl;
  }
}

// Sign in.
const signinForm = document.querySelector('#signin-form')
signinForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signinForm['signin-email'].value
    const password = signinForm['signin-password'].value

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        document.location.href = "index.html";
    }).catch(error => {
        console.log(error.message)
    })
})

// Sign out. 
const signout = document.querySelector('#signout')
signout.addEventListener('click', (e) => {
    e.preventDefault()
    auth.signOut()
})
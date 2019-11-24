//var currentUser = null
//var name = document.querySelectorAll('#name')

// Listen for auth state change.
auth.onAuthStateChanged(user => {
    if(user){
        currentUser = user
        setupUI(user)
    } else{
        
    }   
})


// Sign in.
const signinForm = document.querySelector('#form-signin') 
signinForm && signinForm.addEventListener('submit', (e) => {
    // Prevents page from reloading on submit.
    e.preventDefault() 
   
    const email = signinForm['signin-email'].value
    const password = signinForm['signin-password'].value

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        window.location.href = "index.html"   
    }).catch(error => {
        console.log(error.message)
        signinForm.querySelector('#signin-error').innerHTML = error.message
    })
})

// Sign up.
const signupForm = document.querySelector('#form-signup')
signupForm && signupForm.addEventListener('submit', (e) => {
    e.preventDefault()     
  
    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    // Sign up user.
    auth.createUserWithEmailAndPassword(email, password).then(data => { 
        db.collection('users').doc(data.user.uid).set({
            name: signupForm['signup-name'].value
        }).then(() => {
            window.location.href = "index.html"  
        })
    }).catch(error => {
            console.log(error.message)
            signupForm.querySelector('#signup-error').innerHTML = error.message
        })
})

// Sign out. 
const signOut = document.querySelector('#sign-out')
signOut && signOut.addEventListener('click', (e) => {
    auth.signOut()
    window.location.href = "signin.html"

})

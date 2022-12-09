// login starts here
// Login Function
var loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  loginFormHandle();
});

function loginFormHandle() {
  // Get the use entered values
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  console.log(firebase);

  //// Call this type of function to do stuff with firebase
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((s) => {
      //Firestore Initalisation

      // Required for side-effects

      var idRef = db
        .collection("users")
        .get()
        .then((s) => {
          console.log(s);
        });
      return s;
    })
    .then(function (user) {
      console.log(user.user.uid);
      user.user.getIdToken().then((t) => {
        console.log(t);
      });
      console.log(webFlowAuth.loginRedirectPath);
      //send user to the url
      window.location.href = webFlowAuth.loginRedirectPath;
    })
    .catch(function (error) {
      console.log(error);
      loginErrors.forEach(function (el) {
        el.innerText = error.message;
        el.style.display = "block";
      });
    });
}
// login ends here

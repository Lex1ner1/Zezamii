//Sign up and Error/Success Message Functions

var signupButton = document.getElementById("signupButton");
signupButton.addEventListener("click", signup);

async function signup(event) {
  event.preventDefault();
  event.stopPropagation();
  var displayName = signupName.value;
  var email = signupEmail.value;
  var phone = signupPhone.value;
  var password = signupPassword.value;

  const errorManager = {
    createUserError: "",
    signinUserError: "",
    firestoreUserError: "",
  };
  console.log(errorManager);

  // Create a user under Authentication.
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      errorManager.createUserError = error;
    });

  // If no error then create the user under firestore.
  if (errorManager.createUserError === "") {
    // Login the newly created user.
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (u) => u.user)
      .catch((e) => e);

    // set the user in firestore
    if (user.uid) {
      const obj = {
        displayName: displayName,
        phone: phone,
        userID: user.uid,
      };

      db.collection("users")
        .doc(user.uid)
        .set(obj)
        .then(function (e) {
          console.log(user.uid);
          console.log(WebFlowAuth.signupRedirectPath);
        })
        .catch((e) => {
          errorManager.firestoreUserError = e;
        });
    } else {
      errorManager.signinUserError = user;
    }
  } else {
    console.log("Create user Error", errorManager);
  }

  console.log("Error manager", errorManager);

  var Webflow = Webflow || [];
  Webflow.push(function () {
    // unbind webflow form handling (keep this if you only want to affect specific forms)
    $(document).off("submit");

    /* Any form on the page */
    $("form").submit(function (e) {
      e.preventDefault();

      const $form = $(this); // The submitted form
      const $submit = $("[type=submit]", $form); // Submit button of form
      const buttonText = $submit.val(); // Original button text
      const buttonWaitingText = $submit.attr("data-wait"); // Waiting button text value
      const formMethod = $form.attr("method"); // Form method (where it submits to)
      const formAction = $form.attr("action"); // Form action (GET/POST)
      const formRedirect = $form.attr("data-redirect"); // Form redirect location
      const formData = $form.serialize(); // Form data

      // Set waiting text
      if (buttonWaitingText) {
        $submit.val(buttonWaitingText);
      }

      $.ajax(formAction, {
        data: formData,
        method: formMethod,
      })
        .done((res) => {
          // If form redirect setting set, then use this and prevent any other actions
          if (formRedirect) {
            window.location = formRedirect;
            return;
          }

          $form
            .hide() // optional hiding of form
            .siblings(".w-form-done")
            .show() // Show success
            .siblings(".w-form-fail")
            .hide(); // Hide failure
        })
        .fail((res) => {
          $form
            .siblings(".w-form-done")
            .hide() // Hide success
            .siblings(".w-form-fail")
            .show(); // show failure
        })
        .always(() => {
          // Reset text
          $submit.val(buttonText);
        });
    });
  });
}

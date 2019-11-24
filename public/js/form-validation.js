// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('input', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

// Called when signin modal is closed.
$(function () {
  $(document).on("hidden.bs.modal", "#modal-signin", function () {
    resetForm("form-signin")
  });
});

// Called when signup modal is closed.  
$(function () {
  $(document).on("hidden.bs.modal", "#modal-signup", function () {
      resetForm("form-signup")
  });
});

// Removes validation and empties fields.
function resetForm(form){
  var form = document.getElementById(form)
  form.reset()
  form.classList.remove('was-validated')
}
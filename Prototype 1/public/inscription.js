$('form').submit(function(event) {
    event.preventDefault(); // Prevent the default form submission
    $('.error-message').text(''); // Clear existing error messages

    $.ajax({
      url: '/inscription/submit',
      type: 'POST',
      data: $(this).serialize(),
      success: function(data) {
        window.location.href = "/Connexion"; // Redirect on success
      },
      error: function(response) {
        const errors = response.responseJSON;
        if(errors.error) {
          // Assuming you want to display the error under the first input as a general approach
          $('#inputFormNom').siblings('.error-message').text(errors.error);
        }
      }
    });
  });
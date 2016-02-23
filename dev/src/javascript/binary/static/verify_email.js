if(document.getElementById('btn-verify-email')) {

    $('#verify-email-form').submit( function(evt){
      evt.preventDefault();
      var email = document.getElementById('email').value;
      var error = document.getElementById('signup_error');
      Content.populate();

      if(!Validate.errorMessageEmail(email, error)) {
        error.textContent = "";
        error.styledisplay = 'none';

        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);

                if (response) {
                    var type = response.msg_type;
                    var wsError = response.error;
                    if (type === 'verify_email' && !wsError){
                      error.textContent = Content.localize().textEmailSent;
                      $('#email').hide();
                      $('#btn-verify-email').hide();
                    } else if (wsError && wsError.message) {
                      error.textContent = wsError.message;
                    }
                    error.style.display = 'inline-block';
                }
            }
        });
        BinarySocket.send({verify_email: email, type: 'account_opening'});
      }
    });
}

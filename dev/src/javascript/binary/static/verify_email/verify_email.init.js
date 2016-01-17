var VerifyEmailWS = (function(){
    "use strict";

    function emailHandler(msg) {
      msg.textContent = Content.localize().textEmailSent;
      msg.style.display = 'inline-block';
    }

    function initPage(email){
        VerifyEmailData.getEmail(email);
    }

    return {
      emailHandler: emailHandler,
        init: initPage
    };
}());

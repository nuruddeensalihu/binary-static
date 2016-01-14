var VerifyEmailData = (function(){
    "use strict";

    function getEmail(email){
        var req = {verify_email: email, type: 'account_opening'};

        BinarySocket.send(req);
    }

    return {
        getEmail: getEmail
    };
}());

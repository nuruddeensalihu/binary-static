var securityws = (function(){

    "use strict";
    var $form ;

    var init = function(){
        $form   = $("#changeCashierLock");
        $("#repasswordrow").show();
        $("#changeCashierLock").show();
        $("legend").text(text.localize('Lock Cashier'));
        $("#lockInfo").text(text.localize('An additional password can be used to restrict access to the cashier.'));
        $form.find("button").attr("value","Update");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            if(validateForm() === false){
                return false;
            }
            if($(this).attr("value") === "Update"){
                BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "lock_password"}});
            }
            else{
                BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "unlock_password"}});
            }
        });
        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "is_locked"}});
    };

    var validateForm = function(){
        var isValid = true;
      
         $("#SecuritySuccessMsg").text('');
         $("#cashierlockpassword1").text('');
         $("#cashierlockpassword2").text('');
         $("#client_message_content").text('');

        $(":password").each(function(ind,ele){

            var value = $(ele).val().replace(/ /g, "");
            var isVisible = $(ele).is(':visible');

            if(value.length <= 0 && isVisible ){
                $("error" + $(ele).attr(id)).text(text.localize("Please enter a password."));
                isValid = false
            }
            else if(value.length > 25 && isVisible){
                $("error" + $(ele).attr(id)).text(text.localize("password can't be longer than 25."));
                isValid = false
            }

        });
    };
    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;
            var pwd = $("#cashierlockpassword1").val();
           // var pwd2 = $("#cashierlockpassword2").val();

            switch(option){
                case   "lock_password" :
                        BinarySocket.send({ 
                            "cashier_password": "1",
                            "lock_password": pwd
                        });
                        break;
                case   "unlock_password" :
                        BinarySocket.send({ 
                            "cashier_password": "1",
                            "unlock_password": pwd
                        });
                        break; 
                case   "is_locked" :
                        BinarySocket.send({ 
                            "cashier_password": "1",
                            "lock_password": pwd
                        });
                        break ;                          
            }
        }
    };
    var responseMessage = function(response){
       
        if("error" in response) {
            console.log("the error response is", response);
            if("message" in response.error) {

                if(response.error.message === "Your cashier was locked." && response.error.code === "CashierPassword"){
                    $("#repasswordrow").hide();
                    $("legend").text(text.localize("Unlock Cashier"));
                    $("#lockInfo").text(text.localize("Your cashier is locked as per your request - to unlock it, please enter the password."));
                    $form.find("button").attr("value","Unlock Cashier");
                }
                else{
                    $("#client_message_content").text(text.localize(response.error.message));
                    //send email
                }
            }
            return false;
        }
        else{
            console.log("the response is", response);
            var resvalue = response.echo_req.cashier_password;
            console.log("The value is",resvalue);
            if(parseInt(resvalue) === 1){
                //set success msg
                console.log("The result is ok");
                $("#changeCashierLock").hide();
                $("client_message_content").hide();
                $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
                console.log("The result 234 is ok");
                if("lock_password" in response.echo_req)
                {
                    //its a lock password
                    //send emai 
                    console.log("mog");
                }else{
                    //its an unlock password
                    //send email
                    console.log("smug");
                }
            }
            else{
                console.log("mean old man");
                $("#client_message_content").text(text.localize('Sorry, an error occurred while processing your account.'));
                //send email
                return false;
            }
        }
        return;
    };
    var SecurityApiResponse = function(response){
        var type = response.msg_type;
        if (type === "cashier_password" || (type === "error" && "cashier_password" in response.echo_req)){
           // populateForm(response);
           //check for lock account
           responseMessage(response);

        
        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }
    };
    return {
        init : init,
        SecurityApiResponse : SecurityApiResponse
    };
})();

pjax_config_page("user/settings/securityws", function() {
    return {
        onLoad: function() {
        	if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }
            if((/VRT/.test($.cookie('loginid')))){
                window.location.href = ("/");
            }

        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        securityws.SecurityApiResponse(response);
                          
                    }
                }
            });	
            securityws.init();
        }
    };
});
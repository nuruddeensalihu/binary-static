var securityws = (function(){

    "use strict";
    var $form ;

    var init = function(){
        $form   = $("#changeCashierLock");
        $("#repasswordrow").show();
        $("#changeCashierLock").show();
       // $("legend").text(text.localize('Lock Cashier'));
       // $("#lockInfo").text(text.localize('An additional password can be used to restrict access to the cashier.'));
        clearErrors();
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
    
    var clearErrors = function(){
        $("#SecuritySuccessMsg").text('');
        $("#errorcashierlockpassword1").text('');
        $("#errorcashierlockpassword2").text('');
        $("#client_message_content").text('');
        $("#client_message_content").hide();

    };
    var validateForm = function(){
        var isValid = true;
      
        clearErrors();

        var pwd1 = $("#cashierlockpassword1").val();
        var pwd2 = $("#cashierlockpassword2").val();
        var isVisible = $("#repasswordrow").is(':visible');
        console.log("isVisible", isVisible);
        if(isVisible === true){

            $(":password").each(function(ind,ele){
                console.log("The element is", ele);
                var value = $(ele).val();
   
                if(value.length <= 0 ){
                    $("#error" + $(ele).attr("id")).text(text.localize("Please enter a password."));
                    isValid = false;
                }
                else if(value.length > 25){
                    $("#error" + $(ele).attr("id")).text(text.localize("password can't be longer than 25."));
                    isValid = false;
                }else if(value.length < 6 ){
                    $("#error" + $(ele).attr("id")).text(text.localize("Your password should be at least 6 characters."));
                    isValid = false;
                }
            });
        }
        else{

            if(pwd1.length <= 0 ){
                $("#errorcashierlockpassword1").text(text.localize("Please enter a password."));
                isValid = false;
            }
            else if(pwd1.length > 25){
                $("#errorcashierlockpassword1").text(text.localize("password can't be longer than 25."));
                isValid = false;
            }else if(pwd1.length < 6 ){
                $("#errorcashierlockpassword1").text(text.localize("Your password should be at least 6 characters."));
                isValid = false;
            }

        }
        if(pwd1 !== pwd2 ){
            $("#errorcashierlockpassword2").text(text.localize("The two passwords that you entered do not match."));
            isValid = false;
        }
        console.log("the isValid is", isValid);
        return isValid;

    };
    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;
            var pwd = $("#cashierlockpassword1").val();

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
                            "passthrough" : {"value" : "lock_status"}
                        });
                        break ;                          
            }
        }
    };
    var responseMessage = function(response){
       
       if(response.echo_req.passthrough){
            var passthrough = response.echo_req.passthrough.value;
            var resvalue = response.echo_req.cashier_password;
            console.log("the resvalue is ", resvalue);
            if(passthrough === "lock_status" ){
                if(resvalue === 1){
                    $("#repasswordrow").hide();
                    $("legend").text(text.localize("Unlock Cashier"));
                    $("#lockInfo").text(text.localize("Your cashier is locked as per your request - to unlock it, please enter the password."));
                    $form.find("button").attr("value","Unlock Cashier");
                }
                else if(resvalue === 0){
                    $("#repasswordrow").show();
                    $("legend").text(text.localize("lock Cashier"));
                    $("#lockInfo").text(text.localize("An additional password can be used to restrict access to the cashier."));
                    $form.find("button").attr("value","lock Cashier");
                }
            }

       }else{
            if("error" in response) {
                console.log("the error response is", response);
                if("message" in response.error) {
                    $("#client_message_content").text(text.localize(response.error.message));
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
                }
                else{
                    console.log("mean old man");
                    $("#client_message_content").text(text.localize('Sorry, an error occurred while processing your account.'));
                    return false;
                }
            }
        }
        return;
    };
    var SecurityApiResponse = function(response){
        var type = response.msg_type;
        if (type === "cashier_password" || (type === "error" && "cashier_password" in response.echo_req)){
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
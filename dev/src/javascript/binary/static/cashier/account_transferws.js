var account_transferws = (function(){
    "use strict";
    var $form ;
    var client_accounts;
    
    var init = function(){
        $form = $('#account_transfer');
        $("#success_form").hide();
        $("#client_message").hide();

        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "initValues"}});
      

        console.log("the form is ", $form);
        console.log("The first row is ",$('.grd-grid-12','#SuccessForm'));
    };

    var apiResponse = function(response){
        var type = response.msg_type;
        if (type === "cashier_password" || (type === "error" && "cashier_password" in response.echo_req)){
           responseMessage(response);

        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }

    };

    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;
            var amt = $("#transfer_amount").val();

            switch(option){
                case   "initValues":
                        BinarySocket.send({ 
                            "transfer_between_accounts": "1"
                        });
                        break;
                case   "One" :
                        BinarySocket.send({ 
                            "balance": "1"
                        });
                        break;       

            }


        }
    };

    var responseMessage = function () {
        var resvalue ;
        if("error" in response) {
                if("message" in response.error) {
                    $("#client_message_content").show();
                    $("#client_message_content").text(text.localize(response.error.message));
                }
                return false;
        }
        else if("accounts" in response){
            console.log("we are at account lane",response);
            client_accounts = response.accounts;

            BinarySocket.send({ 
                "balance": "1",
                "passthrough" : { "value" : "get_bal_curr"}
            });

        }else if("balance" in resvalue && (response.echo_req.passthrough == "get_bal_curr")){
            console.log("we are at balance lane",response);
            var bal = response.balance.balance;
            var currType = response.balance.currency;
            var loginid = response.balance.loginid;
            var optionMF, optionML;

            if(loginid.substring(0,2) =="MF"){
                //MF account
                console.log("The MF account", loginid);
                var text  = text.localize("from gaming account " + client_accounts[1] + "to financial account (+" + client_accounts[0] + ")");
                optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                optionML.text(text);
                optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                text = text.localize("from financial account " + client_accounts[0] + "to gaming account (+" + client_accounts[1] + ")");
                optionMF.text(text);
                optionMF.attr('selected', 'selected');
            }
            else if(loginid.substring(0,2) == "ML"){
                //MLT account
                console.log("the ML account ", loginid);
                var text  = text.localize("from gaming account " + client_accounts[1] + "to financial account (+" + client_accounts[0] + ")");
                optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                optionML.text(text);
                optionML.attr('selected', 'selected');
                optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                text = text.localize("from financial account " + client_accounts[0] + "to gaming account (+" + client_accounts[1] + ")");
                optionMF.text(text);
                //from gaming account (MLT90000003) to financial account (MF90000003)
            }

        }
        else{

            resvalue = response.echo_req.cashier_password;
            if(parseInt(resvalue) === 1){
                $("#changeCashierLock").hide();
                $("#client_message_content").hide();
                $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
            }
            else{
                $("#client_message_content").show();
                $("#client_message_content").text(text.localize('Sorry, an error occurred while processing your account.'));
                
                return false;
            }
        }


    };


    return {
        init : init,
        apiResponse : apiResponse
    };

})();

pjax_config_page("cashier/account_transferws", function() {
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
                        account_transferws.apiResponse(response);
                    }
                }
            });	

            account_transferws.init();
        }
    };
});
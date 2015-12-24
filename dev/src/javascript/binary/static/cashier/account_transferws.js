var account_transferws = (function(){
    "use strict";
    var $form ;
    var client_accounts;
    var account_from , account_to ;
    var currType;
    
    var init = function(){
        $form = $('#account_transfer');
        $("#success_form").hide();
        $("#client_message").hide();

        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "initValues"}});

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();

            if(validateForm() === false){
                return false;
            }
            
            BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "transfer_between_accounts"}});
        });
    };

    var validateForm =function(){

        var amt = $form.find("#acc_transfer_amount").val();
        var isValid = true;

        if(amt <=0 ){
            $form.find("#invalid_amount").text(text.localize("Invalid amount. Minimum transfer amount is 0.10, and up to 2 decimal places."));
            isValid = false;
        }
    
        return isValid;
    };

    var apiResponse = function(response){
        var type = response.msg_type;
        if (type === "transfer_between_accounts" || (type === "error" && "transfer_between_accounts" in response.echo_req)){
           responseMessage(response);

        }
        else if(type === "balance" || (type === "error" && "balance" in response.echo_req))
        {
            responseMessage(response);
        }
        else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }

    };

    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;
            var amt = $form.find("#acc_transfer_amount").val();

            switch(option){
                case   "initValues":
                        BinarySocket.send({ 
                            "transfer_between_accounts": "1",
                            "passthrough" : {"value" : "set_client"}
                        });
                        break;
                case   "transfer_between_accounts" :
                        BinarySocket.send({ 
                            "transfer_between_accounts": "1",
                            "account_from": account_from,
                            "account_to": account_to,
                            "currency": currType,
                            "amount": amt
                        });
                        break;       
            }

        }
    };

    var responseMessage = function(response) {
        var resvalue ;
        var str;

        if("error" in response) {
                if("message" in response.error) {
                    $("#client_message_content").show();
                    $("#client_message_content").text(text.localize(response.error.message));
                }
                return false;
        }
        else if("balance" in response && (response.echo_req.passthrough.value == "get_bal_curr")){
            var bal = response.balance.balance;
            currType = response.balance.currency;
            var loginid = response.balance.loginid;
            var optionMF, optionML;

            $form.find("#currencyType").html(currType);

            if(client_accounts.length < 2 ){
                if((client_accounts[0].balance > 0) && (client_accounts[0].loginid.substring(0,2) == "ML")){
                    str  = text.localize("from gaming account (" + client_accounts[0].loginid + ") to financial account (" + loginid + ")");
                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.text(str);
                    optionML.attr('selected', 'selected');
                    account_from = client_accounts[0].loginid;
                    account_to = loginid;

                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    optionMF.remove();

                }else if((client_accounts[0].balance > 0) && (client_accounts[0].loginid.substring(0,2) == "MF")){
                    str = text.localize("from financial account (" + client_accounts[0].loginid + ") to gaming account (" + loginid + ")");
                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    optionMF.text(str);
                    optionMF.attr('selected', 'selected');

                    account_from = client_accounts[0].loginid;
                    account_to = loginid;

                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.remove();

                }else{
                    $("#client_message").show();
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
            }
            else if(client_accounts[0].balance > 0 && client_accounts[1].balance > 0)
            {
                if(loginid.substring(0,2) =="MF"){
                    str  = text.localize("from gaming account (" + client_accounts[1].loginid + ") to financial account (" + client_accounts[0].loginid + ")");
                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.text(str);
                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    str = text.localize("from financial account (" + client_accounts[0].loginid + ") to gaming account (" + client_accounts[1].loginid + ")");
                    optionMF.text(str);
                    optionMF.attr('selected', 'selected');

                    account_from = client_accounts[0].loginid;
                    account_to = client_accounts[1].loginid;

                }
                else if(loginid.substring(0,2) == "ML"){
                    str  = text.localize("from gaming account (" + client_accounts[1].loginid + ") to financial account (" + client_accounts[0].loginid + ")");
                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.text(str);
                    optionML.attr('selected', 'selected');
                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    str = text.localize("from financial account (" + client_accounts[0].loginid + ") to gaming account (" + client_accounts[1].loginid + ")");
                    optionMF.text(str);

                    account_from = client_accounts[1].loginid;
                    account_to = client_accounts[0].loginid;
                }
            }
            else{
                if((client_accounts[0].balance > 0) && (client_accounts[0].loginid.substring(0,2) == "ML")){
                    str  = text.localize("from gaming account (" + client_accounts[0].loginid + ") to financial account (" + loginid + ")");
                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.text(str);
                    optionML.attr('selected', 'selected');

                    account_from = client_accounts[0].loginid;
                    account_to = loginid;
                    
                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    optionMF.remove();

                }else if((client_accounts[0].balance > 0) && (client_accounts[0].loginid.substring(0,2) == "MF")){
                    str = text.localize("from financial account (" + client_accounts[0].loginid + ") to gaming account (" + loginid + ")");
                    optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                    optionMF.text(str);
                    optionMF.attr('selected', 'selected');

                    account_from = client_accounts[0].loginid;
                    account_to = loginid;

                    optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                    optionML.remove();

                }else{
                    $("#client_message").show();
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
            }

        }
        else if ("transfer_between_accounts" in response){

            if(response.echo_req.passthrough.value == "get_new_balance"){
        
                $.each(response.accounts,function(key,value){
                    $form.hide();
                    $("#success_form").show();
                    $("#client_message").hide();

                    if(value.loginid == account_from){
                        $("#loginid_1").html(value.loginid);
                        $("#balance_1").html(value.balance)
                    }
                    else if(value.loginid == account_to){
                        $("#loginid_2").html(value.loginid);
                        $("#balance_2").html(value.balance)

                    }
                });
            }
            else if(response.echo_req.passthrough.value =="set_client"){
                client_accounts = response.accounts;
                BinarySocket.send({ 
                    "balance": "1",
                    "passthrough" : { "value" : "get_bal_curr"}
                });
            }
            else{
                BinarySocket.send({ 
                    "transfer_between_accounts": "1",
                    "passthrough" : {"value" : "get_new_balance"}
                });

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
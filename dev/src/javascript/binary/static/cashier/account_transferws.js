var account_transferws = (function(){
    "use strict";
    var $form ;
    var account_from , account_to ,account_bal;
    var currType, MLTBal,MFBal,MLCurrType,MFCurrType;
    var availableCurr= [] ;
    var availableAccounts =[];
    
    var init = function(){
        $form = $('#account_transfer');
        $("#success_form").hide();
        $("#client_message").hide();
        account_bal = 0;

        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "initValues"}});
        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "payout_currencies"}});

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();

            if(validateForm() === false){
                return false;
            }
            
            BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "transfer_between_accounts"}});
        });

        $form.find("#transfer_account_transfer").on("change",function(){
            var accounts = $("#transfer_account_transfer option:selected").text();
            var matches = accounts
                            .split('(')
                            .filter(function(v){ 
                                return v.indexOf(')') > -1;})
                            .map( function(value) { 
                                return value.split(')')[0];
                        }); 

            account_from = matches[0];
            account_to = matches[1];
           
            if(account_from.substring(0,2) == "MF"){
                account_bal = MFBal;
                currType = MFCurrType;
            }else if(account_from.substring(0,2) == "ML"){
                account_bal = MLTBal;
                currType = MLCurrType;
            } 

            $form.find("#currencyType").html(currType);

            BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "payout_currencies"}});

        });
    };
    var validateForm =function(){

        var amt = $form.find("#acc_transfer_amount").val();
        var isValid = true;
       
        if(amt.length <=0 ){
            $form.find("#invalid_amount").text(text.localize("Invalid amount. Minimum transfer amount is 0.10, and up to 2 decimal places."));
            isValid = false;
        }
        if($.inArray(currType, availableCurr) == -1)
        {
            $form.find("#invalid_amount").text(text.localize("Invalid currency."));
            isValid = false;
        }

        return isValid;
    };

    var apiResponse = function(response){
        var type = response.msg_type;
        if (type === "transfer_between_accounts" || (type === "error" && "transfer_between_accounts" in response.echo_req)){
           responseMessage(response);

        }
        else if(type === "payout_currencies" || (type === "error" && "payout_currencies" in response.echo_req))
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
                case   "payout_currencies" :
                        BinarySocket.send({ 
                            "payout_currencies": "1"
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
                    $("#client_message").show();
                    $("#client_message p").html(text.localize(response.error.message));
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
                return false;
        }
        else if("payout_currencies" in response){

            availableCurr = response.payout_currencies;
        }
        else if ("transfer_between_accounts" in response){

            if(response.echo_req.passthrough.value == "get_new_balance"){
        
                $.each(response.accounts,function(key,value){
                    $form.hide();
                    $("#success_form").show();
                    $("#client_message").hide();

                    if(value.loginid == account_from){
                        $("#loginid_1").html(value.loginid);
                        $("#balance_1").html(value.balance);
                    }
                    else if(value.loginid == account_to){
                        $("#loginid_2").html(value.loginid);
                        $("#balance_2").html(value.balance);

                    }
                });
            }
            else if(response.echo_req.passthrough.value =="set_client"){
                var optionMF, optionML ;
                var firstbal,secondbal,firstacct,secondacct,firstCurrType,SecondCurrType;
                $.each(response.accounts, function(index,value){
                    if(index === 0){
                        firstbal = value["balance"];
                        firstCurrType = value["currency"];
                        firstacct  = value["loginid"];
                    }
                    else{
                        secondbal = value["balance"];
                        SecondCurrType = value["currency"];
                        secondacct = value["loginid"];
                    }

                    if(value["loginid"].substring(0,2) == "MF"){
                        MFBal = value["balance"];
                        MFCurrType  = value["currency"];
                        availableAccounts.push(value["loginid"]);
                    }
                    else if(value["loginid"].substring(0,2) == "ML")
                    {
                        MLTBal = value["balance"];
                        MLCurrType = value["currency"];
                        availableAccounts.push(value["loginid"]);
                    }

                    if($.isEmptyObject(firstbal) || (firstbal === 0))
                    {
                        account_from = secondacct;
                        firstbal = secondbal;
                        currType = SecondCurrType;

                        account_to = firstacct;
                        secondbal = firstbal;
                    }
                    else{
                        account_from = firstacct;
                        firstbal = firstbal;

                        secondbal = secondbal;

                        account_to = secondacct;
                        currType = firstCurrType;
                    }

                });
               
                account_bal = firstbal;
            
                if((firstbal <=0) && (account_to !== undefined) ){
                    $("#client_message").show();
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
                else if(account_to === undefined || account_from === undefined || $.isEmptyObject(account_to))
                {
                    $("#client_message").show();
                    $("#client_message p").html(text.localize("The account transfer is unavailable for your account."));
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
                else if(account_to == secondacct && account_from == firstacct){
                    $form.find("#currencyType").html(currType);

                    if(account_from.substring(0,2) == "MF"){
                    
                        optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                        str = text.localize("from financial account (" + account_from + ") to gaming account (" + account_to + ")");
                        optionMF.text(str);
                        optionMF.attr('selected', 'selected');
                        if(secondbal > 0){
                            str  = text.localize("from gaming account (" + account_to + ") to financial account (" + account_from + ")");
                            optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                            optionML.text(str);

                        }
                        else{
                            optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                            optionML.remove();
                        }
                    }
                    else if(account_from.substring(0,2) == "ML")
                    {
                        str  = text.localize("from gaming account (" + account_from + ") to financial account (" + account_to + ")");
                        optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                        optionML.text(str);
                        optionML.attr('selected', 'selected');

                        if(secondbal > 0){
                            optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                            str = text.localize("from financial account (" + account_to + ") to gaming account (" + account_from + ")");
                            optionMF.text(str);
                        }
                        else{
                            optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                            optionMF.remove();

                        }
                    }

                }
                else if(account_to == firstacct && account_from == secondacct)
                {
                    $form.find("#currencyType").html(currType);
                    if(account_from.substring(0,2) =="MF"){
                        optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                        str = text.localize("from financial account (" + account_from + ") to gaming account (" + account_to + ")");
                        optionMF.text(str);
                        optionMF.attr('selected', 'selected');
                        optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                        optionML.remove();
                    }
                    else if(account_from.substring(0,2) == "ML")
                    {
                        str  = text.localize("from gaming account (" + account_from + ") to financial account (" + account_to+ ")");
                        optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                        optionML.text(str);
                        optionML.attr('selected', 'selected');

                        optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                        optionMF.remove();
                    }

                }

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
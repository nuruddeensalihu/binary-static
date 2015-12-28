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
        if((/USD/.test(currType) === false) && (/EUR/.test(currType) === false) )
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
            /*
            var bal = response.balance.balance;
            currType = response.balance.currency;
            var loginid = response.balance.loginid;
            var optionMF, optionML;

            $form.find("#currencyType").html(currType);

            console.log("The account are", client_accounts);
            
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
        */
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
                /*
                var bal = response.balance.balance;
                currType = response.balance.currency;
                var loginid = response.balance.loginid;
                var optionMF, optionML;
                */
                var optionMF, optionML ,str, bal1,bal2;
                var firstbal,secondbal,firstacct,secondacct,firstCurrType,firstbal,secondbal,SecondCurrType;

                
                $.each(response.accounts, function(index,value){
                    console.log("The index is ", index);
                    console.log("The value is ", value);

                    console.log("The account from value is ", value["loginid"]);


                    if(index == 0){
                        firstbal = value["balance"];
                        firstCurrType = value["currency"];
                        firstacct  = value["loginid"];

                    }
                    else{
                        secondbal = value["balance"];
                        firstCurrType = value["currency"];
                        secondacct = value["loginid"];
                    }

                    if($.isEmptyObject(firstbal) || (firstbal == 0))
                    {
                        console.log("Firstbal is 0");
                        account_from = secondacct;
                        firstbal = secondbal;
                        currType = SecondCurrType;

                        account_to = firstacct;
                        secondbal = firstbal;
                    }
                    else{
                        console.log("The first bal is greater");
                        account_from = firstacct;
                        firstbal = firstbal;

                        secondbal = secondbal;

                        account_to = secondacct;
                        currType = firstCurrType;
                    }

                });

                if(firstbal <=0){
                    $("#client_message").show();
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
                else if(account_to == secondacct && account_from == firstacct){
                    $form.find("#currencyType").html(currType);
                    console.log("The two of them are not empty");

                    if(account_from.substring(0,2) =="MF"){
                        str  = text.localize("from gaming account (" + account_from + ") to financial account (" + account_to + ")");
                        optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                        optionML.text(str);
                        optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                        str = text.localize("from financial account (" + account_from + ") to gaming account (" + account_to + ")");
                        optionMF.text(str);
                        optionMF.attr('selected', 'selected');

                    }
                    else if(account_from.substring(0,2) == "ML")
                    {
                        str  = text.localize("from gaming account (" + account_from + ") to financial account (" + account_to+ ")");
                        optionML  = $form.find("#transfer_account_transfer option[value='gtf']");
                        optionML.text(str);
                        optionML.attr('selected', 'selected');
                        optionMF = $form.find("#transfer_account_transfer option[value='ftg']");
                        str = text.localize("from financial account (" + account_from + ") to gaming account (" + account_to + ")");
                        optionMF.text(str);
                    }

                }
                else if(account_to == firstacct && account_from == secondacct)
                {
                    console.log("One is empty");
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
                /*
                console.log("account_to", account_to);
                console.log("account_from",account_from);
                console.log("firstacct", firstacct);
                console.log("secondacct", secondacct);
                console.log("account_from equals firstacct", (account_from == firstacct));
                console.log("account_to equals secondacct", (account_to == secondacct));
                */
                console.log("the real accounts", response.accounts);
                console.log("The account response", response);
                
                //client_accounts = response.accounts;
                
                /*
                BinarySocket.send({ 
                    "balance": "1",
                    "passthrough" : { "value" : "get_bal_curr"}
                });
                */
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
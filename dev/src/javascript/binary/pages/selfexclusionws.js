var SelfExlusionWS = (function(){
    
    "use strict";

    var $form;
    var data = {};

    var init = function(){
        $form   = $("#selfExclusion");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            if(validateForm($form) === false){
                return false;
            }
            BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "set_self_exclusion"}});
        });

        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "get_self_exclusion"}});
    };
    function isNormalInteger(str) {
        return /^\+?\d+$/.test(str);
    }
    var resetError = function(){
        $("p.errorfield").each(function(ind,element){
            $(element).text("");
        });
    };
    var resetForm = function(){
        $(":text").each(function(ind,element){
            $(element).val("");
        });
    };
    var validateForm = function(frm){
        var isValid = true;
       
        resetError();
        $(":text").each(function(ind,element){
            var ele = $(element).val().replace(/ /g, "");
            if(!isNormalInteger(ele) && (ele.length > 0))
            {
                if(!/EXCLUDEUNTIL/.test($(element).attr("id")))
                {
                    $("#error"+$(element).attr("id")).text(text.localize("Please enter an integer value"));
                    isValid = false;
                }
            }
        });
        if(validateDate() === false){
            isValid = false;
        }
        if(isValid === false){

            return false;
        }
    };
    var isAuthorized =  function(response){

        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;

            switch(option){
                case   "get_self_exclusion" :
                        BinarySocket.send({"get_self_exclusion": 1});
                        break;
                case   "set_self_exclusion" :
                        sendRequest();
                        break;                   
            }
        }
    };
    var validateDate = function(){
        return client_form.self_exclusion.validate_exclusion_date();
    };

    var populateForm = function(response){
        var res = response.get_self_exclusion;

        if("error" in response) {
            var errorMsg = text.localize("Sorry, there is an issue getting your record.");

            if("message" in response.error) {
                console.log(response.error.message);
            }
            $("#invalidinputfound").text(errorMsg);
            return false;
        }else{
            data.max_balance = $("#MAXCASHBAL").val();
            data.max_turnover = $("#DAILYTURNOVERLIMIT").val();
            data.max_losses = $("#DAILYLOSSLIMIT").val();
            data.max_7day_turnover = $("#7DAYTURNOVERLIMIT").val();
            data.max_7day_losses = $("#7DAYLOSSLIMIT").val();
            data.max_30day_turnover = $("#30DAYTURNOVERLIMIT").val();
            data.max_30day_losses = $("#30DAYLOSSLIMIT").val();
            data.max_open_bets = $("#MAXOPENPOS").val();
            data.session_duration_limit =  $("#SESSIONDURATION").val();
            data.exclude_until = $("#EXCLUDEUNTIL").val();

            if(res){
                $.map(res,function(value,property){

                    switch(property){
                        case  "max_balance" :
                               data.max_balance = value.replace(/["']/g, "");
                               break;
                        case  "max_turnover" :
                               data.max_turnover = value.replace(/["']/g, "");
                               break;
                        case  "max_losses"   :
                               data.max_losses = value.replace(/["']/g, "");
                               break;
                        case  "max_7day_turnover" :
                               data.max_7day_turnover = value.replace(/["']/g, "");
                               break;
                        case  "max_7day_losses" :
                               data.max_7day_losses = value.replace(/["']/g, "");
                               break;
                        case   "max_30day_turnover" :
                                data.max_30day_turnover = value.replace(/["']/g, "");
                                break;
                        case   "max_30day_losses" :
                                data.max_30day_losses = value.replace(/["']/g, "");
                                break;
                        case   "max_open_bets" :
                                data.max_open_bets = value.replace(/["']/g, "");
                                break; 
                        case   "session_duration_limit"  :
                                data.session_duration_limit = value.indexOf('"') >= 0 ? value.replace(/["']/g, "") : value;
                                break;
                        case   "exclude_until"   :
                                data.exclude_until = value.replace(/["']/g, "");
                                break;       

                    }

                });
            }
        }
        $("#MAXCASHBAL").val(data.max_balance);
        $("#DAILYTURNOVERLIMIT").val(data.max_turnover),
        $("#DAILYLOSSLIMIT").val(data.max_losses),
        $("#7DAYTURNOVERLIMIT").val(data.max_7day_turnover),
        $("#7DAYLOSSLIMIT").val(data.max_7day_losses),
        $("#30DAYTURNOVERLIMIT").val(data.max_30day_turnover),
        $("#30DAYLOSSLIMIT").val(data.max_30day_losses),
        $("#MAXOPENPOS").val(data.max_open_bets),
        $("#SESSIONDURATION").val(data.session_duration_limit),
        $("#EXCLUDEUNTIL").val(data.exclude_until)

    };
    var sendRequest = function(){

        var hasChanges  = false;
        var newData = {
            "max_balance"  : $("#MAXCASHBAL").val().replace(/ /g, ""),
            "max_turnover" : $("#DAILYTURNOVERLIMIT").val().replace(/ /g, ""),
            "max_losses" : $("#DAILYLOSSLIMIT").val().replace(/ /g, ""),
            "max_7day_turnover" : $("#7DAYTURNOVERLIMIT").val().replace(/ /g, ""),
            "max_7day_losses" : $("#7DAYLOSSLIMIT").val().replace(/ /g, ""),
            "max_30day_turnover" : $("#30DAYTURNOVERLIMIT").val().replace(/ /g, ""),
            "max_30day_losses" : $("#30DAYLOSSLIMIT").val().replace(/ /g, ""),
            "max_open_bets": $("#MAXOPENPOS").val().replace(/ /g, ""),
            "session_duration_limit" :  $("#SESSIONDURATION").val().replace(/ /g, ""),
            "exclude_until" : $("#EXCLUDEUNTIL").val()
        };
        $.map(newData , function(value, property){
            if(value.replace(/["']/g, "") !== data[property])
                hasChanges = true ;
        }); 
        console.log("the old data is", data);
        console.log("the new data is ", newData);
        if(hasChanges === false){
            $("#invalidinputfound").text(text.localize("Please provide at least one self-exclusion setting"));
            return false;
        }else{
            BinarySocket.send(
                {
                  "set_self_exclusion": 1,
                  "max_balance": parseInt(newData.max_balance),
                  "max_turnover": parseInt(newData.max_turnover),
                  "max_losses": parseInt(newData.max_losses),
                  "max_7day_turnover": parseInt(newData.max_7day_turnover),
                  "max_7day_losses": parseInt(newData.max_7day_losses),
                  "max_30day_turnover": parseInt(newData.max_30day_turnover),
                  "max_30day_losses": parseInt(newData.max_30day_losses),
                  "max_open_bets": parseInt(newData.max_open_bets),
                  "session_duration_limit": parseInt(newData.session_duration_limit),
                  "exclude_until": newData.exclude_until ? newData.exclude_until : null
                });

            return true;
        }
    };
    var responseMessage = function(response){
        if("error" in response) {
            var errorMsg = text.localize("Operation failed.");

            if("message" in response.error) {
                console.log(response.error.message);
            }
            $("#invalidinputfound").text(errorMsg);

            return false;
        }else{
            window.location.href = window.location.href;
        }
    };
    var apiResponse = function(response){
        var type = response.msg_type;
    
        if (type === "get_self_exclusion" || (type === "error" && "get_self_exclusion" in response.echo_req)){
            populateForm(response);
        }else if(type === "set_self_exclusion" || (type === "error" && "set_self_exclusion" in response.echo_req))
        {
            responseMessage(response);
        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }

    } ;

    return {
        init: init,
        apiResponse: apiResponse,
        populateForm : populateForm
    };



})();


pjax_config_page("user/self_exclusionws", function() {
    return {
        onLoad: function() {
        	if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }
             // Check if it is a real account or not
            if((/VRT/.test($.cookie('loginid')))){
                window.location.href = ("/");
            }

        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        SelfExlusionWS.apiResponse(response);
                          
                    }
                }
            });	
                
           // date picker for self exclusion
            Exclusion.self_exclusion_date_picker();

            //init commands
            SelfExlusionWS.init();
        }
    };
});
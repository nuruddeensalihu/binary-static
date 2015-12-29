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

    var isNormalInteger= function(str) {
        return /^\+?\d+$/.test(str);
    };

    var validateForm = function(frm){
        var isValid = true;
        $("p.errorfield").each(function(ind,element){
            $(element).text("");
        });
   
        $(":text").each(function(ind,element){
            var ele = $(element).val().replace(/ /g, "");
            var id = $(element).attr("id");
       
            if(!isNormalInteger(ele) && (ele.length > 0))
            {
                if(!/EXCLUDEUNTIL/.test($(element).attr("id")))
                {
                    $("#error"+$(element).attr("id")).text(text.localize("Please enter an integer value"));
                    isValid = false;
                }
            }else{
                if(id ===("MAXCASHBAL") && ((ele > data.max_balance && data.max_balance > 0) || (ele.length < 1 && data.max_balance > 0) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_balance ));
                    isValid = false;
                } else if(id === ("DAILYTURNOVERLIMIT") && ((ele > data.max_turnover &&  data.max_turnover > 0) || (ele.length < 1 &&  data.max_turnover > 0) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_turnover ));
                    isValid = false;
                } else if(id === ("DAILYLOSSLIMIT") && ((ele > data.max_losses && data.max_losses > 0) || (ele.length < 1 && data.max_losses > 0) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_losses ));
                    isValid = false;
                } else if(id === ("7DAYTURNOVERLIMIT") && ((ele > data.max_7day_turnover && data.max_7day_turnover > 0 ) || (ele.length < 1 && data.max_7day_turnover > 0 ) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_7day_turnover ));
                    isValid = false;
                } else if(id === ("7DAYLOSSLIMIT") && ((ele > data.max_7day_losses && data.max_7day_losses > 0) || (ele.length < 1 && data.max_7day_losses > 0 ) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_7day_losses ));
                    isValid = false;
                }  else if(id === ("30DAYTURNOVERLIMIT") && ((ele > data.max_30day_turnover && data.max_30day_turnover > 0) || (ele.length < 1 && data.max_30day_turnover > 0 ) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_30day_turnover ));
                    isValid = false;
                } else if(id === ("30DAYLOSSLIMIT") && ((ele > data.max_30day_losses && data.max_30day_losses > 0) || (ele.length < 1 && data.max_30day_losses > 0 ) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_30day_losses ));
                    isValid = false;
                }  else if(id === ("MAXOPENPOS") && ((ele > data.max_open_bets && data.max_open_bets > 0 ) || (ele.length < 1 && data.max_open_bets > 0 ) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.max_open_bets ));
                    isValid = false;
                } else if(id === ("SESSIONDURATION") && ((ele > data.session_duration_limit && data.session_duration_limit > 0 ) || (ele.length < 1 && data.session_duration_limit > 0) ) ){
                    $("#error"+id).text(text.localize("Please enter a number between 0 and " + data.session_duration_limit ));
                    isValid = false;
                } 
            }
        });

        if(validateDate() ===false){
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
            if("message" in response.error) {
                console.log(response.error.message);
            }
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
                               data.max_balance = value;
                               break;
                        case  "max_turnover" :
                               data.max_turnover = value;
                               break;
                        case  "max_losses"   :
                               data.max_losses = value;
                               break;
                        case  "max_7day_turnover" :
                               data.max_7day_turnover = value;
                               break;
                        case  "max_7day_losses" :
                               data.max_7day_losses = value;
                               break;
                        case   "max_30day_turnover" :
                                data.max_30day_turnover = value;
                                break;
                        case   "max_30day_losses" :
                                data.max_30day_losses = value;
                                break;
                        case   "max_open_bets" :
                                data.max_open_bets = value;
                                break; 
                        case   "session_duration_limit"  :
                                data.session_duration_limit = value;
                                break;
                        case   "exclude_until"   :
                                data.exclude_until = value;
                                break;       

                    }

                });
            }
        }
        $("#MAXCASHBAL").val(data.max_balance);
        $("#DAILYTURNOVERLIMIT").val(data.max_turnover);
        $("#DAILYLOSSLIMIT").val(data.max_losses);
        $("#7DAYTURNOVERLIMIT").val(data.max_7day_turnover);
        $("#7DAYLOSSLIMIT").val(data.max_7day_losses);
        $("#30DAYTURNOVERLIMIT").val(data.max_30day_turnover);
        $("#30DAYLOSSLIMIT").val(data.max_30day_losses);
        $("#MAXOPENPOS").val(data.max_open_bets);
        $("#SESSIONDURATION").val(data.session_duration_limit);
        $("#EXCLUDEUNTIL").val(data.exclude_until);
    };

    var sendRequest = function(){
        var hasChanges  = false;
        var newData = {
            "max_balance"  : $("#MAXCASHBAL").val() || "",
            "max_turnover" : $("#DAILYTURNOVERLIMIT").val() || "",
            "max_losses" : $("#DAILYLOSSLIMIT").val() || "" ,
            "max_7day_turnover" : $("#7DAYTURNOVERLIMIT").val() || "",
            "max_7day_losses" : $("#7DAYLOSSLIMIT").val() || "",
            "max_30day_turnover" : $("#30DAYTURNOVERLIMIT").val() || "",
            "max_30day_losses" : $("#30DAYLOSSLIMIT").val() || "",
            "max_open_bets": $("#MAXOPENPOS").val() || "" ,
            "session_duration_limit" :  $("#SESSIONDURATION").val() || "",
            "exclude_until" : $("#EXCLUDEUNTIL").val()
        };
        console.log("the newData is", newData);
        
        $.map(newData , function(value, property){
            if(value !== data[property])
                hasChanges = true ;
        }); 
        if(hasChanges === false){
            $("#invalidinputfound").text(text.localize("Please provide at least one self-exclusion setting"));
            return false;
        }else{
            BinarySocket.send(
                {
                  "set_self_exclusion": 1,
                  "max_balance": newData.max_balance,
                  "max_turnover": newData.max_turnover,
                  "max_losses": newData.max_losses,
                  "max_7day_turnover": newData.max_7day_turnover,
                  "max_7day_losses": newData.max_7day_losses,
                  "max_30day_turnover": newData.max_30day_turnover,
                  "max_30day_losses": newData.max_30day_losses,
                  "max_open_bets": newData.max_open_bets,
                  "session_duration_limit": parseInt(newData.session_duration_limit),
                  "exclude_until": newData.exclude_until ? newData.exclude_until : null
                });
            return true;
        }
    };

    var responseMessage = function(response){
        console.log("the response is ", response);
        if("error" in response) {
            var  error = response.error;
            switch(error.field){
                case  "max_balance" :
                       $("#errorMAXCASHBAL").text(text.localize(error.message));
                       break;
                case  "max_turnover" :
                       $("#errorDAILYTURNOVERLIMIT").text(text.localize(error.message));
                       break;
                case  "max_losses"   :
                       $("#errorDAILYLOSSLIMIT").text(text.localize(error.message));
                       break;
                case  "max_7day_turnover" :
                       $("#error7DAYTURNOVERLIMIT").text(text.localize(error.message));
                       break;
                case  "max_7day_losses" :
                       $("#error7DAYLOSSLIMIT").text(text.localize(error.message));
                       break;
                case   "max_30day_turnover" :
                        $("#error30DAYTURNOVERLIMIT").text(text.localize(error.message));
                        break;
                case   "max_30day_losses" :
                        $("#error30DAYLOSSLIMIT").text(text.localize(error.message));
                        break;
                case   "max_open_bets" :
                        $("#errorMAXOPENPOS").text(text.localize(error.message));
                        break; 
                case   "session_duration_limit"  :
                        $("#errorSESSIONDURATION").text(text.localize(error.message));
                        break;
                case   "exclude_until"   :
                        $("#errorEXCLUDEUNTIL").text(text.localize(error.message));
                        break;       

            }
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
    };

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
            Exclusion.self_exclusion_date_picker();
            SelfExlusionWS.init();
        }
    };
});
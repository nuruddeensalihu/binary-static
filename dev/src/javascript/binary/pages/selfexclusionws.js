var SelfExlusionWS = (function(){
    
    "use strict";

    var $form;
    var data = {};

    var init = function(){
        $form   = $("#selfExclusion");
        clearErrors();
        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            clearErrors();
            if(validateForm($form) === false){
                return false;
            }
            sendRequest();

        });

        BinarySocket.send({"get_self_exclusion": 1});

        self_exclusion_date_picker();
    };

    var clearErrors = function(){
        $form.find("#exclusionMsg").hide();
        $form.find("#exclusionMsg").text("");
        $form.show();
        $("#exclusionText").show();
        $("#exclusionTitle").show();
        $("#errorMsg").text("");
    };

    var isNormalInteger= function(str) {
        return /^\+?\d+$/.test(str);
    };

    var validateForm = function($frm){
        var isValid = true;
        $("p.errorfield").each(function(ind,element){
            $(element).text("");
        });
   
        $frm.find(":text").each(function(ind,element){
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

        if(validate_exclusion_date() ===false){
            isValid = false;
        }

        if(isValid === false){

            return false;
        }
    };

    var validate_exclusion_date = function() {
        var exclusion_date = $('#EXCLUDEUNTIL').val();
        var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        var error_element_errorEXCLUDEUNTIL = clearInputErrorField('errorEXCLUDEUNTIL');

        if (exclusion_date) {

            if(date_regex.test($('#EXCLUDEUNTIL').val()) === false){
                error_element_errorEXCLUDEUNTIL.innerHTML = text.localize("Please select a valid date");
                return false;
            }
    
            exclusion_date = new Date(exclusion_date);
            // self exclusion date must >= 6 month from now
            var six_month_date = new Date();
            six_month_date.setMonth(six_month_date.getMonth() + 6);

            if (exclusion_date < six_month_date) {
                error_element_errorEXCLUDEUNTIL.innerHTML = text.localize("Please enter a date that is at least 6 months from now.");
                return false ;
            }

            if (confirm(text.localize("When you click 'Ok' you will be excluded from trading on the site until the selected date.")) === true) {
                return true;
            } else {
                return false;
            }

        }

        return true;
    };

    var populateForm = function(response){
        var res = response.get_self_exclusion;

        if("error" in response) {
            if("message" in response.error) {
                console.log(response.error.message);
                $("#errorMsg").removeClass("hidden");
                $("#errorMsg").text(text.localize(response.error.message));
                $form.hide();
                $("#exclusionText").hide();
                $("#exclusionTitle").hide();
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
                               data.max_balance = parseInt(value);
                               break;
                        case  "max_turnover" :
                               data.max_turnover = parseInt(value);
                               break;
                        case  "max_losses"   :
                               data.max_losses = parseInt(value);
                               break;
                        case  "max_7day_turnover" :
                               data.max_7day_turnover = parseInt(value);
                               break;
                        case  "max_7day_losses" :
                               data.max_7day_losses = parseInt(value);
                               break;
                        case   "max_30day_turnover" :
                                data.max_30day_turnover = parseInt(value);
                                break;
                        case   "max_30day_losses" :
                                data.max_30day_losses = parseInt(value);
                                break;
                        case   "max_open_bets" :
                                data.max_open_bets = parseInt(value);
                                break; 
                        case   "session_duration_limit"  :
                                data.session_duration_limit = parseInt(value);
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
            "max_balance"  : parseInt($("#MAXCASHBAL").val()) || "",
            "max_turnover" : parseInt($("#DAILYTURNOVERLIMIT").val()) || "",
            "max_losses" : parseInt($("#DAILYLOSSLIMIT").val()) || "" ,
            "max_7day_turnover" : parseInt($("#7DAYTURNOVERLIMIT").val()) || "",
            "max_7day_losses" : parseInt($("#7DAYLOSSLIMIT").val()) || "",
            "max_30day_turnover" : parseInt($("#30DAYTURNOVERLIMIT").val()) || "",
            "max_30day_losses" : parseInt($("#30DAYLOSSLIMIT").val()) || "",
            "max_open_bets": parseInt($("#MAXOPENPOS").val()) || "" ,
            "session_duration_limit" :  parseInt($("#SESSIONDURATION").val()) || "",
            "exclude_until" : $("#EXCLUDEUNTIL").val()
        };
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
            $form.find("#exclusionMsg").show();
            $form.find("#exclusionMsg").text(text.localize('Your changes have been updated.'));
            BinarySocket.send({"get_self_exclusion": 1});

        }
    };

    var self_exclusion_date_picker = function () {
        // 6 months from now
        var start_date = new Date();
        start_date.setMonth(start_date.getMonth() + 6);

        // 5 years from now
        var end_date = new Date();
        end_date.setFullYear(end_date.getFullYear() + 5);

        var id = $('#EXCLUDEUNTIL');

        id.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: start_date,
            maxDate: end_date,
            onSelect: function(dateText, inst) {
                id.attr("value", dateText);
            },
        });
    };

    var apiResponse = function(response){
        var type = response.msg_type;
    
        if (type === "get_self_exclusion" || (type === "error" && "get_self_exclusion" in response.echo_req)){
            populateForm(response);
        }else if(type === "set_self_exclusion" || (type === "error" && "set_self_exclusion" in response.echo_req))
        {
            responseMessage(response);
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

            SelfExlusionWS.init();
        
        }
    };
});
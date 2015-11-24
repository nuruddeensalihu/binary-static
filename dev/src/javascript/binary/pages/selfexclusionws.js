var SelfExlusionWS = (function(){
    
    "use strict";

    var $form;
    var data = {};

    var init = function(){
        $form   = $("#selfExclusion");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            validateForm($form);
            validateDate();
            BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "set_self_exclusion"}});
        });

        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "get_self_exclusion"}});

    };
    function isNormalInteger(str) {
        return /^\+?\d+$/.test(str);
    }
    var resetError = function(){
        //reset error to empty
        $("p.errorfield").each(function(ind,element){

            $(element).text("");
        });
    };
    var resetForm = function(){
        $(":text").each(function(ind,element){
            if(!isNormalInteger($(element).val()) && $(element).val())
            {
                if(!/EXCLUDEUNTIL/.test($(element).attr("id")))
                {
                    $(element).val("");
                }
            }
        });

    };
    var validateForm = function(frm){
        var isValid = true;
       
        resetError();
      

        $(":text").each(function(ind,element){
            if(!isNormalInteger($(element).val()) && $(element).val())
            {
                if(!/EXCLUDEUNTIL/.test($(element).attr("id")))
                {
                    $("#error"+$(element).attr("id")).text("Please enter an integer value");
                    isValid = false;
                }
            }
        });

        if(!isValid)
            return false;

    };
    var isAuthorized =  function(response){
       var option = response.echo_req.passthrough.value === 'undefined' ? null  : response.echo_req.passthrough.value;
       console.log("the option value is" , option);
       console.log("the response for option is", response);
       switch(option){
        case   "get_self_exclusion" :
                BinarySocket.send({"get_self_exclusion": 1});
                break;
        case   "set_self_exclusion" :
                sendRequest();
                break;                   
       }
        
    };

    var populateForm = function(response){
        var res = response.get_self_exclusion;

        var val =  $.map(res, function(value , property){
            console.log("the mapping propety is ", property);
            console.log("the mapping value is ", value);
            return property;
        });

        val = val.join(',');

        //Reset form to empty.

        console.log("The first data is before clear ", $(MAXCASHBAL).val());
        resetForm();
        console.log("The first data is after clear ", $(MAXCASHBAL).val());

        console.log("map values test", val);

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
        console.log("Empty datas are ", data);
        if(res){
            $.map(res,function(value,property){
                console.log("the data value is 1", value);
                console.log("the data property is ", property);
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
                    case    "max_open_bets" :
                             data.max_open_bets = value;
                             break; 
                    case    "session_duration_limit"  :
                             data.session_duration_limit = value;
                             break;
                    case    "exclude_until"   :
                             data.exclude_until = value;
                             break;       

                }

            });
            
        }
         //Bind our data here

        console.log("the res are ", res);

        console.log("the datas are ", data);
        console.log("The sub datas ",data.max_balance);
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

        var hasChages  = false;
        var newData = {
            "max_balance"  : $("#MAXCASHBAL").val(),
            "max_turnover" : $("#DAILYTURNOVERLIMIT").val(),
            "max_losses" : $("#DAILYLOSSLIMIT").val(),
            "max_7day_turnover" : $("#7DAYTURNOVERLIMIT").val(),
            "max_7day_losses" : $("#7DAYLOSSLIMIT").val(),
            "max_30day_turnover" : $("#30DAYTURNOVERLIMIT").val(),
            "max_30day_losses" : $("#30DAYLOSSLIMIT").val(),
            "max_open_bets": $("#MAXOPENPOS").val(),
            "session_duration_limit" :  $("#SESSIONDURATION").val(),
            "exclude_until" : $("#EXCLUDEUNTIL").val()
        };

        $.map(newData , function(value, property){
            console.log("the whole data is ", data);
            console.log("The old data is", data[property]);
            console.log("The parameter is", property);
            console.log("the new data is", value);
            if(value !== data[property])
                hasChages = true ;
        });
        //Check if value changes 
        
        if(!hasChages){
            $("#invalidinputfound").text("Please provide at least one self-exclusion setting");
            return false;
        }
        console.log("The newdata to be sent is ", newData);
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
              "session_duration_limit": newData.session_duration_limit,
              "exclude_until": newData.exclude_until
            });

    };
    var responseMessage = function(response){
        //msg_type: "error"
        console.log("The responseMessage is ", response);

    };
    var apiResponse = function(response){
        var type = response.msg_type;
        console.log("the response type is", type);
        if (type === "get_self_exclusion" || (type === "error" && "get_self_exclusion" in response.echo_req)){
            console.log("the log is",response.get_self_exclusion);
            populateForm(response);
        }else if(type === "set_self_exclusion" || (type === "error" && "set_self_exclusion" in response.echo_req))
        {
            console.log("the res is ",response.set_self_exclusion);
            responseMessage(response);
        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }

    } ;
    var datePicker = function () {
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

    var validateDate = function () {
        $('#selfExclusion').on('click', '#self_exclusion_submit', function () {
            return client_form.self_exclusion.validate_exclusion_date();
        });
    };

    return {
        init: init,
        datePicker : datePicker,
        apiResponse: apiResponse,
        populateForm : populateForm,
    };



})();


pjax_config_page("user/self_exclusionws", function() {
    return {
        onLoad: function() {
        	if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
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
                
            SelfExlusionWS.datePicker();
           // SelfExlusionWS.populateForm();
        
            SelfExlusionWS.init();
        }
    };
});
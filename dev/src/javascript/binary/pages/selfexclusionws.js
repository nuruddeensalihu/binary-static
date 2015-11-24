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
            sendRequest();
        });

        BinarySocket.send({"authorize": $.cookie('login')});
        BinarySocket.send({"get_self_exclusion": 1});

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
    var populateForm = function(response){
        var res = response.get_self_exclusion;

        $.map(res, function(){
            return this.property;
        });

        data.max_balance = $("#MAXCASHBAL").val(),
        data.max_turnover = $("#DAILYTURNOVERLIMIT").val(),
        data.max_losses = $("#DAILYLOSSLIMIT").val(),
        data.max_7day_turnover = $("#7DAYTURNOVERLIMIT").val(),
        data.max_7day_losses = $("#7DAYLOSSLIMIT").val(),
        data.max_30day_turnover = $("#30DAYTURNOVERLIMIT").val(),
        data.max_30day_losses = $("#30DAYLOSSLIMIT").val(),
        data.max_open_bets = $("#MAXOPENPOS").val(),
        data.session_duration_limit =  $("#SESSIONDURATION").val(),
        data.exclude_until = $("#EXCLUDEUNTIL").val();
        if(res){
            $.map(res,function(){

                switch(this.property){
                    case  "max_balance" :
                           data.max_balance = this.value;
                           break;
                    case  "max_turnover" :
                           data.max_turnover = this.value;
                           break;
                    case  "max_losses"   :
                           data.max_losses = this.value;
                           break;
                    case  "max_7day_turnover" :
                           data.max_7day_turnover = this.value;
                           break;
                    case  "max_7day_losses" :
                           data.max_7day_losses = this.value;
                           break;
                    case   "max_30day_turnover" :
                            data.max_30day_turnover = this.value;
                            break;
                    case   "max_30day_losses" :
                            data.max_30day_losses = this.value;
                            break;
                    case    "max_open_bets" :
                             data.max_open_bets = this.value;
                             break; 
                    case    "session_duration_limit"  :
                             data.session_duration_limit = this.value;
                             break;
                    case    "exclude_until"   :
                             data.exclude_until = this.value;
                             break;       

                }

            });
            
        }
         
    
        console.log("the res are ", res);

        console.log("the datas are ", data);


    };
    var sendRequest = function(response){

        var max_balance = $("#MAXCASHBAL").val(),
            max_turnover = $("#DAILYTURNOVERLIMIT").val(),
            max_losses = $("#DAILYLOSSLIMIT").val(),
            max_7day_turnover = $("#7DAYTURNOVERLIMIT").val(),
            max_7day_losses = $("#7DAYLOSSLIMIT").val(),
            max_30day_turnover = $("#30DAYTURNOVERLIMIT").val(),
            max_30day_losses = $("#30DAYLOSSLIMIT").val(),
            max_open_bets = $("#MAXOPENPOS").val(),
            session_duration_limit =  $("#SESSIONDURATION").val(),
            exclude_until = $("#EXCLUDEUNTIL").val();

        BinarySocket.send(
            {
              "set_self_exclusion": 1,
              "max_balance": 100000,
              "max_turnover": 1000,
              "max_losses": 100000,
              "max_7day_turnover": 1000,
              "max_7day_losses": 100000,
              "max_30day_turnover": 1000,
              "max_30day_losses": 100000,
              "max_open_bets": 1000,
              "session_duration_limit": 3600,
              "exclude_until": "2020-01-01"
            }
        );

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
            sendRequest(sendRequest);
        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            

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
        validateDate : validateDate,
        populateForm : populateForm,
        validateForm : validateForm,
        sendRequest: sendRequest,
        apiResponse: apiResponse
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
            SelfExlusionWS.populateForm();
        
            SelfExlusionWS.init();
        }
    };
});
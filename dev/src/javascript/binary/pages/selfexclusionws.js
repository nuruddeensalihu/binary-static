var SelfExlusionWS = (function(){
    
    "use strict";

    var $form, $error;

    var init = function(){
        $form   = $("#selfExclusion");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            validateForm($form);
            validateDate();
            sendRequest();
        });

        BinarySocket.send({"get_self_exclusion": 1});
        populateForm();

    };
    function isNormalInteger(str) {
        return /^\+?\d+$/.test(str);
    }
    var resetError = function(){
        //reset error to empty
        $("p.errorfield").each(function(ind,element){
            console.log("the val", $(element).text());
            $(element).text("");
        });
    };

    var validateForm = function(frm){
        var isValid = true;
        resetError();

        $(":text").each(function(ind,element){
            if(!isNormalInteger($(element).val()) && $(element).val())
            {
                if(!/EXCLUDEUNTIL/.test((element).attr("id")))
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



    };
    var sendRequest = function(){

    };

    var apiResponse = function(response){
        var type = response.msg_type;
        console.log("the response type is", type);
        if (type === "get_self_exclusion" || (type === "error" && "get_self_exclusion" in response.echo_req)){
            BinarySocket.send({"authorize": $.cookie('login')});
            console.log("the log is",response.get_self_exclusion);
            console.log("the log is",response.get_self_exclusion());
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
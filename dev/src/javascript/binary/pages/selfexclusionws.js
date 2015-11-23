var SelfExlusionWS = (function(){
    
    "use strict";

    var $form, $error;

    var init = function(){
        $form   = $("#selfExclusion > form");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            SelfExlusionWS.validateForm($form);
            SelfExlusionWS.sendRequest();
        });

    };
    function isNormalInteger(str) {
        return /^\+?\d+$/.test(str);
    }
    var resetError = function(){
        //reset error to empty
        $(".errorfield").each(function(value){
            value.text() = '';
        });
    };

    var validateForm = function(frm){
        var isValid = true;
        SelfExlusionWS.resetError();

        $("input[type=text]", frm).each(function(variable){
            console.log("The variable is" , variable);
            if(!isNormalInteger(variable))
            {
                $("#error"+variable.id).text("Please enter an integer value");
                isValid = false;
            }
        });

        if(!isValid)
            return false;



    };
    var populateForm = function(){

    };
    var sendRequest = function(){

    };

    var apiResponse = function(){

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
            /*
        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        if (type === "change_password" || (type === "error" && "change_password" in response.echo_req)){
                            PasswordWS.apiResponse(response);
                        }
                    }
                }
            });	*/	 
           
            // date picker for self exclusion
                
            SelfExlusionWS.datePicker();
            SelfExlusionWS.populateForm();
           // SelfExlusionWS.validateDate();
        
            SelfExlusionWS.init();
        }
    };
});
var SelfExlusionWS = (function(){

    var $form, $result;

    var init = function(){

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

    var self_exclusion_validate_date = function () {
        $('#selfExclusion').on('click', '#self_exclusion_submit', function () {
            return client_form.self_exclusion.validate_exclusion_date();
        });
    };
    
    var sendRequest = function(){

    };

    var apiResponse = function(){

    } ;

    return {
        init: init,
        self_exclusion_validate_date : self_exclusion_validate_date,
        self_exclusion_date_picker : self_exclusion_date_picker,
        sendRequest: sendRequest,
        apiResponse: apiResponse
    };



})();


pjax_config_page("account/self_exclusionws", function() {
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
                
            self_exclusion.self_exclusion_date_picker();
            self_exclusion.self_exclusion_validate_date();
        
            //PasswordWS.init();
        }
    };
});
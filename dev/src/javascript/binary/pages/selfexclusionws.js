var SelfExlusionWS = (function(){

    var $form, $result;

    var init = function(){

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
            self_exclusion_date_picker();
            self_exclusion_validate_date();
        
            //PasswordWS.init();
        }
    };
});
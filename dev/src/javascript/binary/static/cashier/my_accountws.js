var my_accountws = (function(){

    "use strict";
    var currType;

    var init = function(){
    	$("#VRT_topup_link").hide();
    	BinarySocket.send({"authorize": $.cookie('login'), "req_id": 1 });
    };

    var isAuthorized = function(response){
    	var str , bal ;
    	if(response.echo_req.req_id){
	    	if("error" in response) {
	            if("message" in response.error) {
	                console.log(message);
	            }
	            return false;
	        }
	    	else{
	    		currType = response.authorize.currency;
	    		bal =  response.authorize.balance;
	    		if(parseInt(response.req_id) === 1 && bal < 1000){
	    			str = "Deposit "+ currType + " 10000 virtual money into your account ";
	    			$("#VRT_topup_link").show();
	    			$("#VRT_topup_link a").text(text.localize(str));
	    		}
	    	}
    	}

    };

    var apiResponse = function(response){
    	var type = response.msg_type;
    	if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }
    };

    return {
    	init : init,
    	apiResponse : apiResponse

    };

})();



pjax_config_page("user/my_account", function() {
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
                        my_accountws.apiResponse(response);
                          
                    }
                }
            });	

            my_accountws.init();
        }
    };
});
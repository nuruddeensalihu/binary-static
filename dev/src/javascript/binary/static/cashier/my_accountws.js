var my_accountws = (function(){

    "use strict";
    var currType;

    var init = function(){
    	$("#VRT_topup_link").hide();
    	BinarySocket.send({"authorize": $.cookie('login'), "req_id": 1 });
    };

    var isAuthorized = function(response){
    	var str ;
    	if(response.echo_req.req_id){
	    	if("error" in response) {
	            if("message" in response.error) {
	                console.log(message);
	            }
	            return false;
	        }
	    	else{
	    		if(parseInt(response.req_id) === 1){
	    			currType = response.authorize.currency;
	    			str = "Deposit "+ currType + " 10000 virtual money into your account ";
	    			$("#VRT_topup_link").show();
	    			console.log("str is", str );
	    			console.log("link is", $("#VRT_topup_link a"));
	    			$("#VRT_topup_link a").text(text.localize(text));
	    			$("#VRT_topup_link a").html(text.localize(text));
	    			console.log("the sel value is ", $("#VRT_topup_link a").val());
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
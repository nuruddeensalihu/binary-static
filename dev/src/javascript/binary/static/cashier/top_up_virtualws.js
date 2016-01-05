var top_up_virtualws = (function(){

	"use strict";
    var account;

    var init = function(){
    	$("VRT_topup_message").show();
    	$("#VRT_topup_errorMessage").hide();
    	BinarySocket.send({"authorize": $.cookie('login'), "req_id": 1 });
    };
    var isAuthorized = function(response){
    	if(response.echo_req.req_id){
	    	if("error" in response) {
	            if("message" in response.error) {
	                $("#VRT_topup_errorMessage").show();
	                $("#VRT_topup_errorMessage").text(text.localize(response.error.message));
	                $("VRT_topup_message").hide();
	            }
	            return false;
	        }
	    	else{
	    		if(parseInt(response.req_id) === 1){
	    			account = response.authorize.loginid;
	    			console.log("we are here and account is ", account);
	    			BinarySocket.send({"topup_virtual": 1 });
	    		}
	    
	    	}
    	}

    };
    var responseMessage = function(response){
    	var str, amt , currType;
	 	if("error" in response) {
            if("message" in response.error) {
                $("#VRT_topup_errorMessage").show();
                $("VRT_topup_message").hide();
                $("#VRT_topup_errorMessage").text(text.localize(response.error.message));

            }
            return false;
        }
        else{
        	currType = response.topup_virtual.currency;
        	amt = response.topup_virtual.amount;
        	str = currType + " " + amt + " has been credited to your Virtual money account " + account ;
        	$("#VRT_topup_message p:first-child").html(text.localize(str));
        }

    };

    var apiResponse = function(response){
    	var type = response.msg_type;
    	if (type === "topup_virtual" || (type === "error" && "topup_virtual" in response.echo_req)){
           responseMessage(response);

        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }
    };

    return {
    	init : init,
    	apiResponse : apiResponse
    };
})();


pjax_config_page("cashier/top_up_virtualws", function() {
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
                        top_up_virtualws.apiResponse(response);
                          
                    }
                }
            });	
           
            top_up_virtualws.init();
        }
    };
});

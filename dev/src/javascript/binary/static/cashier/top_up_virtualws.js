var top_up_virtualws = (function(){

	"use strict";
    var account;

    var init = function(){
    	$("#VRT_topup_message").hide();
    	$("#VRT_title").hide();
    	$("#VRT_topup_errorMessage").hide();

        account = TUser.get().loginid;
        BinarySocket.send({"topup_virtual": 1 });

    };

    var responseMessage = function(response){
    	var str, amt , currType;
	 	if("error" in response) {
            if("message" in response.error) {
                $("#VRT_topup_errorMessage").show();
                $("#VRT_topup_errorMessage").text(text.localize(response.error.message));
                $("#VRT_topup_message").hide();
                $("#VRT_title").hide();

            }
            return false;
        }
        else{
        	currType = response.topup_virtual.currency;
        	amt = response.topup_virtual.amount;
        	str = currType + " " + amt + " has been credited to your Virtual money account " + account ;
        	$("#VRT_topup_message p:first-child").html(text.localize(str));
            $("#VRT_topup_message").show();
            $("#VRT_title").show();
            $("#VRT_topup_errorMessage").hide();
        }

    };

    var apiResponse = function(response){
    	var type = response.msg_type;
    	if (type === "topup_virtual" || (type === "error" && "topup_virtual" in response.echo_req)){
           responseMessage(response);

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
                },
                onauth : function(){
                    top_up_virtualws.init();
                }
            });	
        }
    };
});

var account_transferws = (function(){
    "use strict";
    var $form ;
    
    var init = function(){
        $form = $('#accountTransfer');
        $("#SuccessForm").hide();
        $("#client_message").hide();

        console.log("the form is ", $form);
        console.log("The first row is ",$('.grd-grid-12','#SuccessForm'));
    };

    var apiResponse = function(){

    };


    return {
        init : init,
        apiResponse : apiResponse
    };

})();

pjax_config_page("cashier/account_transferws", function() {
    return {
        onLoad: function() {
        	if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }
            if((/VRT/.test($.cookie('loginid')))){
                window.location.href = ("/");
            }

        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        account_transferws.apiResponse(response);
                    }
                }
            });	

            account_transferws.init();
        }
    };
});
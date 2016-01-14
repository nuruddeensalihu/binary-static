var my_accountws = (function(){

    "use strict";

    var init = function(){
    	$("#VRT_topup_link").hide();

        var currType = TUser.get().currency;
        var bal =  TUser.get().balance;

        if(bal < 1000 && (/^VRT/.test(TUser.get().loginid) === true ) ){
            var str = "Deposit "+ currType + " 10000 virtual money into your account ";
            $("#VRT_topup_link").show();
            $("#VRT_topup_link a").text(text.localize(str));
        }
    };

    return {
    	init : init

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
                onauth : function(){
                    my_accountws.init();
                }

            });
        }
    };
});
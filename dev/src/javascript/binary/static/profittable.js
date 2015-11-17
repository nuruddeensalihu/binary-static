

pjax_config_page("profit_table", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'profit_table'){
                            ProfitTableWS.profitTableHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            ProfitTableWS.init();
        },
        onUnload: function(){
            ProfitTableWS.clean();
        }
    };
});

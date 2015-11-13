var TradePage = (function(){
	
	var onLoad = function(){
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
		}		
		BinarySocket.init({
			onmessage: function(msg){
				Message.process(msg);
			},
			onclose: function(){
				processMarketUnderlying();
			},
			onauth: function(){
				if(!sessionStorage.getItem('currencies')){
					BinarySocket.send({ payout_currencies: 1 });
				}
				else{
					displayCurrencies();
				}			
			}
		});
		Price.clearFormId();
		TradingEvents.init();
		Content.populate();
		Symbols.getSymbols(1);
		if (document.getElementById('websocket_form')) {
		    addEventListenerForm();
		}
	};

	var onUnload = function(){
		forgetTradingStreams();
		BinarySocket.clear();
	};

	return {
		onLoad: onLoad,
		onUnload : onUnload
	};
})();
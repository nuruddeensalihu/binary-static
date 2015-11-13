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
			}
		});
		Price.clearFormId();
		TradingEvents.init();
		Content.populate();
		
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
			Symbols.getSymbols(1);
		}
		else {
			BinarySocket.send({ payout_currencies: 1 });
		}
		
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
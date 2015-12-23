pjax_config_page("new_account/realws", function(){
	
	return {
		onLoad: function() {
			Content.populate();
			get_residence_list('residence-disabled');
			var residenceValue = $.cookie('residence');

			$(window).load(function() {
				var title     = document.getElementById('title'),
					dobdd     = document.getElementById('dobdd'),
				    dobmm     = document.getElementById('dobmm'),
				    dobyy     = document.getElementById('dobyy'),
				    residence = document.getElementById('residence-disabled'),
				    state     = document.getElementById('address-state'),
				    question  = document.getElementById('secret-question');

				setTitles(title);
				RealAccOpeningUI.setValues(dobdd, dobmm, dobyy, state, question);
				residence.value = residenceValue;

				$('#real-form').submit(function(evt) {
					evt.preventDefault();

					if (residenceValue) {
						if (RealAccOpeningUI.checkValidity()){

							BinarySocket.init({
						        onmessage: function(msg){
						            var response = JSON.parse(msg.data);
						            if (response) {
						                var type = response.msg_type;
						                var error = response.error;

						                if (type === 'new_account_real' && !error){
						                    window.location.href = page.url.url_for('user/my_account') + '&newaccounttype=real&login=true&id=' + response.new_account_real.client_id;
						                } else if (error) {
						                	if (/multiple real money accounts/.test(error.message)){
						                		var duplicate = 'duplicate';
						                		RealAccOpeningUI.showError(duplicate);
						                	} else {
						                		RealAccOpeningUI.showError();
						                	}
						                }
						            }
						        }
						    });
						}

					} else {
						RealAccOpeningUI.showError();
					}
				});
			});
		}
	};
});

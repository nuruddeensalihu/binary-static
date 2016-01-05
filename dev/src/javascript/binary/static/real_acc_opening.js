pjax_config_page("new_account/realws", function(){

  return {
    onLoad: function() {
      if (!$.cookie('login')) {
          window.location.href = page.url.url_for('login');
          return;
      }
      Content.populate();
      var residenceValue = $.cookie('residence');
      var title     = document.getElementById('title'),
          dobdd     = document.getElementById('dobdd'),
          dobmm     = document.getElementById('dobmm'),
          dobyy     = document.getElementById('dobyy'),
          residence = document.getElementById('residence-disabled'),
          state     = document.getElementById('address-state'),
          tel       = document.getElementById('tel'),
          question  = document.getElementById('secret-question');
      RealAccOpeningUI.setValues(dobdd, dobmm, dobyy, state, question, tel, residenceValue);
      setTitles(title);

      $(window).load(function() {
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
                      var loginid = response.new_account_real.client_id;
                      var oldCookieValue = $.cookie('loginid_list');
                      $.cookie('loginid_list', loginid + ':R:E+' + oldCookieValue, {domain: document.domain.substring(3), path:'/'});
                      $.cookie('loginid', loginid, {domain: document.domain.substring(3), path:'/'});
                      page.header.show_or_hide_login_form();
                      window.location.href = page.url.url_for('user/my_account') + '&newaccounttype=real&login=true&newrealaccount';
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

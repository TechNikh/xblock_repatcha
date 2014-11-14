/*Javascript file for 3d model viewer's editing mode*/
function RePatchaXBlockEdit(runtime, element) {

  function validateColor(element, colorNumber, field){
    var _this = $(field);
    var el = $('.xblock-editor-error-message', element);
    var tinput = _this.val();

    if(tinput.match(/#[0-9a-f]{6}/ig)!== null && tinput.length <= 7)
      {
        el.html('').hide();
      }
    else
      {
        el.html('<p class="error" style="color:red;">Error: format for background color ' + colorNumber + '</p>')
          .show();
      }
  }

  /*Function for submiting input elements in edit mode*/
  $(element).on('click', '.save-button', function() {
    var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
    var el = $(element);
    var data = {
      word: el.find('input[name=word]').val(),
      location: el.find('input[id=loc]').val(),
      backgnd: el.find('input[id=bg1]').val(),
      backgnd1: el.find('input[id=bg2]').val(),
      height: el.find('input[id=vheight]').val(),
      width: el.find('input[id=vwidth]').val()
    };

    $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
      window.location.reload(false);
    });

  });

  /*Functions for validation of input for background color 1 and 2*/
  $(element).on('keyup','input#bg1',function(){
    validateColor(element, '1', this);
  });

 /* Function for canceling  */
  $(element).on('click', '.cancel-button', function() {
    runtime.notify('cancel', {});
  });
}

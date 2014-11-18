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
      git_owner: el.find('input[id=git_owner]').val(),
      git_repo: el.find('input[id=git_repo]').val(),
      git_pr_number: el.find('input[id=git_pr_number]').val()
    };

    $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
      window.location.reload(false);
    });

  });

  /*Functions for validation of input for background color 1 and 2*/
  $(element).on('keyup','input#git_owner',function(){
    //validateColor(element, '1', this);
  });

 /* Function for canceling  */
  $(element).on('click', '.cancel-button', function() {
    runtime.notify('cancel', {});
  });
}

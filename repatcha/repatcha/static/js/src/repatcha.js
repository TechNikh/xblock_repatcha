/* Javascript for RePatchaXBlock. */
function RePatchaXBlock(runtime, element) {

	/* Ajax call that gets git repatcha data from the server */
	$.ajax({
	    type: "POST",
	    url: runtime.handlerUrl(element, 'send_Data'),
	    data: JSON.stringify({requested: true}),
	    success: function(result) {
	      git_owner = JSON.parse(result.git_owner);
  
		  var diff_html = git_owner + " 2 diff --git a/tests/behat/behat.yml b/tests/behat/behat.yml";
		  $('.prettyprint', element).html(diff_html);
		  $('.prettyprint', element)
			.annotator('setupPlugins');
		  //prettyPrint();
	    }
    });  
}

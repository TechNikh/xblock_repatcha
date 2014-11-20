/* Javascript for RePatchaXBlock. */
function RePatchaXBlock(runtime, element) {
/*handler for Ajax call*/
  var dFile=runtime.handlerUrl(element,'upload_objfile');
	      var git_owner = $(".test").data("git-owner");
	      var git_repo = $(".test").data("git-repo");
	      var git_pr_number = $(".test").data("git-pr-number");
	      var reference_uri = "https://github.com/"+git_owner+"/"+git_repo+"/pull/"+git_pr_number;
	      var store_prefix = "http://repatcha.org/annotation/api";
  
		  var diff_html = "diff --git a/tests/behat/behat.yml b/tests/behat/behat.yml";
		  $('.prettyprint', element).html(diff_html);
		  $('.prettyprint', element)
			.annotator('setupPlugins')
			.annotator('addPlugin', 'Store', {
		      // The endpoint of the store on your server.
		      prefix: store_prefix,
		
		      // Attach the uri of the current page to all annotations to allow search.
		      annotationData: {
		        'uri': reference_uri
		      },
		
		      // This will perform a "search" action when the plugin loads. Will
		      // request the last 20 annotations for the current url.
		      // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
		      loadFromSearch: {
		        'limit': 20,
		        'uri': reference_uri
		      }
		    });
		  //prettyPrint();
}

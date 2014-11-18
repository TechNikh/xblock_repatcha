/* Javascript for RePatchaXBlock. */
function RePatchaXBlock(runtime, element) {


  /*capturing html element where 3d model will be drawn*/
  var base =$('.repatcha_block',element).get(0);
  var diff_html = "1 diff --git a/tests/behat/behat.yml b/tests/behat/behat.yml";
  $('.prettyprint', element).html(diff_html);
  $('.prettyprint', element)
	.annotator('setupPlugins');
  //prettyPrint();

}

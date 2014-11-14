/* Javascript for RePatchaXBlock. */
function RePatchaXBlock(runtime, element) {


  /*capturing html element where 3d model will be drawn*/
  var base =$('.repatcha_block',element).get(0);
  var diff_html = "diff --git a/tests/behat/behat.yml b/tests/behat/behat.yml\
	  index 40e6217..710169c 100644\
	  --- a/tests/behat/behat.yml\
	  +++ b/tests/behat/behat.yml\
	  @@ -24,3 +24,12 @@ qa:\
	         goutte: ~\
	         selenium2: ~\
	         base_url: https://qa-from-js.edx.org\
	  +      \
	  +dev:\
	  +  paths:\
	  +    features: 'features'\
	  +  extensions:\
	  +    Behat\MinkExtension\Extension:\
	  +      goutte: ~\
	  +      selenium2: ~\
	  +      base_url: https://dev.edx.org";
  $('.prettyprint', element).html(diff_html);
  $('.prettyprint', element)
	.annotator('setupPlugins');
  prettyPrint();

}

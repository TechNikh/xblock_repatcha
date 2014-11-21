/* Javascript for RePatchaXBlock. */
function RePatchaXBlock(runtime, element) {
/*handler for Ajax call*/
  var dFile=runtime.handlerUrl(element,'upload_objfile');
	      var git_owner = $(".test").data("git-owner");
	      var git_repo = $(".test").data("git-repo");
	      var git_pr_number = $(".test").data("git-pr-number");
	      var reference_uri = "https://github.com/"+git_owner+"/"+git_repo+"/pull/"+git_pr_number;
	      //http://www.repatcha.org/annotation/api/search?uri=https://github.com/LeaVerou/dabblet/pull/148
	      var repatcha_uri = "http://www.repatcha.org/annotation/api/search?uri="+reference_uri;
	      var store_prefix = "http://repatcha.org/annotation/api";
  
		  var diff_html = "diff --git a/tests/behat/behat.yml b/tests/behat/behat.yml";
		  
		  $("#joyride-go-btn").click(function(e) {			
			  $("#joyRideTipContent").joyride({
				  /* Options will go here */
					autoStart : true,
					modal:true
			  });
			  $('select').on('change', function() {
					//console.log(jQuery(this));
					var hint_num = $(this).attr('class');
					var correct_hint_val = $('#correct-hint-'+hint_num).val();
					//console.log(correct_hint_val);
					if(this.value == correct_hint_val){
						//alert("Correct");
						$("span#hint-status-"+hint_num).html("&#x2713;");
						$("span#hint-status-"+hint_num).css('color', 'green');
					}else{
						$("span#hint-status-"+hint_num).html("&#x2717;");
						$("span#hint-status-"+hint_num).css('color', 'red');
					}
					  //alert( this.value ); // or $(this).val()
				});
				$("input[value='Show Answer in detail']").click(function(e) {
					var hint_num = $(this).attr('class');
					$("span#step-answer-"+hint_num).show();
					$(this).hide();
				});
		  });
		  $('.prettyprint', element).html(diff_html);
		  Annotator.Plugin.CustomHighlighter = function(element) {
			    var myPlugin = {};
			    myPlugin.pluginInit = function() {
			        myPlugin.annotator.subscribe("annotationsLoaded", function(arrayOfAnnotations) {
			            //console.log("annotations loaded");
			            //console.log(arrayOfAnnotations);
			            $.each(arrayOfAnnotations, function(i) {
			                //console.log("processing annotation #" + i);
			                var annotation = arrayOfAnnotations[i];
			                //console.log(annotation);
			                $.each(annotation.highlights, function(j) {
			                    //console.log("\tprocessing highlight #" +j);
			                    var highlight = annotation.highlights[j];
			                    $(highlight).addClass('annotator-hl-'+annotation.id);
			                });
			            });
			        });
			        myPlugin.annotator.subscribe("annotationCreated", function(annotation) {
			            //console.log(annotation);
			        });
			    };
			    return myPlugin;
			};
			
		  Annotator.Plugin.Geolocation = (function(_super) {
				__extends(Geolocation, _super);

				function Geolocation() {
					this.pluginSubmit = __bind(this.pluginSubmit, this);
					this.updateViewer = __bind(this.updateViewer, this);
					_ref = Geolocation.__super__.constructor.apply(this, arguments);
					return _ref;
				}

				Geolocation.prototype.field = null;

				Geolocation.prototype.input = null;

				Geolocation.prototype.pluginInit = function() {
					//console.log("Geolocation-pluginInit");
					//Check that annotator is working
					if (!Annotator.supported()) {
						return;
					}
					
					//-- Editor
					this.field = this.annotator.editor.addField({
						type: 'input', //options (textarea,input,select,checkbox)
						label: Annotator._t('Short text'),
						submit: this.pluginSubmit,
					});
					
					//Set an event to catch the geolocation
					var self = this;
					/*$(this.field).mouseup(function() {
						console.log("mouseup"); //set the position in the plugin
					});*/
					
					//-- Viewer
					var newview = this.annotator.viewer.addField({
						load: this.updateViewer,
					});

					return this.input = $(this.field).find(':input');
				};
				
				// New JSON for the database
				Geolocation.prototype.pluginSubmit = function(field, annotation) {
					var hint_text = $(field).find('input:first').val();
					//alert(hint_text)
						if (typeof annotation.hint=='undefined')
							annotation.hint='';
						annotation.hint = hint_text;
			            this.publish('newhinttext', [field, annotation]);
					return annotation.hint;
				};
				
				//Viewer
				Geolocation.prototype.updateViewer = function(field, annotation) {
					//console.log("updateViewer");
					$(field).remove();//remove the empty div created by annotator

					var hint = typeof annotation.hint!='undefined';
					if(hint){
						var fieldControl = $(this.annotator.viewer.element.find('.annotator-controls')).parent();
						//fieldControl.prepend(annotation.hint);
					}
				};
				
				return Geolocation;

			})(Annotator.Plugin);
		  $('.prettyprint', element)
			.annotator('setupPlugins')
			.annotator("addPlugin", "Geolocation")
			.annotator("addPlugin", "Tags")
			.annotator("addPlugin", "CustomHighlighter")
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
		  $.getJSON( repatcha_uri, function( data ) {
              console.log(data);
              var joyride_html = '<ol id="joyRideTipContent">';
              hint_dropdown_html = '<span style="color: white;">Select appropriate reason for this change.</span> <select class=""><option value="">- Please select -</option>';
              $.each( data.rows, function( key, val ) {
                hint_dropdown_html += '<option value="'+val.hint+'">'+val.hint+'</option>';
              });
              hint_dropdown_html += '</select><span class="hint-status" id=""></span>';
              $.each( data.rows, function( key, val ) {
                      var rid = val.id;
                      var step_hint = val.hint;
                      var step_answer = val.text;
                      var step_answer_html = '<span class="" id="step-answer-'+rid+'" style="display:none">'+step_answer+'</span><input type="button" value="Show Answer in detail" class="'+rid+'" />';
                      hint_dropdown_html_new = hint_dropdown_html.replace('<select class="">', '<select class="'+rid+'">');
                      hint_dropdown_html_new = hint_dropdown_html_new.replace('<span class="hint-status" id="">', '<span class="hint-status" id="hint-status-'+rid+'">')+"<br/>";
                      joyride_html += '<li data-class="annotator-hl-'+rid+'"><p>'+hint_dropdown_html_new+step_answer_html+'<input type="hidden" value="'+step_hint+'" id="correct-hint-'+rid+'"></p></li>';
              });
              joyride_html += '</ol>';
              old_html = $('.prettyprint', element).html();
              $('.prettyprint', element).html(old_html + joyride_html);
          });

}

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
		  var joyride_html = '<ol id="joyRideTipContent">';
		  $.getJSON( repatcha_uri, function( data ) {
			  console.log(data);
			  $.each( data, function( key, val ) {
				  var rid = val.id;
				  joyride_html += '<li data-class="annotator-hl-'+rid+'"><p>'+val.text+'</p></li>';
			  });
		  });
		  joyride_html += '</ol>';
		  diff_html += joyride_html;
		  
		  $("#joyride-go-btn").click(function(e) {
				$("#joyRideTipContent").joyride({
			      /* Options will go here */
					autoStart : true,
					modal:true
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
}

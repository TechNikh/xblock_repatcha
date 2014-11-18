"""rePatcha XBlock is a XBlock where students can see and interact with code patches"""

import pkg_resources
import os
import httplib2

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment
from django.template import Context,Template,RequestContext
from django.http import HttpResponse
from webob.response import Response


class RePatchaXBlock(XBlock):

    display_name = String(display_name="Display name", default="repatcha", scope=Scope.settings , help="Name of component in edxplatform")
    title = String(default="Title", scope=Scope.content, help="Enter Title")
    git_owner = String(default="edx", scope=Scope.content, help="git owner")
    git_repo = String(default="edx-platform", scope=Scope.content, help="git repo")
    git_pr_number = Integer(default=123 ,scope=Scope.content, help="git pr number")


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")


    def student_view(self, context=None):
        """
        The primary view of the RePatchaXBlock, shown to students
        when viewing courses.
        """

        template_str = self.resource_string("static/html/repatcha.html")
        template = Template(template_str)
        html = template.render(Context({
            'git_owner':self.git_owner,
            'lword':self.title,
            'git_repo':self.git_repo,
            'git_pr_number':self.git_pr_number
            }))

        frag = Fragment(html.format(self=self))
        frag.add_javascript(self.resource_string("static/js/lib/annotator/annotator-full.min.js"))
        frag.add_css(self.resource_string("static/js/lib/annotator/annotator.min.css"))
        
        """
        frag.add_javascript(self.resource_string("static/js/lib/google-code-prettify/src/prettify.js"))
        frag.add_css(self.resource_string("static/js/lib/google-code-prettify/src/prettify.css"))
        """

        frag.add_css(self.resource_string("static/css/repatcha.css"))
        frag.add_javascript(self.resource_string("static/js/src/repatcha.js"))
        frag.initialize_js('RePatchaXBlock')
        return frag

    problem_view = student_view
   # studio_view = student_view


    def studio_view(self,context):
        """
        View for creating display the edit view  in Studio
        """

        html_ed_str=self.resource_string("static/html/repatcha_edit.html")
        word = self.title or ''
        frag = Fragment(html_ed_str.format(ltitle=self.title,git_owner=self.git_owner,git_repo=self.git_repo,git_pr_number=self.git_pr_number))
        frag.add_javascript(self.resource_string("static/js/src/repatcha_edit.js"))
        frag.initialize_js('RePatchaXBlockEdit')
        return frag

    @XBlock.json_handler
    def studio_submit(self,data,suffix=''):
        """
        Called when submitting the form in Studio.
        """
        self.title = data.get('word')
        self.git_owner =  data.get('git_owner')
        self.git_repo = data.get('git_repo')
        self.git_pr_number = data .get('git_pr_number')

        return {'result':'success'}

    @XBlock.handler
    def upload_objfile(self,request,suffix=''):
        """
        Called when opening obj file
        """
        conn = httplib2.Http()
        if request.method == "GET":
            url = request.params['url']
            resp,content = conn.request(url,request.method)
            return Response(app_iter=content,content_type="text/plain")



    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("RePatchaXBlock",
             """<vertical_demo>
                <repatcha/>
                <repatcha/>
                </vertical_demo>
             """),
        ]






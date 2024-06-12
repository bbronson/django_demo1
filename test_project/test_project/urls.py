"""
URL configuration for test_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os, json
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView, View
from django.http import HttpResponse

import logging
logger = logging.getLogger(__name__)
logging.basicConfig(filename='main.log', encoding='utf-8', level=logging.DEBUG)

"""
If this was for production, we would follow the steps here:
https://www.geeksforgeeks.org/interface-python-with-an-sql-database/?ref=ml_lbp
and create a DB to store and retrive the data from but that is overkill
for a simple tech demo take home assignment. 
The reason for using a DB would be improved performance
rather than reading and writing to disk with a JSON
"""

class ListView(View):

    http_method_names = ['get']

    def get(self, request):
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)),
            "test_project/team_data.json"),"r") as file:
            jsonData = json.load(file)
        data = json.dumps(jsonData, indent=4)
        logger.info('getList API was called successfully')
        return HttpResponse(data, content_type='application/json')
    
class MemberView(View):

    http_method_names = ['post','put','delete']

    def doSet(self, json_body):
        f = open(os.path.join(os.path.dirname(os.path.dirname(__file__)),
            "test_project/team_data.json"),"w")
        data = json.dumps(json_body['data'], indent=4)
        f.write(data)
        f.close()
        return data

    def put(self, request):
        json_body = json.loads(request.body)
        data = self.doSet(json_body)
        logger.info('User id %s edited successfully', json_body['id'])
        """
            If we had a DB then this would differ greatly from the post and delete functions
        """
        return HttpResponse(data, content_type='application/json')
    
    def post(self, request):
        json_body = json.loads(request.body)
        data = self.doSet(json_body)
        logger.info('User id %s added successfully',  json_body['id'])
        return HttpResponse(data, content_type='application/json')

    def delete(self, request):
        json_body = json.loads(request.body)
        data = self.doSet(json_body)
        logger.info('User id %s deleted successfully',  json_body['id'])
        return HttpResponse(data, content_type='application/json')
    



urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', TemplateView.as_view(template_name='main.html')),
    path('getList/', ListView.as_view(), name='get-list-api'),
    path('editMembers/', MemberView.as_view(), name='get-list-api'),
]





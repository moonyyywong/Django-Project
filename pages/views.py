# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
# -*- coding: utf-8 -*-

from django.views.generic import TemplateView

import os
import json
from django.http import JsonResponse

class HomePageView(TemplateView):
    template_name = 'home.html'

def fetch_data(request):
    # Get the path to the metafiles folder
    path = os.getcwd() + '/metafiles/'
    files = []
    # Loop over all the files in the folder
    for filename in os.listdir(path):
        file_ = open(path + filename)
        data = file_.read()
        file_.close()

        # Loads the data as json
        data_json = json.loads(data)
        # Adds data_json to the files
        files.extend(data_json)
    # Returns the files 
    return JsonResponse({'files': files})

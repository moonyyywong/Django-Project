from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.HomePageView.as_view(), name = 'home'),
    url(r'^fetchdata$', views.fetch_data, name = 'data'),
]

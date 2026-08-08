
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
# from django.http import HttpResponse


# def root_view(request):
#     return HttpResponse(
#     "<h1>Welcome to the Expense Tracker API</h1>"
#     "<p>Visit <a href='/api/docs/'>API Documentation</a> for more information.</p>"
#     )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/auth/', include('accounts.urls')),  # Added for authentication endpoints
    path('api/', include('expenses.urls')),
    # path("", root_view, name='root'),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui-alt'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import(
    CategoryViewSet, 
    TransactionViewSet, 
    BudgetConfigView, 
    AnalyticsSummaryView,
   
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = router.urls + [

    
    path('budget/', BudgetConfigView.as_view(), name='budget-config'),
    path('analytics/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
]

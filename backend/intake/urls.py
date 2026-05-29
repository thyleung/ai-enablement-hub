from django.urls import path
from .views import IntakeRequestListCreateView, review_request

urlpatterns = [
    path('requests/', IntakeRequestListCreateView.as_view(), name='intake-list-create'),
    path('review-request/', review_request, name='review-request'),
]

from rest_framework import serializers
from .models import IntakeRequest


class IntakeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeRequest
        fields = [
            'id',
            'name',
            'contact_email',
            'department',
            'project_title',
            'business_problem',
            'desired_outcome',
            'systems_involved',
            'sensitivity_level',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class IntakeRequestListSerializer(serializers.ModelSerializer):
    """Serializer for list views -- includes detail fields for expandable rows."""
    class Meta:
        model = IntakeRequest
        fields = [
            'id',
            'name',
            'contact_email',
            'department',
            'project_title',
            'business_problem',
            'desired_outcome',
            'systems_involved',
            'sensitivity_level',
            'status',
            'created_at',
        ]


class ReviewRequestSerializer(serializers.Serializer):
    """Serializer for the AI review draft endpoint."""
    name = serializers.CharField(required=False, allow_blank=True, default='')
    contact_email = serializers.EmailField(required=False, allow_blank=True, default='')
    department = serializers.CharField(required=False, allow_blank=True, default='')
    project_title = serializers.CharField(required=False, allow_blank=True, default='')
    business_problem = serializers.CharField(required=False, allow_blank=True, default='')
    desired_outcome = serializers.CharField(required=False, allow_blank=True, default='')
    systems_involved = serializers.CharField(required=False, allow_blank=True, default='')
    sensitivity_level = serializers.CharField(required=False, allow_blank=True, default='')

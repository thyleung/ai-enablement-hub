from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import IntakeRequest
from .serializers import (
    IntakeRequestSerializer,
    IntakeRequestListSerializer,
    ReviewRequestSerializer,
)


class IntakeRequestListCreateView(APIView):
    def get(self, request):
        requests = IntakeRequest.objects.all()
        serializer = IntakeRequestListSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IntakeRequestSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                IntakeRequestSerializer(instance).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def review_request(request):
    serializer = ReviewRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    suggestions = _generate_suggestions(data)

    return Response({
        'suggestions': suggestions,
        'encouragement': '',
    })


def _generate_suggestions(data: dict) -> list[dict]:
    suggestions = []

    problem = data.get('business_problem', '').strip()
    outcome = data.get('desired_outcome', '').strip()
    systems = data.get('systems_involved', '').strip()
    sensitivity = data.get('sensitivity_level', '').strip()

    if problem and len(problem) < 120:
        suggestions.append({
            'type': 'improve',
            'field': 'business_problem',
            'text': 'Describe how often this occurs and which teams or users are affected.',
        })

    if outcome and len(outcome) < 80:
        suggestions.append({
            'type': 'improve',
            'field': 'desired_outcome',
            'text': 'Clarify what a measurable or observable improvement would look like.',
        })

    if not systems:
        suggestions.append({
            'type': 'optional',
            'field': 'systems_involved',
            'text': 'Identify any systems, data sources, or platforms this would need to integrate with.',
        })

    if not sensitivity:
        suggestions.append({
            'type': 'optional',
            'field': 'sensitivity_level',
            'text': 'Select a sensitivity level to ensure appropriate data handling from the start.',
        })

    return suggestions[:3]

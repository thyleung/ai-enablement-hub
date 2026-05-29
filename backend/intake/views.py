import random
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
    """
    GET  /api/requests/   — list all submitted requests
    POST /api/requests/   — create a new intake request
    """

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
    """
    POST /api/review-request/
    Accepts a form draft and returns supportive AI-style guidance.
    This is a mock implementation — no real LLM required.
    """
    serializer = ReviewRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    suggestions = _generate_suggestions(data)

    return Response({
        'suggestions': suggestions,
        'encouragement': _pick_encouragement(data),
    })


def _generate_suggestions(data: dict) -> list[dict]:
    """Generate context-aware guidance based on the draft form data."""
    suggestions = []

    has_problem = bool(data.get('business_problem', '').strip())
    has_outcome = bool(data.get('desired_outcome', '').strip())
    has_systems = bool(data.get('systems_involved', '').strip())
    has_sensitivity = bool(data.get('sensitivity_level', '').strip())
    has_title = bool(data.get('project_title', '').strip())
    has_department = bool(data.get('department', '').strip())

    if not has_problem:
        suggestions.append({
            'type': 'missing',
            'field': 'business_problem',
            'text': (
                'Try to describe the problem in 1–2 sentences. '
                'You don\'t need technical language — just explain what\'s slowing your team down.'
            ),
        })
    elif len(data.get('business_problem', '')) < 80:
        suggestions.append({
            'type': 'improve',
            'field': 'business_problem',
            'text': (
                'Your problem statement is a good start. Adding a bit more context — '
                'like how often this occurs or who is affected — will help the team prioritize.'
            ),
        })

    if not has_outcome:
        suggestions.append({
            'type': 'missing',
            'field': 'desired_outcome',
            'text': (
                'What would "done" look like for this project? '
                'Even a rough description helps the enablement team scope the work.'
            ),
        })

    if not has_systems:
        suggestions.append({
            'type': 'optional',
            'field': 'systems_involved',
            'text': (
                'If you know which tools, platforms, or data sources this touches, '
                'adding them helps route your request to the right people faster.'
            ),
        })

    if not has_sensitivity:
        suggestions.append({
            'type': 'optional',
            'field': 'sensitivity_level',
            'text': (
                'Selecting a sensitivity level — even "Internal" — helps the team '
                'ensure the right data handling practices are applied from the start.'
            ),
        })

    if has_problem and has_outcome and has_systems and has_sensitivity:
        suggestions.append({
            'type': 'ready',
            'field': None,
            'text': (
                'Your request looks comprehensive. '
                'The team will have everything they need to begin the intake review.'
            ),
        })
    elif has_problem and has_outcome:
        suggestions.append({
            'type': 'info',
            'field': None,
            'text': (
                'You\'re covering the essentials well. '
                'The optional fields above will help, but this is ready to submit as-is.'
            ),
        })

    return suggestions


def _pick_encouragement(data: dict) -> str:
    filled = sum([
        bool(data.get('business_problem', '').strip()),
        bool(data.get('desired_outcome', '').strip()),
        bool(data.get('systems_involved', '').strip()),
        bool(data.get('sensitivity_level', '').strip()),
    ])

    if filled == 0:
        return (
            'You\'re just getting started — that\'s completely fine. '
            'Fill in what you know and we\'ll help shape the rest.'
        )
    elif filled <= 2:
        return (
            'You\'re off to a good start. '
            'You don\'t need all the answers yet — we\'ll work through the details together.'
        )
    elif filled == 3:
        return (
            'This is shaping up well. '
            'Adding the final details will make this request very easy to action.'
        )
    else:
        return (
            'Your request is thorough and well-prepared. '
            'The AI Enablement team will have a clear picture from the start.'
        )

from django.db import models


class IntakeRequest(models.Model):
    class SensitivityLevel(models.TextChoices):
        PUBLIC = 'public', 'Public'
        INTERNAL = 'internal', 'Internal'
        CONFIDENTIAL = 'confidential', 'Confidential'
        RESTRICTED = 'restricted', 'Restricted'

    class Status(models.TextChoices):
        SUBMITTED = 'submitted', 'Submitted'
        UNDER_REVIEW = 'under_review', 'Under Review'
        SENT_TO_JIRA = 'sent_to_jira', 'Sent to Jira'
        APPROVED = 'approved', 'Approved'
        DECLINED = 'declined', 'Declined'

    # Contact Information
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    department = models.CharField(max_length=255)

    # Request Details
    project_title = models.CharField(max_length=500)
    business_problem = models.TextField()
    desired_outcome = models.TextField()

    # Optional Context
    systems_involved = models.TextField(blank=True, default='')
    sensitivity_level = models.CharField(
        max_length=20,
        choices=SensitivityLevel.choices,
        blank=True,
        default=''
    )

    # Internal fields
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project_title} — {self.name} ({self.department})"

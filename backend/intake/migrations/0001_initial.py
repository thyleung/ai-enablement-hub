from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='IntakeRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('contact_email', models.EmailField(max_length=254)),
                ('department', models.CharField(max_length=255)),
                ('project_title', models.CharField(max_length=500)),
                ('business_problem', models.TextField()),
                ('desired_outcome', models.TextField()),
                ('systems_involved', models.TextField(blank=True, default='')),
                ('sensitivity_level', models.CharField(
                    blank=True,
                    choices=[
                        ('public', 'Public'),
                        ('internal', 'Internal'),
                        ('confidential', 'Confidential'),
                        ('restricted', 'Restricted'),
                    ],
                    default='',
                    max_length=20,
                )),
                ('status', models.CharField(
                    choices=[
                        ('submitted', 'Submitted'),
                        ('under_review', 'Under Review'),
                        ('sent_to_jira', 'Sent to Jira'),
                        ('approved', 'Approved'),
                        ('declined', 'Declined'),
                    ],
                    default='submitted',
                    max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]

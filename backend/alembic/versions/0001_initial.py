"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2025-09-17 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg


# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    userrole = sa.Enum('student', 'faculty', 'admin', name='userrole')
    userrole.create(op.get_bind(), checkfirst=True)

    facilitytype = sa.Enum('classroom', 'laboratory', 'library', 'hostel', name='facilitytype')
    facilitytype.create(op.get_bind(), checkfirst=True)

    questiontype = sa.Enum('likert', 'text', 'mcq', name='questiontype')
    questiontype.create(op.get_bind(), checkfirst=True)

    targettype = sa.Enum('faculty', 'facility', name='targettype')
    targettype.create(op.get_bind(), checkfirst=True)

    op.create_table(
        'departments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False, unique=True, index=True),
    )

    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('role', userrole, nullable=False, server_default='student'),
        sa.Column('department_id', sa.Integer(), sa.ForeignKey('departments.id'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        'faculties',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('department_id', sa.Integer(), sa.ForeignKey('departments.id'), nullable=True),
    )

    op.create_table(
        'facilities',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False, index=True),
        sa.Column('type', facilitytype, nullable=False),
        sa.Column('location', sa.String(length=255), nullable=True),
    )

    op.create_table(
        'survey_templates',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False, unique=True),
        sa.Column('target_type', targettype, nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        'survey_questions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('survey_templates.id'), nullable=False, index=True),
        sa.Column('text', sa.String(length=1000), nullable=False),
        sa.Column('type', questiontype, nullable=False),
        sa.Column('options', pg.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('weight', sa.Integer(), nullable=True),
    )

    op.create_table(
        'survey_assignments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('survey_templates.id'), nullable=False, index=True),
        sa.Column('target_id', sa.Integer(), nullable=False, index=True),
        sa.Column('target_type', targettype, nullable=False),
        sa.Column('start_at', sa.DateTime(), nullable=True),
        sa.Column('end_at', sa.DateTime(), nullable=True),
        sa.Column('anonymity_min_responses', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
    )

    op.create_table(
        'feedback_responses',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('survey_templates.id'), nullable=False, index=True),
        sa.Column('assignment_id', sa.Integer(), sa.ForeignKey('survey_assignments.id'), nullable=False, index=True),
        sa.Column('target_id', sa.Integer(), nullable=False, index=True),
        sa.Column('target_type', targettype, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('sentiment_score', sa.Numeric(5, 4), nullable=True),
    )

    op.create_table(
        'feedback_answers',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('response_id', sa.Integer(), sa.ForeignKey('feedback_responses.id'), nullable=False, index=True),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('survey_questions.id'), nullable=False),
        sa.Column('numeric_value', sa.Integer(), nullable=True),
        sa.Column('text_value', sa.String(length=5000), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('feedback_answers')
    op.drop_table('feedback_responses')
    op.drop_table('survey_assignments')
    op.drop_table('survey_questions')
    op.drop_table('survey_templates')
    op.drop_table('facilities')
    op.drop_table('faculties')
    op.drop_table('users')
    op.drop_table('departments')

    targettype = sa.Enum(name='targettype')
    questiontype = sa.Enum(name='questiontype')
    facilitytype = sa.Enum(name='facilitytype')
    userrole = sa.Enum(name='userrole')
    targettype.drop(op.get_bind(), checkfirst=True)
    questiontype.drop(op.get_bind(), checkfirst=True)
    facilitytype.drop(op.get_bind(), checkfirst=True)
    userrole.drop(op.get_bind(), checkfirst=True)


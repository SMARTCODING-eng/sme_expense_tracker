from django.db import models

from django.db import models
import uuid

class Category(models.Model):
    TYPE_CHOICES = (
        ('expense', 'Expense'),
        ('income', 'Income'),
        ('both', 'Both'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='DollarSign')
    color = models.CharField(max_length=20, default='#64748b')
    bg_color = models.CharField(max_length=20, default='#f1f5f9')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.type})"


class Transaction(models.Model):
    TYPE_CHOICES = (
        ('expense', 'Expense'),
        ('income', 'Income'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('card', 'Card'),
        ('cash', 'Cash'),
        ('transfer', 'Bank Transfer'),
        ('digital_wallet', 'Digital Wallet'),
    )

    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    date = models.DateField()
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD_CHOICES, default='card')
    notes = models.TextField(blank=True, default='')
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - ${self.amount} ({self.date})"


class BudgetConfig(models.Model):
    monthly_total_budget = models.DecimalField(max_digits=12, decimal_places=2, default=3500.00)
    currency_symbol = models.CharField(max_length=5, default='₦')
    currency_code = models.CharField(max_length=5, default='NGN')
    category_budgets = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Budget Config ({self.currency_symbol}{self.monthly_total_budget})"


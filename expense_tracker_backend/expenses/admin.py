from django.contrib import admin

from django.contrib import admin
from .models import Category, Transaction, BudgetConfig

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'color', 'icon')
    list_filter = ('type',)
    search_fields = ('name', 'id')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'amount', 'type', 'category', 'date', 'payment_method', 'is_recurring')
    list_filter = ('type', 'category', 'payment_method', 'is_recurring', 'date')
    search_fields = ('title', 'notes')
    date_hierarchy = 'date'

@admin.register(BudgetConfig)
class BudgetConfigAdmin(admin.ModelAdmin):
    list_display = ('monthly_total_budget', 'currency_symbol', 'currency_code', 'updated_at')

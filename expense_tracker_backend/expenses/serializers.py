from rest_framework import serializers
from .models import Category, Transaction, BudgetConfig

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    category_id = serializers.CharField(source='category.id', write_only=True, required=False, allow_null=True)

    class Meta:
        model = Transaction
        fields = [
            'id',
            'title',
            'amount',
            'type',
            'category',
            'category_id',
            'category_detail',
            'date',
            'payment_method',
            'notes',
            'is_recurring',
            'created_at',
            'updated_at',
        ]

    def create(self, validated_data):
        category_data = validated_data.pop('category', None)
        category_id = category_data.get('id') if category_data else None
        
        if category_id:
            try:
                cat = Category.objects.get(id=category_id)
                validated_data['category'] = cat
            except Category.DoesNotExist:
                pass

        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        if category_data and 'id' in category_data:
            try:
                cat = Category.objects.get(id=category_data['id'])
                instance.category = cat
            except Category.DoesNotExist:
                pass

        return super().update(instance, validated_data)


class BudgetConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetConfig
        fields = '__all__'

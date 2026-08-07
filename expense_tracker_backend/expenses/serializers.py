from rest_framework import serializers
from .models import Category, Transaction, BudgetConfig
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name']

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name if  full_name else obj.username

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name']

    # This method is called when the serializer is validated and creates a new user instance.
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.validationError("Email already exists.")

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        full_name = validated_data.get('full_name', '')

        first_name, last_name = '', ''

        if full_name:
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            if len(parts) > 1:
                last_name = parts[1]
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)


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

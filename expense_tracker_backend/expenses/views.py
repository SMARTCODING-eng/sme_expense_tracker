from django.shortcuts import render


from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Q
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Category, Transaction, BudgetConfig
from .serializers import(
    CategorySerializer, 
    TransactionSerializer, 
    BudgetConfigSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
)

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user =serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserRegistrationSerializer(user).data
            return Response({
                'token' : token.key,
                'user' : user_data,
                'message' : 'Account created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user_obj = User.objects.get(email_iexact=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserRegistrationSerializer(user).data
                return Response({
                    'token': token.key,
                    'user': user_data,
                    'message': 'login successful'
                })
            return Response({'detail': 'Invalid emial or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
    
class CurrentUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({'user': UserRegistrationSerializer(request.user).data})
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


DEFAULT_CATEGORIES = [
    {'id': 'food', 'name': 'Food & Dining', 'icon': 'Utensils', 'color': '#f97316', 'bg_color': '#ffedd5', 'type': 'expense'},
    {'id': 'groceries', 'name': 'Groceries', 'icon': 'ShoppingBag', 'color': '#10b981', 'bg_color': '#d1fae5', 'type': 'expense'},
    {'id': 'housing', 'name': 'Housing & Rent', 'icon': 'Home', 'color': '#6366f1', 'bg_color': '#e0e7ff', 'type': 'expense'},
    {'id': 'transport', 'name': 'Transportation', 'icon': 'Car', 'color': '#06b6d4', 'bg_color': '#cffaff', 'type': 'expense'},
    {'id': 'utilities', 'name': 'Utilities & Bills', 'icon': 'Zap', 'color': '#eab308', 'bg_color': '#fef9c3', 'type': 'expense'},
    {'id': 'entertainment', 'name': 'Entertainment', 'icon': 'Film', 'color': '#ec4899', 'bg_color': '#fce7f3', 'type': 'expense'},
    {'id': 'shopping', 'name': 'Shopping', 'icon': 'ShoppingBag', 'color': '#a855f7', 'bg_color': '#f3e8ff', 'type': 'expense'},
    {'id': 'healthcare', 'name': 'Health & Medical', 'icon': 'HeartPulse', 'color': '#ef4444', 'bg_color': '#fee2e2', 'type': 'expense'},
    {'id': 'education', 'name': 'Education & Courses', 'icon': 'GraduationCap', 'color': '#3b82f6', 'bg_color': '#dbeafe', 'type': 'expense'},
    {'id': 'salary', 'name': 'Salary & Wages', 'icon': 'Wallet', 'color': '#16a34a', 'bg_color': '#dcfce7', 'type': 'income'},
    {'id': 'freelance', 'name': 'Freelance & Side Gig', 'icon': 'Briefcase', 'color': '#0d9488', 'bg_color': '#ccfbf1', 'type': 'income'},
    {'id': 'investments', 'name': 'Investments & Dividends', 'icon': 'TrendingUp', 'color': '#2563eb', 'bg_color': '#dbeafe', 'type': 'income'},
    {'id': 'other_income', 'name': 'Other Income', 'icon': 'Coins', 'color': '#059669', 'bg_color': '#d1fae5', 'type': 'income'},
    {'id': 'other_expense', 'name': 'Other Expense', 'icon': 'MoreHorizontal', 'color': '#64748b', 'bg_color': '#f1f5f9', 'type': 'expense'},
]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        # Auto-seed default categories if empty
        if not Category.objects.exists():
            for cat in DEFAULT_CATEGORIES:
                Category.objects.create(**cat)
        return super().list(request, *args, **kwargs)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.all()
        type_param = self.request.query_params.get('type')
        category_param = self.request.query_params.get('category')
        search_param = self.request.query_params.get('search')
        sort_by = self.request.query_params.get('sort_by', 'date_desc')

        if type_param and type_param != 'all':
            qs = qs.filter(type=type_param)

        if category_param and category_param != 'all':
            qs = qs.filter(category_id=category_param)

        if search_param:
            qs = qs.filter(
                Q(title__icontains=search_param) |
                Q(notes__icontains=search_param) |
                Q(category__name__icontains=search_param)
            )

        if sort_by == 'date_desc':
            qs = qs.order_by('-date', '-created_at')
        elif sort_by == 'date_asc':
            qs = qs.order_by('date', 'created_at')
        elif sort_by == 'amount_desc':
            qs = qs.order_by('-amount')
        elif sort_by == 'amount_asc':
            qs = qs.order_by('amount')

        return qs


class BudgetConfigView(APIView):
    def get(self, request):
        config = BudgetConfig.objects.first()
        if not config:
            config = BudgetConfig.objects.create(
                monthly_total_budget=3500.00,
                currency_symbol='₦',
                currency_code='NGN',
                category_budgets={
                    'food': 600,
                    'groceries': 500,
                    'housing': 1200,
                    'transport': 300,
                    'utilities': 250,
                    'entertainment': 200,
                    'shopping': 350,
                    'healthcare': 150,
                }
            )
        serializer = BudgetConfigSerializer(config)
        return Response(serializer.data)

    def put(self, request):
        config = BudgetConfig.objects.first()
        if not config:
            serializer = BudgetConfigSerializer(data=request.data)
        else:
            serializer = BudgetConfigSerializer(config, data=request.data, partial=True)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnalyticsSummaryView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        
        total_income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        net_balance = total_income - total_expense

        # Category breakdown
        category_breakdown = []
        categories = Category.objects.filter(type__in=['expense', 'both'])
        for cat in categories:
            cat_spent = transactions.filter(type='expense', category=cat).aggregate(Sum('amount'))['amount__sum'] or 0
            if cat_spent > 0:
                category_breakdown.append({
                    'id': cat.id,
                    'name': cat.name,
                    'amount': float(cat_spent),
                    'color': cat.color,
                })

        return Response({
            'total_income': float(total_income),
            'total_expense': float(total_expense),
            'net_balance': float(net_balance),
            'category_breakdown': category_breakdown,
       })
 
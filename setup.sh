#!/bin/bash

# setup.sh
# NetOne Server Room Temperature Monitoring System
# Automated setup, migration, and run script.

echo "==========================================================="
echo "NetOne Server Room Temperature Monitoring Backend Setup"
echo "==========================================================="

# Ensure we are in the correct directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Activate Virtual Environment
if [ -d "venv" ]; then
    echo "[*] Activating existing virtual environment..."
    source venv/bin/activate
else
    echo "[!] Virtual environment 'venv' not found! Please run 'python3 -m venv venv' first."
    exit 1
fi

# 2. Make Migrations and Migrate Database
echo "[*] Making database migrations..."
python manage.py makemigrations monitoring
python manage.py migrate

# 3. Create Superuser (Non-interactive)
echo "[*] Ensuring admin superuser exists..."
# Using Django shell to create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@netone.co.zw', 'adminpassword123')
    print('[-] Superuser created: admin / adminpassword123')
else:
    print('[-] Superuser already exists.')
"

# 4. Start the Django Development Server
echo "[*] Starting the development server on http://127.0.0.1:8000/"
echo "[*] Access the API at: http://127.0.0.1:8000/api/monitoring/logs/"
echo "[*] Access the Admin Dashboard at: http://127.0.0.1:8000/admin/"
echo "==========================================================="

python manage.py runserver 0.0.0.0:8000

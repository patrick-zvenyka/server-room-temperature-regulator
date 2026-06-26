import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from monitoring.models import ServerRackSensorLog

class Command(BaseCommand):
    help = 'Simulates temperature and humidity variations under different loads and environmental conditions.'

    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=1, help='Number of days of data to simulate')
        parser.add_argument('--racks', type=int, default=2, help='Number of racks to simulate')

    def handle(self, *args, **options):
        days = options['days']
        num_racks = options['racks']
        
        now = timezone.now()
        start_time = now - timedelta(days=days)
        
        self.stdout.write(self.style.SUCCESS(f'Simulating {days} days of data for {num_racks} racks...'))
        
        racks = [f'RACK-{i+1:02d}' for i in range(num_racks)]
        
        current_time = start_time
        
        # State tracking for each rack
        state = {
            rack: {
                'temp': 22.0, 
                'humidity': 50.0,
                'load': 'NORMAL', # NORMAL, HIGH, IDLE
                'hvac_status': 'ON' # ON, FAILURE
            } for rack in racks
        }
        
        total_records = 0
        
        while current_time <= now:
            for rack in racks:
                rack_state = state[rack]
                
                # Randomly change states occasionally
                if random.random() < 0.05: # 5% chance to change load
                    rack_state['load'] = random.choices(['IDLE', 'NORMAL', 'HIGH'], weights=[0.2, 0.6, 0.2])[0]
                
                if random.random() < 0.01: # 1% chance HVAC failure
                    rack_state['hvac_status'] = 'FAILURE'
                elif random.random() < 0.1 and rack_state['hvac_status'] == 'FAILURE': # 10% chance to fix HVAC if failed
                    rack_state['hvac_status'] = 'ON'

                # Apply temperature dynamics
                if rack_state['hvac_status'] == 'ON':
                    # HVAC tries to pull temperature to 20C
                    if rack_state['temp'] > 20.0:
                        rack_state['temp'] -= random.uniform(0.1, 0.3)
                    elif rack_state['temp'] < 20.0:
                        rack_state['temp'] += random.uniform(0.1, 0.2)
                else:
                    # HVAC failed, temperature rises rapidly
                    rack_state['temp'] += random.uniform(0.2, 0.5)
                
                # Apply load dynamics
                if rack_state['load'] == 'HIGH':
                    rack_state['temp'] += random.uniform(0.1, 0.3)
                elif rack_state['load'] == 'IDLE':
                    rack_state['temp'] -= random.uniform(0.05, 0.15)
                    
                # Add random noise
                rack_state['temp'] += random.uniform(-0.1, 0.1)
                rack_state['humidity'] += random.uniform(-0.5, 0.5)
                
                # Clamp values to somewhat realistic bounds
                rack_state['temp'] = max(15.0, min(rack_state['temp'], 40.0))
                rack_state['humidity'] = max(20.0, min(rack_state['humidity'], 80.0))
                
                # Save to database (this will trigger the save() method and generate alerts if necessary)
                log = ServerRackSensorLog(
                    rack_identifier=rack,
                    temperature_celsius=round(rack_state['temp'], 2),
                    humidity_percentage=round(rack_state['humidity'], 2),
                    timestamp=current_time
                )
                log.save()
                total_records += 1
                
            # Increment time by 5 minutes
            current_time += timedelta(minutes=5)
            
        self.stdout.write(self.style.SUCCESS(f'Successfully generated {total_records} simulated telemetry records.'))

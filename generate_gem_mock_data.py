import pandas as pd
import json
import random
import re

# Define GeM categories
gem_categories = [
    "Office Supplies",
    "IT Equipment",
    "Furniture",
    "Electrical Equipment",
    "Medical Supplies",
    "Automobiles",
    "Electronics",
    "Construction Materials",
    "Safety Equipment",
    "Laboratory Equipment",
    "Textiles and Clothing",
    "Printing Services",
    "Telecommunication",
    "Agricultural Equipment",
    "Industrial Machinery"
]

# Define Indian states
indian_states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
]

# Define districts per state (simplified - just a few districts per state)
districts_by_state = {}
for state in indian_states:
    # Generate 3-5 mock districts per state
    num_districts = random.randint(3, 5)
    districts_by_state[state] = [f"{state} District {i+1}" for i in range(num_districts)]

# Define products per category
products_by_category = {
    "Office Supplies": ["Pens", "Notebooks", "Staplers", "Paper", "Desk Organizers"],
    "IT Equipment": ["Laptops", "Desktops", "Monitors", "Printers", "Scanners"],
    "Furniture": ["Chairs", "Tables", "Cabinets", "Desks", "Shelves"],
    "Electrical Equipment": ["Generators", "UPS", "Voltage Stabilizers", "Transformers", "Circuit Breakers"],
    "Medical Supplies": ["Masks", "Gloves", "Syringes", "First Aid Kits", "Medical Devices"],
    "Automobiles": ["Cars", "Trucks", "Motorcycles", "Spare Parts", "Service Equipment"],
    "Electronics": ["TVs", "Air Conditioners", "Refrigerators", "Washing Machines", "Microwaves"],
    "Construction Materials": ["Cement", "Steel", "Bricks", "Paint", "Tiles"],
    "Safety Equipment": ["Helmets", "Safety Shoes", "Fire Extinguishers", "Safety Harnesses", "Respirators"],
    "Laboratory Equipment": ["Microscopes", "Test Tubes", "Centrifuges", "Lab Chemicals", "Burners"],
    "Textiles and Clothing": ["Uniforms", "Bedsheets", "Curtains", "Protective Clothing", "Blankets"],
    "Printing Services": ["Brochures", "Business Cards", "Banners", "Pamphlets", "Annual Reports"],
    "Telecommunication": ["Mobile Phones", "SIM Cards", "Telephony Equipment", "Communication Software", "Routers"],
    "Agricultural Equipment": ["Tractors", "Harvesters", "Irrigation Systems", "Fertilizer Spreaders", "Sprayers"],
    "Industrial Machinery": ["Lathes", "Milling Machines", "Power Generators", "Industrial Ovens", "Conveyor Systems"]
}

# Email validation regex pattern
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def is_valid_email(email):
    """Check if the email is valid."""
    if not isinstance(email, str):
        return False
    
    # Remove any leading/trailing whitespace
    email = email.strip()
    
    # Check if it's a reasonable length and has an @ symbol
    if len(email) < 5 or '@' not in email:
        return False
    
    # Use regex to validate the email format
    return bool(EMAIL_PATTERN.match(email))

try:
    # Read the Excel file
    df = pd.read_excel('GeM_Resellers.xlsx')
    
    # Clean up the data
    # Convert columns to string and replace NaNs with empty strings
    df = df.astype(object).fillna('')
    
    # Extract email addresses from the DataFrame
    all_emails = []
    email_addresses = set()  # To track unique email addresses
    
    for index, row in df.iterrows():
        company_name = row.get('Name of Company', 'Unknown Company')
        
        # Process Email 1
        email1 = row.get('Email 1', '')
        if is_valid_email(email1) and email1 not in email_addresses:
            all_emails.append({
                'address': email1,
                'name': company_name,
            })
            email_addresses.add(email1)
        
        # Process Email 2
        email2 = row.get('Email 2', '')
        if is_valid_email(email2) and email2 not in email_addresses:
            all_emails.append({
                'address': email2,
                'name': company_name,
            })
            email_addresses.add(email2)
        
        # Process Email 3
        email3 = row.get('Email 3', '')
        if is_valid_email(email3) and email3 not in email_addresses:
            all_emails.append({
                'address': email3,
                'name': company_name,
            })
            email_addresses.add(email3)
    
    print(f"Total unique valid email addresses found: {len(all_emails)}")
    
    # Select exactly 100 emails for the batch if possible
    batch_size = min(100, len(all_emails))
    batch_emails = random.sample(all_emails, batch_size)
    
    print(f"Created email batch with {len(batch_emails)} emails")
    
    # Create batches by state, category, and district
    batches = []
    
    # Create 5 batches, each with all 100 emails
    for i in range(5):
        batch_name = f"Batch {i+1}"
        state = random.choice(indian_states)
        category = random.choice(gem_categories)
        district = random.choice(districts_by_state[state])
        products = products_by_category[category]
        
        # Assign ALL emails to each batch - don't divide them
        batch_data = {
            "batch_name": batch_name,
            "state": state,
            "category": category,
            "district": district,
            "products": products,
            "recipients": batch_emails,  # All 100 emails in each batch
            "recipient_count": len(batch_emails)
        }
        batches.append(batch_data)
    
    # Create JavaScript file with the mock data for use in the application
    js_content = """// Mock GeM data generated for the application
export const GEM_STATES = {0};

export const GEM_CATEGORIES = {1};

export const GEM_DISTRICTS_BY_STATE = {2};

export const GEM_PRODUCTS_BY_CATEGORY = {3};

export const GEM_BATCHES = {4};

// Email batch for marketing
export const GEM_EMAIL_BATCH = {5};

// MSME dummy email for testing
export const MSME_TEST_EMAILS = [
  {{ "id": "msme1", "email": "your-email@example.com", "name": "Your Name" }},
  {{ "id": "msme2", "email": "test@example.com", "name": "Test User" }},
  {{ "id": "msme3", "email": "msme-test@quickbid.co.in", "name": "MSME Test" }},
  {{ "id": "msme4", "email": "info@msme-test.com", "name": "MSME Info" }},
  {{ "id": "msme5", "email": "contact@msme-sample.com", "name": "MSME Contact" }}
];
""".format(
        json.dumps(indian_states, indent=2),
        json.dumps(gem_categories, indent=2),
        json.dumps(districts_by_state, indent=2),
        json.dumps(products_by_category, indent=2),
        json.dumps(batches, indent=2),
        json.dumps(batch_emails, indent=2)
    )
    
    # Write to a JavaScript file
    with open('src/app/(dashboard)/email-marketing/gem-mock-data.ts', 'w') as f:
        f.write(js_content)
    
    print(f"Mock data generated and saved to src/app/(dashboard)/email-marketing/gem-mock-data.ts")
    print(f"Each batch now contains all {len(batch_emails)} emails")
    
except Exception as e:
    print(f"Error generating mock data: {e}") 
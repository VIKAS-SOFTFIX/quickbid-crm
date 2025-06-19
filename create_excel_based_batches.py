import pandas as pd
import json
import re

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

def get_company_type(company_name):
    """Determine the company type based on the company name."""
    company_name_lower = company_name.lower()
    if "private limited" in company_name_lower:
        return "Private Limited"
    elif "ltd" in company_name_lower or "limited" in company_name_lower:
        return "Limited"
    elif "llp" in company_name_lower:
        return "LLP"
    elif "corporation" in company_name_lower or "corp" in company_name_lower:
        return "Corporation"
    elif "enterprises" in company_name_lower or "enterprise" in company_name_lower:
        return "Enterprise"
    elif "industries" in company_name_lower or "industry" in company_name_lower:
        return "Industry"
    else:
        return "Other"

def get_domain_category(email):
    """Categorize the email domain."""
    if not is_valid_email(email):
        return "Unknown"
    
    domain = email.split('@')[-1].lower()
    
    if domain == "gmail.com":
        return "Gmail"
    elif "yahoo" in domain:
        return "Yahoo"
    elif domain in ["rediffmail.com", "hotmail.com", "outlook.com"]:
        return "Other Personal Email"
    elif domain.endswith(".gov.in") or ".gov." in domain:
        return "Government"
    elif domain.endswith(".edu") or domain.endswith(".ac.in"):
        return "Education"
    else:
        return "Business Email"

def create_batches_from_excel():
    """Create batches based on the data from the Excel file."""
    try:
        # Read the Excel file
        df = pd.read_excel('GeM_Resellers.xlsx')
        
        # Clean up the data
        # Convert columns to string and replace NaNs with empty strings
        df = df.astype(object).fillna('')
        
        # Extract valid emails with metadata
        all_emails = []
        company_types_set = set()
        domain_categories_set = set()
        
        for index, row in df.iterrows():
            company_name = row.get('Name of Company', 'Unknown Company')
            company_type = get_company_type(str(company_name))
            company_types_set.add(company_type)
            
            # Process Email 1
            email1 = row.get('Email 1', '')
            if is_valid_email(email1):
                domain_category = get_domain_category(email1)
                domain_categories_set.add(domain_category)
                all_emails.append({
                    'address': email1,
                    'name': company_name,
                    'company_type': company_type,
                    'domain_category': domain_category
                })
            
            # Process Email 2
            email2 = row.get('Email 2', '')
            if is_valid_email(email2):
                domain_category = get_domain_category(email2)
                domain_categories_set.add(domain_category)
                all_emails.append({
                    'address': email2,
                    'name': company_name,
                    'company_type': company_type,
                    'domain_category': domain_category
                })
            
            # Process Email 3
            email3 = row.get('Email 3', '')
            if is_valid_email(email3):
                domain_category = get_domain_category(email3)
                domain_categories_set.add(domain_category)
                all_emails.append({
                    'address': email3,
                    'name': company_name,
                    'company_type': company_type,
                    'domain_category': domain_category
                })
        
        print(f"Total valid emails collected: {len(all_emails)}")
        print(f"Company types found: {sorted(list(company_types_set))}")
        print(f"Domain categories found: {sorted(list(domain_categories_set))}")
        
        # Create batches based on company type
        company_type_batches = {}
        for email in all_emails:
            company_type = email['company_type']
            if company_type not in company_type_batches:
                company_type_batches[company_type] = []
            company_type_batches[company_type].append(email)
        
        # Create batches based on domain category
        domain_category_batches = {}
        for email in all_emails:
            domain_category = email['domain_category']
            if domain_category not in domain_category_batches:
                domain_category_batches[domain_category] = []
            domain_category_batches[domain_category].append(email)
        
        # Print batch statistics
        print("\nBatches by Company Type:")
        for company_type, emails in company_type_batches.items():
            print(f"  {company_type}: {len(emails)} emails")
        
        print("\nBatches by Domain Category:")
        for domain_category, emails in domain_category_batches.items():
            print(f"  {domain_category}: {len(emails)} emails")
        
        # Create final GeM batches
        gem_batches = []
        
        # Batch 1: Private Limited Companies
        gem_batches.append({
            "batch_name": "Batch 1: Private Limited Companies",
            "category": "Company Type",
            "type": "Private Limited",
            "recipients": company_type_batches.get("Private Limited", [])[:100],
            "recipient_count": min(100, len(company_type_batches.get("Private Limited", [])))
        })
        
        # Batch 2: Gmail Users
        gem_batches.append({
            "batch_name": "Batch 2: Gmail Users",
            "category": "Email Domain",
            "type": "Gmail",
            "recipients": domain_category_batches.get("Gmail", [])[:100],
            "recipient_count": min(100, len(domain_category_batches.get("Gmail", [])))
        })
        
        # Batch 3: Business Email Users
        gem_batches.append({
            "batch_name": "Batch 3: Business Email Users",
            "category": "Email Domain",
            "type": "Business Email",
            "recipients": domain_category_batches.get("Business Email", [])[:100],
            "recipient_count": min(100, len(domain_category_batches.get("Business Email", [])))
        })
        
        # Batch 4: Limited Companies
        gem_batches.append({
            "batch_name": "Batch 4: Limited Companies",
            "category": "Company Type",
            "type": "Limited",
            "recipients": company_type_batches.get("Limited", [])[:100],
            "recipient_count": min(100, len(company_type_batches.get("Limited", [])))
        })
        
        # Batch 5: Other Companies (Enterprises, Industries, etc.)
        combined_other = []
        for company_type in ["Enterprise", "Industry", "Corporation"]:
            if company_type in company_type_batches:
                combined_other.extend(company_type_batches[company_type])
        
        gem_batches.append({
            "batch_name": "Batch 5: Other Companies",
            "category": "Company Type",
            "type": "Combined Others",
            "recipients": combined_other[:100],
            "recipient_count": min(100, len(combined_other))
        })
        
        print("\nFinal GeM Batches:")
        for batch in gem_batches:
            print(f"  {batch['batch_name']}: {batch['recipient_count']} emails")
        
        # Create JavaScript file with the mock data for use in the application
        gem_states = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
            "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
            "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
            "West Bengal"
        ]
        
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
        
        # Define districts per state (simplified - just a few districts per state)
        districts_by_state = {}
        for state in gem_states:
            # Generate 3-5 mock districts per state
            num_districts = 3  # Simplified for consistency
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
        
        # Clean the batches for JSON serialization (remove company_type and domain_category)
        cleaned_batches = []
        for batch in gem_batches:
            cleaned_recipients = []
            for recipient in batch["recipients"]:
                cleaned_recipients.append({
                    "address": recipient["address"],
                    "name": recipient["name"]
                })
            
            cleaned_batch = {
                "batch_name": batch["batch_name"],
                "category": batch["category"],
                "type": batch["type"],
                "recipients": cleaned_recipients,
                "recipient_count": batch["recipient_count"]
            }
            cleaned_batches.append(cleaned_batch)
        
        # All emails for the overall batch
        all_cleaned_emails = []
        for email in all_emails[:100]:  # Take just 100 for the main batch
            all_cleaned_emails.append({
                "address": email["address"],
                "name": email["name"]
            })
        
        js_content = """// Mock GeM data generated from the Excel file
export const GEM_STATES = {0};

export const GEM_CATEGORIES = {1};

export const GEM_DISTRICTS_BY_STATE = {2};

export const GEM_PRODUCTS_BY_CATEGORY = {3};

export const GEM_BATCHES = {4};

// Email batch for marketing
export const GEM_EMAIL_BATCH = {5};

// MSME dummy email for testing
export const MSME_TEST_EMAILS = [
  {{ "id": "msme1", "email": "your.actual.email@example.com", "name": "Your Name" }},
  {{ "id": "msme2", "email": "test@example.com", "name": "Test User" }},
  {{ "id": "msme3", "email": "msme-test@quickbid.co.in", "name": "MSME Test" }},
  {{ "id": "msme4", "email": "info@msme-test.com", "name": "MSME Info" }},
  {{ "id": "msme5", "email": "contact@msme-sample.com", "name": "MSME Contact" }}
];
""".format(
            json.dumps(gem_states, indent=2),
            json.dumps(gem_categories, indent=2),
            json.dumps(districts_by_state, indent=2),
            json.dumps(products_by_category, indent=2),
            json.dumps(cleaned_batches, indent=2),
            json.dumps(all_cleaned_emails, indent=2)
        )
        
        # Write to a JavaScript file
        with open('src/app/(dashboard)/email-marketing/gem-mock-data.ts', 'w') as f:
            f.write(js_content)
        
        print(f"\nMock data generated and saved to src/app/(dashboard)/email-marketing/gem-mock-data.ts")
        print(f"Created {len(gem_batches)} batches with different email lists based on the Excel data")
        
    except Exception as e:
        print(f"Error creating batches from Excel: {e}")

if __name__ == "__main__":
    create_batches_from_excel() 
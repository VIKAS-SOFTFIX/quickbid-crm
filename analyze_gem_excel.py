import pandas as pd
import re

def analyze_excel_file():
    """
    Analyze the GeM_Resellers.xlsx file to understand its structure
    and how to create meaningful batches.
    """
    try:
        # Read the Excel file
        df = pd.read_excel('GeM_Resellers.xlsx')
        
        # Print the column headers
        print("Column Headers:")
        print(df.columns.tolist())
        
        # Count total rows
        total_rows = len(df)
        print(f"Total rows: {total_rows}")
        
        # Check if there are any columns that could be used for batching
        # (like state, category, or company type)
        print("\nChecking for potential batch criteria...")
        
        # Extract unique values from the Name of Company column to see if we have any patterns
        if 'Name of Company' in df.columns:
            # Convert to string and replace NaN with empty string
            companies = df['Name of Company'].astype(str).replace('nan', '')
            unique_companies = companies.nunique()
            print(f"Unique companies: {unique_companies}")
            
            # Check for common patterns in company names that could indicate categories
            company_types = []
            for company in companies:
                if "private limited" in company.lower():
                    company_types.append("Private Limited")
                elif "ltd" in company.lower():
                    company_types.append("Limited")
                elif "llp" in company.lower():
                    company_types.append("LLP")
                elif "corporation" in company.lower():
                    company_types.append("Corporation")
                else:
                    company_types.append("Other")
            
            # Count by company type
            from collections import Counter
            company_type_counts = Counter(company_types)
            print("\nCompany types detected:")
            for company_type, count in company_type_counts.items():
                print(f"  {company_type}: {count}")
        
        # Check if we can extract states from any data
        # Look for common Indian state names in company names or addresses
        states = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
            "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
            "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
            "West Bengal", "Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai",
            "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
        ]
        
        # Check for hints of batch numbers or categories in the data
        batch_hints = []
        for index, row in df.iterrows():
            company_name = str(row.get('Name of Company', ''))
            # Check for batch indicators like "Batch A", "Group 1", etc.
            if re.search(r'batch\s+[a-z0-9]', company_name.lower()):
                batch_hints.append(f"Batch indicator found in row {index+1}: {company_name}")
            if re.search(r'group\s+[a-z0-9]', company_name.lower()):
                batch_hints.append(f"Group indicator found in row {index+1}: {company_name}")
        
        if batch_hints:
            print("\nPossible batch indicators found:")
            for hint in batch_hints:
                print(f"  {hint}")
        else:
            print("\nNo explicit batch indicators found in company names.")
            
        # Check for email domains to potentially group by domain
        email_domains = []
        for column in ['Email 1', 'Email 2', 'Email 3']:
            if column in df.columns:
                emails = df[column].dropna()
                for email in emails:
                    if isinstance(email, str) and '@' in email:
                        domain = email.split('@')[-1].lower()
                        email_domains.append(domain)
        
        # Count domains
        domain_counter = Counter(email_domains)
        print("\nTop 10 email domains:")
        for domain, count in domain_counter.most_common(10):
            print(f"  {domain}: {count}")
            
        # Create some sample batches based on email domains
        print("\nSuggested batches based on email domains:")
        top_domains = [domain for domain, _ in domain_counter.most_common(5)]
        print(f"Batch 1: Top domains - {', '.join(top_domains)}")
        print(f"Batch 2: Gmail users")
        print(f"Batch 3: Yahoo users")
        print(f"Batch 4: Business domains (company emails)")
        print(f"Batch 5: Other domains")
        
        # Check if there are any other columns we could use
        print("\nOther potential columns for batching:")
        for column in df.columns:
            if column not in ['Name of Company', 'Email 1', 'Email 2', 'Email 3']:
                print(f"  {column}")
                
    except Exception as e:
        print(f"Error analyzing Excel file: {e}")

if __name__ == "__main__":
    analyze_excel_file() 
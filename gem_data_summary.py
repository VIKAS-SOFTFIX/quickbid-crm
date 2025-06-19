import json
import os

def load_mock_data():
    try:
        file_path = 'src/app/(dashboard)/email-marketing/gem-mock-data.ts'
        
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} not found.")
            return None
            
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Extract JSON data from the TypeScript file
        # This is a simple extraction, not a proper parser
        data = {}
        
        # Extract GEM_STATES
        states_start = content.find('export const GEM_STATES =') + len('export const GEM_STATES =')
        states_end = content.find('export const GEM_CATEGORIES =')
        states_json = content[states_start:states_end].strip().rstrip(';').strip()
        data['states'] = json.loads(states_json)
        
        # Extract GEM_CATEGORIES
        categories_start = content.find('export const GEM_CATEGORIES =') + len('export const GEM_CATEGORIES =')
        categories_end = content.find('export const GEM_DISTRICTS_BY_STATE =')
        categories_json = content[categories_start:categories_end].strip().rstrip(';').strip()
        data['categories'] = json.loads(categories_json)
        
        # Extract GEM_BATCHES
        batches_start = content.find('export const GEM_BATCHES =') + len('export const GEM_BATCHES =')
        batches_end = content.find('export const GEM_EMAIL_BATCH =')
        batches_json = content[batches_start:batches_end].strip().rstrip(';').strip()
        data['batches'] = json.loads(batches_json)
        
        # Extract GEM_EMAIL_BATCH
        email_start = content.find('export const GEM_EMAIL_BATCH =') + len('export const GEM_EMAIL_BATCH =')
        email_end = content.find(';', email_start)
        email_json = content[email_start:email_end].strip()
        data['email_batch'] = json.loads(email_json)
        
        return data
        
    except Exception as e:
        print(f"Error loading mock data: {e}")
        return None

def print_summary(data):
    if not data:
        return
    
    print("=" * 50)
    print("GeM Mock Data Summary")
    print("=" * 50)
    
    print(f"\nTotal States: {len(data['states'])}")
    print(f"Total Categories: {len(data['categories'])}")
    print(f"Total Email Batch Size: {len(data['email_batch'])}")
    print(f"Total Batches: {len(data['batches'])}")
    
    print("\nBatch Details:")
    for i, batch in enumerate(data['batches']):
        print(f"\n  Batch {i+1}: {batch['batch_name']}")
        print(f"    State: {batch['state']}")
        print(f"    Category: {batch['category']}")
        print(f"    District: {batch['district']}")
        print(f"    Products: {', '.join(batch['products'])}")
        print(f"    Recipients: {batch['recipient_count']}")
    
    print("\nSample Emails (first 5):")
    for i, email in enumerate(data['email_batch'][:5]):
        print(f"  {i+1}. {email['address']} - {email['name']}")
    
    print("\n" + "=" * 50)

def print_file_preview():
    try:
        file_path = 'src/app/(dashboard)/email-marketing/gem-mock-data.ts'
        
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} not found.")
            return
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Print the beginning of the file
        print("=" * 50)
        print("GeM Mock Data Preview (first 500 chars):")
        print("=" * 50)
        print(content[:500] + "...")
        
        # Print batch information
        batches_start = content.find('export const GEM_BATCHES =')
        if batches_start != -1:
            preview_end = content.find("]", batches_start) + 1
            batch_preview = content[batches_start:preview_end]
            if len(batch_preview) > 500:
                batch_preview = batch_preview[:500] + "..."
            print("\n" + "=" * 50)
            print("GEM_BATCHES Preview:")
            print("=" * 50)
            print(batch_preview)
        
        # Print some email batch information
        email_start = content.find('export const GEM_EMAIL_BATCH =')
        if email_start != -1:
            preview_end = content.find("]", email_start) + 1
            email_preview = content[email_start:preview_end]
            if len(email_preview) > 500:
                email_preview = email_preview[:500] + "..."
            print("\n" + "=" * 50)
            print("GEM_EMAIL_BATCH Preview:")
            print("=" * 50)
            print(email_preview)
        
        # Print some statistics
        states_count = content.count('"Andhra Pradesh"') + content.count('"Karnataka"') + content.count('"Maharashtra"')
        categories_count = content.count('"Office Supplies"') + content.count('"IT Equipment"') + content.count('"Furniture"')
        
        print("\n" + "=" * 50)
        print("Basic Stats:")
        print("=" * 50)
        print(f"File size: {len(content)} bytes")
        print(f"Number of batches found: {content.count('batch_name')}")
        print(f"Email batch entries: ~{content.count('address') - content.count('senderAddress')}")
        print(f"Sample states found: {states_count}")
        print(f"Sample categories found: {categories_count}")
        
    except Exception as e:
        print(f"Error analyzing mock data: {e}")

if __name__ == "__main__":
    print_file_preview() 
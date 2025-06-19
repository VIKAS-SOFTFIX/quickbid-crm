import re

def update_msme_emails(your_email, your_name="Your Name"):
    """
    Update the MSME_TEST_EMAILS array in the gem-mock-data.ts file
    with the user's preferred email.
    
    Args:
        your_email (str): The email to add to the MSME test emails
        your_name (str): The name to associate with the email
    """
    try:
        file_path = 'src/app/(dashboard)/email-marketing/gem-mock-data.ts'
        
        # Read the current file
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Create the new MSME_TEST_EMAILS array with your email as the first one
        new_msme_emails = f"""export const MSME_TEST_EMAILS = [
  {{ "id": "msme1", "email": "{your_email}", "name": "{your_name}" }},
  {{ "id": "msme2", "email": "test@example.com", "name": "Test User" }},
  {{ "id": "msme3", "email": "msme-test@quickbid.co.in", "name": "MSME Test" }},
  {{ "id": "msme4", "email": "info@msme-test.com", "name": "MSME Info" }},
  {{ "id": "msme5", "email": "contact@msme-sample.com", "name": "MSME Contact" }}
];"""
        
        # Replace the existing MSME_TEST_EMAILS array with the new one
        pattern = r"export const MSME_TEST_EMAILS = \[\s*\{.*?\}\s*\];"
        updated_content = re.sub(pattern, new_msme_emails, content, flags=re.DOTALL)
        
        # Write the updated content back to the file
        with open(file_path, 'w') as f:
            f.write(updated_content)
        
        print(f"Successfully updated MSME_TEST_EMAILS with {your_email}")
        
    except Exception as e:
        print(f"Error updating MSME_TEST_EMAILS: {e}")

if __name__ == "__main__":
    # Replace this with your actual email and name
    YOUR_EMAIL = "your.actual.email@example.com"  # <-- PUT YOUR EMAIL HERE
    YOUR_NAME = "Your Full Name"  # <-- PUT YOUR NAME HERE
    
    update_msme_emails(YOUR_EMAIL, YOUR_NAME) 
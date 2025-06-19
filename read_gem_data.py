import pandas as pd

try:
    # Read the Excel file
    df = pd.read_excel('GeM_Resellers.xlsx')
    
    # Print the column headers
    print("Column Headers:")
    print(df.columns.tolist())
    
    # Print the first 5 rows
    print("\nFirst 5 rows:")
    print(df.head())
    
    # Print the total number of rows
    print(f"\nTotal rows: {len(df)}")
    
except Exception as e:
    print(f"Error reading Excel file: {e}") 
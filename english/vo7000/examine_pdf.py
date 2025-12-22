import pdfplumber
import os

# Find all PDF files in current directory
pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]

print(f"Found {len(pdf_files)} PDF file(s):")
for pdf_file in pdf_files:
    print(f"  - {pdf_file}")

# Examine the first PDF
if pdf_files:
    pdf_path = pdf_files[0]
    print(f"\nExamining: {pdf_path}")
    print("=" * 60)
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        
        # Show first 2 pages content
        for i, page in enumerate(pdf.pages[:2]):
            print(f"\n--- Page {i+1} ---")
            text = page.extract_text()
            if text:
                lines = text.split('\n')[:30]  # First 30 lines
                for line in lines:
                    print(line)
            else:
                print("(No text extracted)")

import pdfplumber
import re
import json

# Extract all text from PDF
pdf_path = 'M20240320008_3.pdf'

all_text = []
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            all_text.append(text)

# Combine all pages
full_text = '\n'.join(all_text)

# Save to file for analysis
with open('pdf_content.txt', 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"Extracted {len(all_text)} pages")
print(f"Total characters: {len(full_text)}")
print("\nFirst 2000 characters:")
print("=" * 60)
print(full_text[:2000])

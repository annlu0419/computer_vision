import pdfplumber
import json
import re

pdf_path = r'c:\anitygravity 測試\單字庫\單字.pdf'
output_path = r'c:\anitygravity 測試\單字庫\extracted_text.txt'

all_text = []

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            all_text.append(f"=== Page {page.page_number} ===\n{text}\n")

# Save to file
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(all_text))

print(f"Extracted text from {len(pdf.pages)} pages")
print(f"Saved to: {output_path}")

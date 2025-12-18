import pdfplumber
import json
import re

pdf_path = r'c:\anitygravity 測試\單字庫\單字.pdf'
output_json = r'c:\anitygravity 測試\單字庫\vocabulary_data.json'

vocabulary = []

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if not text:
            continue
        
        # Split by lines
        lines = text.split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Skip empty lines and header lines
            if not line or line == '英文單字 詞性 中文意思 簡單例句':
                i += 1
                continue
            
            # Skip page markers
            if line.startswith('=== Page'):
                i += 1
                continue
            
            # Try to parse vocabulary entry
            # Pattern: English word, part of speech, Chinese meaning, example
            parts = line.split()
            
            if len(parts) >= 3:
                # First word should be English
                english = parts[0]
                
                # Check if it looks like an English word (starts with capital letter)
                if english and english[0].isupper() and english.isalpha():
                    # Second part should be part of speech
                    pos_candidates = ['v.', 'n.', 'adj.', 'adv.', 'phr.', 'conj.', 'n./v.', 'adj./v.', 'v./n.', 'n./adj.', 'adj./adv.']
                    
                    pos = None
                    chinese = None
                    example = None
                    
                    # Find part of speech
                    for j, part in enumerate(parts[1:], 1):
                        if part in pos_candidates:
                            pos = part
                            # Rest is Chinese meaning and example
                            remaining = ' '.join(parts[j+1:])
                            
                            # Look for example sentence (contains parentheses)
                            if '(' in remaining:
                                chinese_part = remaining.split('(')[0].strip()
                                example_part = remaining.split('(', 1)[1]
                                if ')' in example_part:
                                    example_part = example_part.split(')')[0]
                                    example = example_part.strip()
                                chinese = chinese_part
                            else:
                                chinese = remaining
                            
                            # Check next lines for continuation
                            next_idx = i + 1
                            while next_idx < len(lines):
                                next_line = lines[next_idx].strip()
                                # If next line doesn't start with capital English word, it's continuation
                                if next_line and not (next_line.split()[0][0].isupper() if next_line.split() and next_line.split()[0] else False):
                                    if '(' in next_line or '）' in next_line:
                                        # This is likely the example sentence
                                        example_text = next_line
                                        if '(' in example_text:
                                            example = example_text.split('(')[1].split(')')[0].strip() if ')' in example_text else example_text
                                        i = next_idx
                                    elif not chinese or len(chinese) < 3:
                                        chinese = (chinese + ' ' + next_line).strip() if chinese else next_line
                                        i = next_idx
                                    else:
                                        break
                                    next_idx += 1
                                else:
                                    break
                            
                            break
                    
                    if pos and chinese:
                        vocab_entry = {
                            'english': english,
                            'partOfSpeech': pos,
                            'chinese': chinese,
                            'example': example if example else ''
                        }
                        vocabulary.append(vocab_entry)
                        print(f"Added: {english} ({pos}) - {chinese[:30]}...")
            
            i += 1

# Save to JSON
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(vocabulary, f, ensure_ascii=False, indent=2)

print(f"\n\nTotal vocabulary entries extracted: {len(vocabulary)}")
print(f"Saved to: {output_json}")

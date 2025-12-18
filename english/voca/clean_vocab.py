import json
import re

# Read the JSON file
with open(r'c:\anitygravity 測試\單字庫\vocabulary_data.json', 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

# Clean up the data - separate Chinese meaning from example sentences
cleaned_vocab = []

for entry in vocab_data:
    english = entry['english']
    pos = entry['partOfSpeech']
    chinese_raw = entry['chinese']
    example = entry['example']
    
    # Try to extract Chinese meaning and English example from the chinese field
    chinese_meaning = chinese_raw
    english_example = example
    
    # If the chinese field contains an English sentence (starts with capital letter after some Chinese)
    # Try to separate them
    parts = chinese_raw.split(' ', 10)
    chinese_parts = []
    english_parts = []
    found_english = False
    
    for part in parts:
        # Check if this looks like English (contains mostly ASCII letters)
        if part and len(part) > 0:
            ascii_count = sum(1 for c in part if ord(c) < 128)
            if ascii_count / len(part) > 0.5 and part[0].isupper():
                found_english = True
            
            if found_english:
                english_parts.append(part)
            else:
                chinese_parts.append(part)
    
    if chinese_parts:
        chinese_meaning = ' '.join(chinese_parts).strip()
    if english_parts and not english_example:
        english_example = ' '.join(english_parts).strip()
    
    # Clean up
    chinese_meaning = chinese_meaning.replace('  ', ' ').strip()
    if not english_example:
        english_example = ""
    
    cleaned_entry = {
        'english': english,
        'partOfSpeech': pos,
        'chinese': chinese_meaning,
        'example': english_example
    }
    cleaned_vocab.append(cleaned_entry)

# Generate JavaScript array string
js_array = "const vocabulary = " + json.dumps(cleaned_vocab, ensure_ascii=False, indent=4) + ";"

# Save to a JS file
with open(r'c:\anitygravity 測試\單字庫\vocabulary_data.js', 'w', encoding='utf-8') as f:
    f.write(js_array)

print(f"Cleaned {len(cleaned_vocab)} vocabulary entries")
print(f"Saved to vocabulary_data.js")
print("\nFirst entry:")
print(json.dumps(cleaned_vocab[0], ensure_ascii=False, indent=2))
print("\nLast entry:")
print(json.dumps(cleaned_vocab[-1], ensure_ascii=False, indent=2))

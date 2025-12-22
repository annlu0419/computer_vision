import pdfplumber
import re
import json
from collections import OrderedDict
import os

def extract_vocabulary_from_pdf(pdf_path):
    """Extract vocabulary entries from PDF file"""
    print(f"Processing: {pdf_path}")
    
    # Extract all text from PDF
    all_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                all_text.append(text)
    
    full_text = '\n'.join(all_text)
    
    # Regex pattern to match vocabulary entries
    # Pattern: word [phonetic] part_of_speech chinese_meaning
    # Examples: "aisle [aɪl] n.走道；通道"
    pattern = r'([a-zA-Z][a-zA-Z\-/\s]*?)\s*\[.*?\]\s*(n\.|v\.|adj\.|adv\.|prep\.|conj\.|int\.|vt\.|vi\.|a\.|interj\.)\s*([^\n\r]+?)(?=\s+[a-zA-Z]+\s*\[|$|\n)'
    
    matches = re.findall(pattern, full_text, re.MULTILINE)
    
    print(f"Found {len(matches)} vocabulary entries")
    
    vocabulary = []
    seen_words = set()
    
    for match in matches:
        english_word = match[0].strip()
        part_of_speech = match[1].strip()
        chinese_meaning = match[2].strip()
        
        # Clean up the English word (remove extra spaces, special chars at end)
        english_word = re.sub(r'\s+', ' ', english_word)
        english_word = english_word.strip('.,;:!?')
        
        # Clean up Chinese meaning
        # Remove extra whitespace
        chinese_meaning = re.sub(r'\s+', '', chinese_meaning)
        # Remove additional part of speech markers (vt., vi., n., adj., etc.)
        chinese_meaning = re.sub(r'(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|a\.|interj\.)', '', chinese_meaning)
        # Take first meaning if multiple (separated by 、 or ；)
        chinese_meaning = re.split(r'[；、]', chinese_meaning)[0]
        # Remove parentheses content if it's just grammatical info
        chinese_meaning = re.sub(r'\([^)]*\)', '', chinese_meaning)
        # Clean up any remaining artifacts
        chinese_meaning = chinese_meaning.strip('；、，。')
        
        # Skip if word is too short, already seen, or meaning is empty
        if len(english_word) < 2 or english_word.lower() in seen_words or not chinese_meaning:
            continue
            
        seen_words.add(english_word.lower())
        
        # Generate example sentence
        example = generate_example_sentence(english_word, part_of_speech, chinese_meaning)
        
        vocabulary.append({
            "english": english_word,
            "partOfSpeech": part_of_speech,
            "chinese": chinese_meaning,
            "example": example
        })
    
    return vocabulary

def generate_example_sentence(word, pos, meaning):
    """Generate a natural English example sentence for the vocabulary word"""
    
    # Enhanced example sentence templates based on part of speech
    templates = {
        'n.': [
            f"The {word} is very important.",
            f"We need a new {word}.",
            f"She bought a beautiful {word}.",
            f"He is interested in this {word}.",
            f"This is a good {word}."
        ],
        'v.': [
            f"They decided to {word}.",
            f"We should {word} more often.",
            f"She is {word}ing right now.",
            f"He started to {word} yesterday.",
            f"Please don't {word}."
        ],
        'vt.': [
            f"He decided to {word} the problem.",
            f"We should {word} this issue.",
            f"She is {word}ing the project.",
            f"They need to {word} the data.",
            f"Please {word} this document."
        ],
        'vi.': [
            f"The situation began to {word}.",
            f"Things are {word}ing rapidly.",
            f"They have already {word}ed.",
            f"It will {word} soon.",
            f"The problem gradually {word}ed."
        ],
        'adj.': [
            f"This is a very {word} example.",
            f"He looks quite {word}.",
            f"The idea seems {word}.",
            f"Her attitude is {word}.",
            f"The result was {word}."
        ],
        'adv.': [
            f"He {word} completed the work.",
            f"She {word} told the truth.",
            f"We are moving {word}.",
            f"They {word} handled the situation.",
            f"Please {word} consider this proposal."
        ],
        'prep.': [
            f"The word '{word}' is commonly used as a preposition.",
            f"Please note the usage of '{word}'.",
            f"This is an example of '{word}'."
        ],
        'conj.': [
            f"The conjunction '{word}' connects two clauses.",
            f"Use '{word}' to join sentences.",
            f"'{word}' shows the relationship between ideas."
        ],
        'int.': [
            f"'{word.capitalize()}!' she exclaimed.",
            f"He said '{word}' with surprise.",
            f"'{word.capitalize()},' they shouted."
        ],
        'interj.': [
            f"'{word.capitalize()}!' she exclaimed.",
            f"He said '{word}' with surprise.",
            f"'{word.capitalize()},' they shouted."
        ]
    }
    
    # Get template for this part of speech, or use generic
    template_list = templates.get(pos, [
        f"The word '{word}' is useful in English.",
        f"Please learn how to use '{word}'.",
        f"'{word}' is an important vocabulary word."
    ])
    
    # Use hash of word to consistently pick same template for same word
    template_index = hash(word) % len(template_list)
    return template_list[template_index]

def main():
    # Find all PDF files in current directory
    pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]
    
    if not pdf_files:
        print("No PDF files found in current directory!")
        return
    
    print(f"Found {len(pdf_files)} PDF file(s):")
    for pdf_file in pdf_files:
        print(f"  - {pdf_file}")
    
    # Extract vocabulary from all PDFs
    all_vocabulary = []
    for pdf_file in pdf_files:
        vocab = extract_vocabulary_from_pdf(pdf_file)
        all_vocabulary.extend(vocab)
    
    # Remove duplicates based on English word (case-insensitive)
    unique_vocab = OrderedDict()
    for entry in all_vocabulary:
        key = entry['english'].lower()
        if key not in unique_vocab:
            unique_vocab[key] = entry
    
    final_vocabulary = list(unique_vocab.values())
    
    print(f"\nTotal unique vocabulary entries: {len(final_vocabulary)}")
    
    # Output as JSON
    output_file = 'vocabulary_output.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_vocabulary, f, ensure_ascii=False, indent=2)
    
    print(f"\nVocabulary saved to: {output_file}")
    
    # Show first 5 entries as sample
    print("\nSample entries:")
    for entry in final_vocabulary[:5]:
        print(json.dumps(entry, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()

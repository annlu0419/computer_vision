import re

# Read the vocabulary JS file
with open(r'c:\anitygravity 測試\單字庫\vocabulary_data.js', 'r', encoding='utf-8') as f:
    vocab_js = f.read()

# Read the HTML file
with open(r'c:\anitygravity 測試\單字庫\vocabulary-game.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find and replace the vocabulary array
# Look for the pattern: const vocabulary = [...];
pattern = r'const vocabulary = \[[\s\S]*?\];'

# Extract just the array part from vocab_js (remove "const vocabulary = " at the start)
vocab_array = vocab_js.replace('const vocabulary = ', '').strip()

# Create the replacement with proper comment
replacement = f'''// 單字資料庫 - 從 PDF 檔案匯入的 485 個單字
        const vocabulary = {vocab_array}'''

# Replace in HTML
html_content = re.sub(pattern, replacement, html_content)

# Write back to HTML file
with open(r'c:\anitygravity 測試\單字庫\vocabulary-game.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully updated vocabulary-game.html with all 485 vocabulary entries!")
print("The game is now ready to use with your complete vocabulary list.")

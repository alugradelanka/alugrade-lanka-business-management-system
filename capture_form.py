import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotation Form Test</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { padding: 30px; font-family: 'Inter', sans-serif; background: #f8fafc; }
        .table-responsive { overflow-x: auto; }
    </style>
</head>
<body>
    <div id="pageContent" style="width: 1240px; margin: 0 auto;"></div>

    <script src="js/modules/pricelist.js"></script>
    <script src="js/modules/quotations.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            window.priceListModule = new PriceListModule();
            window.quotationModule = new QuotationModule('pageContent');
            window.quotationModule.renderNewForm();
        });
    </script>
</body>
</html>'''

with open('test_form.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
artifact_path = r'C:\Users\user\.gemini\antigravity\brain\128fb562-f31e-4f33-99a9-fe22b03b8f5a\live_form_fix_verified.png'

cmd = [
    edge_exe,
    '--headless',
    '--disable-gpu',
    '--window-size=1300,1100',
    '--screenshot=' + artifact_path,
    os.path.abspath('test_form.html')
]

subprocess.run(cmd, check=True)
print('Form screenshot saved successfully to artifact directory:', artifact_path)

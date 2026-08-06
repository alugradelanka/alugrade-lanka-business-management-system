import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotation QA Verification</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { padding: 30px; font-family: 'Inter', sans-serif; background: #f8fafc; }
    </style>
</head>
<body>
    <div id="pageContent" style="width: 1240px; margin: 0 auto;"></div>

    <script src="js/config.js"></script>
    <script src="js/events.js"></script>
    <script src="js/db.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/modules/pricelist.js"></script>
    <script src="js/modules/quotations.js"></script>
    <script>
        window.errorsFound = [];
        window.onerror = function(msg, url, line) {
            window.errorsFound.push({ msg, url, line });
        };

        document.addEventListener('DOMContentLoaded', () => {
            try {
                window.priceListModule = new PriceListModule();
                window.quotationModule = new QuotationModule('pageContent');
                window.quotationModule.render();

                console.log('QuotationModule rendered successfully!');
                console.log('Total Quotations loaded:', window.quotationModule.quotations.length);

                // Test renderNewForm
                window.quotationModule.renderNewForm();

                // Test switching brand to SwissTek
                const brandSelect = document.getElementById('q_profileBrand');
                if (brandSelect) {
                    brandSelect.value = 'SwissTek';
                    window.quotationModule.onGlobalBrandChange();
                }

                // Test adding another row
                window.quotationModule.addItemRow();

                // Test calculations
                window.quotationModule.calculateTotals();

                console.log('Subtotal:', document.getElementById('q_subtotal').value);
                console.log('Grand Total:', document.getElementById('q_grandTotal').value);

                // Test print view generation
                const printHtml = window.quotationModule.renderPrintView('QTN-2026-0001');
                if (!printHtml || printHtml.length < 500) {
                    window.errorsFound.push('renderPrintView returned empty or short HTML');
                } else {
                    console.log('Print View generated successfully, size:', printHtml.length);
                }

                document.body.setAttribute('data-qa-complete', 'true');
            } catch (err) {
                console.error('QA Exception:', err);
                window.errorsFound.push(err.message || String(err));
            }
        });
    </script>
</body>
</html>'''

with open('test_qa.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
artifact_path = r'C:\Users\user\.gemini\antigravity\brain\128fb562-f31e-4f33-99a9-fe22b03b8f5a\qa_verification_final.png'

cmd = [
    edge_exe,
    '--headless',
    '--disable-gpu',
    '--window-size=1300,1100',
    '--screenshot=' + artifact_path,
    os.path.abspath('test_qa.html')
]

subprocess.run(cmd, check=True)
print('QA Verification Screenshot saved successfully to:', artifact_path)

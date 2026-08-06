import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Orders Module QA Verification</title>
    <style>
        body { padding: 30px; font-family: sans-serif; background: #f8fafc; }
        .badge { padding: 4px 8px; border-radius: 4px; color: white; background: #007bff; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div id="pageContent" style="width: 1200px; margin: 0 auto;"></div>

    <script src="js/config.js"></script>
    <script src="js/events.js"></script>
    <script src="js/db.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/modules/orders.js"></script>
    <script>
        window.errorsFound = [];
        window.onerror = function(msg, url, line) {
            window.errorsFound.push({ msg, url, line });
        };

        document.addEventListener('DOMContentLoaded', () => {
            try {
                window.orderModule = new OrderModule();
                window.orderModule.render();

                console.log('OrderModule loaded successfully!');

                const testQuotation = {
                    id: 'QTN-2026-9999',
                    customerName: 'Kottawa Villa Projects',
                    customerPhone: '0755515862',
                    salesRep: 'Samantha Perera',
                    projectName: 'Luxury Villa Glass Facade',
                    siteAddress: 'Highlevel Road, Kottawa',
                    profileBrand: 'SwissTek',
                    grandTotal: 780000,
                    advance: 390000,
                    balance: 390000,
                    items: [
                        {
                            description: 'Curtain Wall Structural Glass Panel',
                            alumSection: 'Curtain Wall System (150mm)',
                            glassType: '10mm Tempered Clear',
                            colour: 'Matt Black Powder Coated',
                            width: 2000,
                            height: 3000,
                            qty: 2,
                            sqft: 129.17,
                            amount: 780000
                        }
                    ]
                };

                window.orderModule.createFromQuotation(testQuotation);
                const newOrderId = window.orderModule.orders[0].id;

                window.orderModule.verifyDeposit(newOrderId);
                window.orderModule.approveOrder(newOrderId);
                window.orderModule.renderDetail(newOrderId);

                const printHtml = window.orderModule.renderPrintView(newOrderId);
                if (!printHtml || printHtml.length < 300) {
                    window.errorsFound.push('renderPrintView failed');
                }

                window.orderModule.render();
                document.body.setAttribute('data-qa-complete', 'true');
            } catch (err) {
                window.errorsFound.push(err.message || String(err));
            }
        });
    </script>
</body>
</html>'''

with open('test_orders_fast.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
artifact_path = r'C:\Users\user\.gemini\antigravity\brain\128fb562-f31e-4f33-99a9-fe22b03b8f5a\orders_qa_verification_final.png'
html_path = 'file:///' + os.path.abspath('test_orders_fast.html').replace('\\', '/')

cmd = [
    edge_exe,
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-remote-fonts',
    '--run-all-compositor-stages-before-draw',
    '--window-size=1300,1100',
    '--screenshot=' + artifact_path,
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
print('Return code:', res.returncode)
print('Screenshot exists:', os.path.exists(artifact_path))

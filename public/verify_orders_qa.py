import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Orders Module QA Verification</title>
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

                console.log('OrderModule rendered successfully!');
                console.log('Total Orders loaded:', window.orderModule.orders.length);

                // Test 1-click conversion from dummy quotation
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
                console.log('Quotation converted to Order:', window.orderModule.orders[0].id);

                // Test deposit verification & approval
                const newOrderId = window.orderModule.orders[0].id;
                window.orderModule.verifyDeposit(newOrderId);
                window.orderModule.approveOrder(newOrderId);

                // Test detail view
                window.orderModule.renderDetail(newOrderId);

                // Test print job sheet generation
                const printHtml = window.orderModule.renderPrintView(newOrderId);
                if (!printHtml || printHtml.length < 500) {
                    window.errorsFound.push('renderPrintView returned invalid HTML');
                } else {
                    console.log('Print Job Sheet generated successfully, size:', printHtml.length);
                }

                // Render list back
                window.orderModule.render();

                document.body.setAttribute('data-qa-complete', 'true');
            } catch (err) {
                console.error('QA Exception:', err);
                window.errorsFound.push(err.message || String(err));
            }
        });
    </script>
</body>
</html>'''

with open('test_orders_qa.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
artifact_path = r'C:\Users\user\.gemini\antigravity\brain\128fb562-f31e-4f33-99a9-fe22b03b8f5a\orders_qa_verification_final.png'

cmd = [
    edge_exe,
    '--headless',
    '--disable-gpu',
    '--window-size=1300,1100',
    '--screenshot=' + artifact_path,
    os.path.abspath('test_orders_qa.html')
]

subprocess.run(cmd, check=True)
print('Orders QA Verification Screenshot saved to:', artifact_path)

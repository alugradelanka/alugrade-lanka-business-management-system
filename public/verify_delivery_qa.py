import os
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Delivery Module QA Verification</title>
    <style>
        body { padding: 20px; font-family: sans-serif; background: #f8fafc; }
    </style>
</head>
<body>
    <div id="pageContent" style="width: 1200px; margin: 0 auto;"></div>

    <script src="js/config.js"></script>
    <script src="js/events.js"></script>
    <script src="js/db.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/modules/delivery.js"></script>
    <script>
        window.errorsFound = [];
        window.onerror = function(msg, url, line) {
            window.errorsFound.push({ msg, url, line });
        };

        document.addEventListener('DOMContentLoaded', () => {
            try {
                window.deliveryModule = new DeliveryModule();
                window.deliveryModule.render();

                console.log('DeliveryModule loaded successfully!');
                console.log('Total Deliveries loaded:', window.deliveryModule.deliveries.length);

                // Test 1-click Delivery Note creation from dummy completed Job Card
                const testJob = {
                    jobNo: 'JOB-2026-7777',
                    orderNo: 'ORD-2026-7777',
                    customerName: 'Kottawa Villa Projects',
                    customerPhone: '0755515862',
                    projectName: 'Luxury Villa Glass Facade',
                    siteAddress: 'Highlevel Road, Kottawa',
                    productSpecs: 'Matt Black 3-Track Sliding Door',
                    profileBrand: 'SwissTek',
                    notes: 'Suction cup glass lifting required.',
                    items: [
                        {
                            description: 'SwissTek 3-Track Frame',
                            alumSection: 'Sliding Door 2-Track (100mm)',
                            glassType: '8mm Tinted Dark Grey',
                            width: 3000,
                            height: 2400,
                            qty: 1
                        }
                    ]
                };

                window.deliveryModule.createDeliveryFromJob(testJob);
                const newDn = window.deliveryModule.deliveries[0];
                console.log('Generated Delivery Note:', newDn.dnNo);

                // Test status transitions
                window.deliveryModule.markAsDispatched(newDn.dnNo);
                console.log('Status after dispatch:', newDn.status);

                window.deliveryModule.markAsCompleted(newDn.dnNo);
                console.log('Status after completion:', newDn.status);

                // Test Detail View
                window.deliveryModule.renderDeliveryDetail(newDn.dnNo);

                // Test Print View generation
                const printHtml = window.deliveryModule.renderPrintView(newDn.dnNo);
                if (!printHtml || printHtml.length < 500) {
                    window.errorsFound.push('renderPrintView returned invalid HTML');
                } else {
                    console.log('Delivery Note Print View generated, HTML length:', printHtml.length);
                }

                // Render back to list
                window.deliveryModule.render();
                document.body.setAttribute('data-qa-complete', 'true');
            } catch (err) {
                console.error('QA Exception:', err);
                window.errorsFound.push(err.message || String(err));
            }
        });
    </script>
</body>
</html>'''

with open('test_delivery_qa.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Created test_delivery_qa.html successfully!')

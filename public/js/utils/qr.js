class QRService {
    constructor() {
        // Requires qrcode.js and jsbarcode.js included in the project
    }

    generateOrderQR(order) {
        const data = {
            type: 'order',
            id: order.id,
            orderNumber: order.orderNumber,
            customer: order.customerName,
            total: order.total
        };
        return this.generateQRCodeDataURL(JSON.stringify(data));
    }

    generateQuotationQR(quotation) {
        const data = {
            type: 'quotation',
            id: quotation.id,
            qtNumber: quotation.quotationNumber,
            customer: quotation.customerName,
            total: quotation.grandTotal
        };
        return this.generateQRCodeDataURL(JSON.stringify(data));
    }

    generateInvoiceQR(invoice) {
        const data = {
            type: 'invoice',
            id: invoice.id,
            invNumber: invoice.invoiceNumber,
            customer: invoice.customerName,
            total: invoice.grandTotal
        };
        return this.generateQRCodeDataURL(JSON.stringify(data));
    }

    generateInventoryBarcode(item) {
        const content = item.barcode || item.id;
        return this.generateBarcodeDataURL(content);
    }

    renderBarcodeLabel(item) {
        const barcodeDataURL = this.generateInventoryBarcode(item);
        
        return `
            <div class="barcode-label" style="width: 80mm; height: 40mm; padding: 5mm; border: 1px solid #ccc; box-sizing: border-box; text-align: center; font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; background: white;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${item.name}</div>
                <div style="font-size: 10px; color: #555; margin-bottom: 5px;">${item.category} - ${item.location || 'No Loc'}</div>
                <img src="${barcodeDataURL}" style="max-width: 100%; height: 20mm; object-fit: contain;" />
                <div style="font-size: 10px; margin-top: 2px;">ID: ${item.id}</div>
            </div>
        `;
    }

    printBarcodeLabel(itemId) {
        // In a real app, you'd fetch the item by ID.
        // Mocking for the utility demonstration:
        const mockItem = {
            id: itemId,
            name: 'Sample Item',
            category: 'Category',
            location: 'A1',
            barcode: itemId
        };

        const labelHtml = this.renderBarcodeLabel(mockItem);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Barcode Label</title>
                <style>
                    @page { size: 80mm 40mm; margin: 0; }
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    @media print {
                        .barcode-label { border: none !important; }
                    }
                </style>
            </head>
            <body>
                ${labelHtml}
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Helpers utilizing the CDN libraries

    generateQRCodeDataURL(text) {
        try {
            const canvas = document.createElement('canvas');
            // Assuming QRCode from qrcode.js is available
            QRCode.toCanvas(canvas, text, { width: 128, margin: 1 }, function (error) {
                if (error) console.error(error);
            });
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error("QR Code generation error:", error);
            // Fallback for simple testing if library isn't loaded properly
            // In a real environment, the library would handle drawing to the canvas
            const dummyCanvas = document.createElement('canvas');
            dummyCanvas.width = 100; dummyCanvas.height = 100;
            const ctx = dummyCanvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(10, 10, 80, 80);
            return dummyCanvas.toDataURL('image/png');
        }
    }

    generateBarcodeDataURL(text) {
        try {
            const canvas = document.createElement('canvas');
            // Assuming JsBarcode is available
            JsBarcode(canvas, text, {
                format: "CODE128",
                width: 2,
                height: 40,
                displayValue: true
            });
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error("Barcode generation error:", error);
            const dummyCanvas = document.createElement('canvas');
            dummyCanvas.width = 150; dummyCanvas.height = 50;
            const ctx = dummyCanvas.getContext('2d');
            ctx.fillStyle = 'black';
            for(let i=0; i<150; i+=5) {
                ctx.fillRect(i, 5, 3, 40);
            }
            return dummyCanvas.toDataURL('image/png');
        }
    }
}

window.qrService = new QRService();

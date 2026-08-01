class PDFService {
    constructor() {
        this.primaryColor = '#C41230';
        this.settings = {
            companyName: 'ALUGRADE LANKA FAB & GLASS',
            address: '123 Main Street, Colombo, Sri Lanka',
            phone: '+94 11 234 5678',
            email: 'info@alugrade.lk',
            logo: null // Base64 logo string should go here
        };
    }

    async generateQuotationPDF(quotationData) {
        return new Promise(async (resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const startY = this.addHeader(doc, this.settings, 'QUOTATION');
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                
                // Customer Info (Left)
                doc.text(`Customer: ${quotationData.customerName || 'N/A'}`, 15, startY + 10);
                doc.text(`Address: ${quotationData.customerAddress || 'N/A'}`, 15, startY + 15);
                doc.text(`Phone: ${quotationData.customerPhone || 'N/A'}`, 15, startY + 20);

                // Quotation Info (Right)
                doc.text(`QT#: ${quotationData.quotationNumber || 'N/A'}`, 140, startY + 10);
                doc.text(`Date: ${quotationData.date || new Date().toLocaleDateString()}`, 140, startY + 15);
                doc.text(`Valid Until: ${quotationData.validUntil || 'N/A'}`, 140, startY + 20);

                // Items Table
                const columns = ['#', 'Description', 'Category', 'Profile', 'Glass', 'W', 'H', 'Qty', 'Unit', 'Price', 'Disc', 'Amount'];
                const rows = (quotationData.items || []).map((item, index) => [
                    index + 1,
                    item.description,
                    item.category,
                    item.profile,
                    item.glass,
                    item.width,
                    item.height,
                    item.qty,
                    item.unit,
                    this.formatCurrency(item.price),
                    this.formatCurrency(item.discount),
                    this.formatCurrency(item.amount)
                ]);

                const tableEndY = this.addTable(doc, startY + 30, columns, rows);

                // Totals
                const totalsStartY = tableEndY + 10;
                doc.text(`Subtotal:`, 140, totalsStartY);
                doc.text(`${this.formatCurrency(quotationData.subtotal)}`, 180, totalsStartY, { align: 'right' });
                
                doc.text(`Discount:`, 140, totalsStartY + 5);
                doc.text(`${this.formatCurrency(quotationData.discountTotal)}`, 180, totalsStartY + 5, { align: 'right' });

                doc.text(`Tax:`, 140, totalsStartY + 10);
                doc.text(`${this.formatCurrency(quotationData.tax)}`, 180, totalsStartY + 10, { align: 'right' });

                doc.setFont(undefined, 'bold');
                doc.text(`Grand Total:`, 140, totalsStartY + 15);
                doc.text(`${this.formatCurrency(quotationData.grandTotal)}`, 180, totalsStartY + 15, { align: 'right' });
                doc.setFont(undefined, 'normal');

                doc.text(`Advance:`, 140, totalsStartY + 20);
                doc.text(`${this.formatCurrency(quotationData.advance)}`, 180, totalsStartY + 20, { align: 'right' });

                doc.text(`Balance:`, 140, totalsStartY + 25);
                doc.text(`${this.formatCurrency(quotationData.balance)}`, 180, totalsStartY + 25, { align: 'right' });

                // Additional Info
                const infoY = totalsStartY + 35;
                doc.setFontSize(9);
                doc.text(`Delivery Period: ${quotationData.deliveryPeriod || 'N/A'}`, 15, infoY);
                doc.text(`Warranty: ${quotationData.warranty || 'N/A'}`, 15, infoY + 5);
                doc.text(`Payment Terms: ${quotationData.paymentTerms || 'N/A'}`, 15, infoY + 10);
                doc.text(`Installation: ${quotationData.installation || 'N/A'}`, 15, infoY + 15);
                doc.text(`Transport: ${quotationData.transport || 'N/A'}`, 15, infoY + 20);

                // Terms & Conditions
                doc.setFontSize(8);
                doc.text('Terms & Conditions:', 15, infoY + 30);
                const terms = doc.splitTextToSize(quotationData.terms || 'Standard terms and conditions apply.', 180);
                doc.text(terms, 15, infoY + 35);

                // Signatures
                const sigY = infoY + 60;
                this.addSignatureLine(doc, 20, sigY, 'Prepared By');
                this.addSignatureLine(doc, 70, sigY, 'Checked By');
                this.addSignatureLine(doc, 120, sigY, 'Authorized Signatory');
                this.addSignatureLine(doc, 170, sigY, 'Customer Acceptance');

                if (quotationData.qrCode) {
                    this.addQRCode(doc, quotationData.qrCode, 160, sigY - 20, 25);
                }

                this.addFooter(doc, 1, 1);
                doc.save(`Quotation_${quotationData.quotationNumber || 'New'}.pdf`);
                resolve();
            } catch (error) {
                console.error('Error generating Quotation PDF:', error);
                reject(error);
            }
        });
    }

    async generateInvoicePDF(invoiceData) {
        return new Promise(async (resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const startY = this.addHeader(doc, this.settings, 'INVOICE');
                
                doc.setFontSize(10);
                
                doc.text(`Customer: ${invoiceData.customerName || 'N/A'}`, 15, startY + 10);
                doc.text(`Address: ${invoiceData.customerAddress || 'N/A'}`, 15, startY + 15);

                doc.text(`INV#: ${invoiceData.invoiceNumber || 'N/A'}`, 140, startY + 10);
                doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, 140, startY + 15);
                doc.text(`Order#: ${invoiceData.orderNumber || 'N/A'}`, 140, startY + 20);
                doc.text(`QT#: ${invoiceData.quotationNumber || 'N/A'}`, 140, startY + 25);

                const columns = ['#', 'Description', 'Qty', 'Unit', 'Unit Price', 'Amount'];
                const rows = (invoiceData.items || []).map((item, index) => [
                    index + 1,
                    item.description,
                    item.qty,
                    item.unit,
                    this.formatCurrency(item.unitPrice),
                    this.formatCurrency(item.amount)
                ]);

                const tableEndY = this.addTable(doc, startY + 35, columns, rows);

                const totalsStartY = tableEndY + 10;
                doc.text(`Subtotal:`, 140, totalsStartY);
                doc.text(`${this.formatCurrency(invoiceData.subtotal)}`, 180, totalsStartY, { align: 'right' });
                
                doc.setFont(undefined, 'bold');
                doc.text(`Grand Total:`, 140, totalsStartY + 10);
                doc.text(`${this.formatCurrency(invoiceData.grandTotal)}`, 180, totalsStartY + 10, { align: 'right' });
                
                doc.setTextColor(this.primaryColor);
                doc.text(`ADVANCE RECEIVED:`, 140, totalsStartY + 20);
                doc.text(`${this.formatCurrency(invoiceData.advance)}`, 180, totalsStartY + 20, { align: 'right' });
                
                doc.text(`REMAINING BALANCE:`, 140, totalsStartY + 30);
                doc.text(`${this.formatCurrency(invoiceData.balance)}`, 180, totalsStartY + 30, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');

                if (invoiceData.status && invoiceData.status.toLowerCase() === 'paid') {
                    doc.setFontSize(40);
                    doc.setTextColor(255, 0, 0);
                    doc.text('PAID', 105, tableEndY + 30, { angle: 45, align: 'center' }, null, 0.2);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(10);
                }

                // Payment History
                if (invoiceData.payments && invoiceData.payments.length > 0) {
                    doc.text('Payment History:', 15, tableEndY + 10);
                    let pyY = tableEndY + 15;
                    invoiceData.payments.forEach(p => {
                        doc.text(`${p.date} - ${p.method} - ${this.formatCurrency(p.amount)}`, 15, pyY);
                        pyY += 5;
                    });
                }

                const sigY = doc.internal.pageSize.getHeight() - 40;
                this.addSignatureLine(doc, 30, sigY, 'Issued By');
                this.addSignatureLine(doc, 140, sigY, 'Customer Signature');

                this.addFooter(doc, 1, 1);
                doc.save(`Invoice_${invoiceData.invoiceNumber || 'New'}.pdf`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateReportPDF(reportData, title, columns) {
        return new Promise(async (resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const orientation = columns.length > 6 ? 'landscape' : 'portrait';
                const doc = new jsPDF({ orientation: orientation, unit: 'mm', format: 'a4' });
                const startY = this.addHeader(doc, this.settings, 'REPORT');
                
                doc.setFontSize(14);
                doc.text(title, 15, startY + 10);
                doc.setFontSize(10);
                doc.text(`Date Range: ${reportData.dateRange || 'N/A'}`, 15, startY + 17);

                // Stats cards inline (simplified)
                if (reportData.stats) {
                    let statX = 15;
                    Object.keys(reportData.stats).forEach(key => {
                        doc.text(`${key}: ${reportData.stats[key]}`, statX, startY + 25);
                        statX += 50;
                    });
                }

                const rows = reportData.data || [];
                const tableEndY = this.addTable(doc, startY + 35, columns, rows);

                if (reportData.totals) {
                    doc.setFont(undefined, 'bold');
                    doc.text(`Total: ${this.formatCurrency(reportData.totals)}`, 15, tableEndY + 10);
                    doc.setFont(undefined, 'normal');
                }

                this.addFooter(doc, 1, 1);
                doc.save(`Report_${title.replace(/\s+/g, '_')}.pdf`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateCustomerStatementPDF(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const statementData = await this.fetchCustomerStatementData(customerId);
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const startY = this.addHeader(doc, this.settings, 'CUSTOMER STATEMENT');
                
                doc.setFontSize(10);
                doc.text(`Customer Name: ${statementData.name}`, 15, startY + 10);
                doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, startY + 10);

                const columns = ['Date', 'Description', 'Ref', 'Debit', 'Credit', 'Balance'];
                let runningBalance = 0;
                const rows = (statementData.transactions || []).map(t => {
                    runningBalance += (t.debit || 0) - (t.credit || 0);
                    return [
                        t.date,
                        t.description,
                        t.ref,
                        this.formatCurrency(t.debit),
                        this.formatCurrency(t.credit),
                        this.formatCurrency(runningBalance)
                    ];
                });

                const tableEndY = this.addTable(doc, startY + 25, columns, rows);

                doc.setFont(undefined, 'bold');
                doc.text(`Closing Balance: ${this.formatCurrency(runningBalance)}`, 140, tableEndY + 10);
                doc.setFont(undefined, 'normal');

                this.addFooter(doc, 1, 1);
                doc.save(`Statement_${statementData.name.replace(/\s+/g, '_')}.pdf`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateReceiptPDF(paymentData) {
        return new Promise(async (resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
                const startY = this.addHeader(doc, this.settings, 'PAYMENT RECEIPT');
                
                doc.setFontSize(10);
                doc.text(`Receipt#: ${paymentData.receiptNumber || 'N/A'}`, 15, startY + 10);
                doc.text(`Date: ${paymentData.date || new Date().toLocaleDateString()}`, 15, startY + 15);
                
                doc.text(`Received From: ${paymentData.customerName || 'N/A'}`, 15, startY + 25);
                doc.text(`Payment Method: ${paymentData.method || 'N/A'}`, 15, startY + 30);
                doc.text(`Reference / Notes: ${paymentData.notes || 'N/A'}`, 15, startY + 35);
                
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(`Amount: ${this.formatCurrency(paymentData.amount)}`, 15, startY + 45);
                doc.setFont(undefined, 'normal');
                doc.setFontSize(10);
                
                doc.text(`Remaining Balance: ${this.formatCurrency(paymentData.balance)}`, 15, startY + 55);
                
                doc.text('Thank you for your business!', 15, startY + 70);

                this.addSignatureLine(doc, 15, startY + 90, 'Authorized Signature');

                doc.save(`Receipt_${paymentData.receiptNumber || 'New'}.pdf`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    addHeader(doc, settings, title) {
        if (settings.logo) {
            this.embedLogo(doc, settings.logo, 15, 10, 40, 20);
        }
        
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(settings.companyName, 60, 15);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(settings.address, 60, 20);
        doc.text(`Phone: ${settings.phone} | Email: ${settings.email}`, 60, 25);
        
        doc.setFontSize(22);
        doc.setTextColor(this.primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text(title, doc.internal.pageSize.getWidth() - 15, 25, { align: 'right' });
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 32, doc.internal.pageSize.getWidth() - 15, 32);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        return 35;
    }

    addFooter(doc, pageNum, totalPages) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(8);
        doc.text(this.settings.companyName, 15, pageHeight - 10);
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
    }

    addTable(doc, startY, columns, rows, options = {}) {
        let currentY = startY;
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const tableWidth = pageWidth - (margin * 2);
        const colWidth = tableWidth / columns.length;

        // Header
        doc.setFillColor(this.primaryColor);
        doc.setTextColor(255, 255, 255);
        doc.rect(margin, currentY, tableWidth, 10, 'F');
        doc.setFont(undefined, 'bold');
        
        columns.forEach((col, index) => {
            doc.text(col, margin + (index * colWidth) + 2, currentY + 7);
        });
        
        currentY += 10;
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');

        // Rows
        rows.forEach((row, rowIndex) => {
            if (rowIndex % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(margin, currentY, tableWidth, 10, 'F');
            }
            row.forEach((cell, cellIndex) => {
                const text = String(cell || '');
                // Handle text wrapping if needed, simplified here
                doc.text(text.substring(0, 20), margin + (cellIndex * colWidth) + 2, currentY + 7);
            });
            currentY += 10;
        });
        
        return currentY;
    }

    addSignatureLine(doc, x, y, label) {
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.3);
        doc.line(x, y, x + 40, y);
        doc.setFontSize(8);
        doc.text(label, x + 20, y + 4, { align: 'center' });
    }

    addOfficialSignatureBlock(doc, x, y) {
        // Draw line divider
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.4);
        doc.line(x, y, x + 50, y);
        
        // Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text('MR. M. U. RAJAPAKSHA', x + 25, y + 5, { align: 'center' });

        // Title
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Managing Director', x + 25, y + 9, { align: 'center' });

        // Company
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('ALUGRADE LANKA FAB & GLASS', x + 25, y + 13, { align: 'center' });
    }

    embedLogo(doc, base64Logo, x, y, maxW, maxH) {
        doc.addImage(base64Logo, 'JPEG', x, y, maxW, maxH);
    }

    addQRCode(doc, text, x, y, size) {
        // Assuming text is already a base64 data URL for an image generated by qrcode.js
        if(text.startsWith('data:image')) {
            doc.addImage(text, 'JPEG', x, y, size, size);
        }
    }

    mm2pt(mm) {
        return mm * 2.83465;
    }
    
    formatCurrency(amount) {
        const val = parseFloat(amount);
        if (isNaN(val)) return '0.00';
        return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    async fetchCustomerStatementData(customerId) {
        // Mock data fetch
        return {
            name: 'John Doe',
            transactions: [
                { date: '2023-01-01', description: 'Invoice #001', ref: 'INV-001', debit: 1000, credit: 0 },
                { date: '2023-01-15', description: 'Payment', ref: 'PAY-001', debit: 0, credit: 500 }
            ]
        };
    }
}

window.pdfService = new PDFService();

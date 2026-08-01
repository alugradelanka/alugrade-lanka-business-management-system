class ExcelService {
    constructor() {
        this.prefix = 'ALUGRADE';
    }

    exportCustomers(customers) {
        const data = customers.map(c => ({
            'Customer ID': c.id,
            'Name': c.name,
            'Company': c.company,
            'Phone': c.phone,
            'Alt Phone': c.altPhone,
            'Email': c.email,
            'Billing Address': c.billingAddress,
            'Site Address': c.siteAddress,
            'City': c.city,
            'District': c.district,
            'Orders': c.ordersCount,
            'Outstanding Balance': c.outstandingBalance,
            'Status': c.status,
            'Created Date': c.createdDate
        }));
        
        this.exportData(data, 'Customers', 'Customers');
    }

    exportOrders(orders, dateLabel) {
        const data = orders.map(o => ({
            'Order#': o.orderNumber,
            'Date': o.date,
            'Customer': o.customerName,
            'Phone': o.phone,
            'Product': o.product,
            'Category': o.category,
            'Width': o.width,
            'Height': o.height,
            'Qty': o.qty,
            'Unit Price': o.unitPrice,
            'Total': o.total,
            'Advance': o.advance,
            'Balance': o.balance,
            'Production Status': o.productionStatus,
            'Payment Status': o.paymentStatus,
            'Order Status': o.orderStatus,
            'Installer': o.installer,
            'Delivery Date': o.deliveryDate
        }));
        
        this.exportData(data, 'Orders', `Orders_${dateLabel}`);
    }

    exportInventory(items) {
        const data = items.map(i => ({
            'Item ID': i.id,
            'Name': i.name,
            'Category': i.category,
            'Brand': i.brand,
            'Supplier': i.supplier,
            'Stock Qty': i.stockQty,
            'Min Stock': i.minStock,
            'Max Stock': i.maxStock,
            'Purchase Price': i.purchasePrice,
            'Selling Price': i.sellingPrice,
            'Total Value': i.stockQty * i.sellingPrice,
            'Location': i.location,
            'Barcode': i.barcode
        }));
        
        this.exportData(data, 'Inventory', 'Inventory');
    }

    exportPayments(payments) {
        const data = payments.map(p => ({
            'PAY#': p.payNumber,
            'Date': p.date,
            'Customer': p.customerName,
            'Order#': p.orderNumber,
            'Invoice#': p.invoiceNumber,
            'Method': p.method,
            'Amount': p.amount,
            'Receipt#': p.receiptNumber,
            'Status': p.status,
            'Notes': p.notes
        }));
        
        this.exportData(data, 'Payments', 'Payments');
    }

    exportExpenses(expenses) {
        const data = expenses.map(e => ({
            'Expense ID': e.id,
            'Date': e.date,
            'Category': e.category,
            'Description': e.description,
            'Supplier': e.supplier,
            'Amount': e.amount,
            'Payment Method': e.paymentMethod,
            'Receipt#': e.receiptNumber
        }));
        
        this.exportData(data, 'Expenses', 'Expenses');
    }

    exportReport(data, title, columns, sheetName) {
        const formattedData = data.map(item => {
            const row = {};
            columns.forEach((col, index) => {
                row[col] = item[Object.keys(item)[index]];
            });
            return row;
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        
        // Add Title Row
        XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });
        
        this.autoWidth(ws, formattedData);
        this.applyHeaderStyle(ws, "A2:Z2");
        
        this.addMetaSheet(wb, title, new Date().toLocaleDateString(), 'System Admin');
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        this.downloadWorkbook(wb, `${this.prefix}_Report_${title}_${this.getDateString()}.xlsx`);
    }

    exportQuotationList(quotations) {
        const data = quotations.map(q => ({
            'QT#': q.number,
            'Date': q.date,
            'Customer': q.customer,
            'Total Amount': q.total,
            'Status': q.status,
            'Valid Until': q.validUntil
        }));
        this.exportData(data, 'Quotations', 'Quotations');
    }

    exportInvoiceList(invoices) {
        const data = invoices.map(i => ({
            'INV#': i.number,
            'Date': i.date,
            'Customer': i.customer,
            'Total': i.total,
            'Paid': i.paid,
            'Balance': i.balance,
            'Status': i.status
        }));
        this.exportData(data, 'Invoices', 'Invoices');
    }

    exportData(data, sheetName, typeLabel) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        
        this.autoWidth(ws, data);
        this.applyHeaderStyle(ws, "A1:Z1");
        
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        const filename = `${this.prefix}_${typeLabel}_${this.getDateString()}.xlsx`;
        this.downloadWorkbook(wb, filename);
    }

    downloadWorkbook(workbook, filename) {
        XLSX.writeFile(workbook, filename);
    }

    applyHeaderStyle(ws, range) {
        // SheetJS Free version doesn't support complex styling natively without Pro,
        // but this placeholder represents where header bolding would occur.
        // E.g. using sheetjs-style or modifying cell objects if supported.
    }

    applyTotalsStyle(ws, row) {
        // Placeholder for totals row styling
    }

    autoWidth(ws, data) {
        if (!data || data.length === 0) return;
        
        const colWidths = Object.keys(data[0]).map(key => {
            const maxContentLength = Math.max(
                ...data.map(row => String(row[key] || '').length),
                key.length
            );
            return { wch: maxContentLength + 2 };
        });
        
        ws['!cols'] = colWidths;
    }

    formatCurrencyCell(value) {
        return parseFloat(value).toFixed(2);
    }

    addMetaSheet(wb, title, dateRange, generatedBy) {
        const metaData = [
            ["Report Title", title],
            ["Generated Date", new Date().toLocaleString()],
            ["Date Range", dateRange],
            ["Generated By", generatedBy]
        ];
        const ws = XLSX.utils.aoa_to_sheet(metaData);
        this.autoWidth(ws, metaData.map(r => ({ col1: r[0], col2: r[1] })));
        XLSX.utils.book_append_sheet(wb, ws, "Metadata");
    }

    getDateString() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
}

window.excelService = new ExcelService();

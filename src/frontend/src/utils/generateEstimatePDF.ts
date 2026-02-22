import type { Estimate, Customer } from '../backend';

interface GeneratePDFOptions {
  estimate: Estimate;
  customer?: Customer;
}

export async function generateEstimatePDF({ estimate, customer }: GeneratePDFOptions): Promise<void> {
  // Helper function to format currency
  const formatCurrency = (value: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(value) / 100);
  };

  // Helper function to format date
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const sqftSubtotal = Number(estimate.squareFootage) * Number(estimate.pricePerSquareFoot);

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Phoenix Shield Estimate #${estimate.estimateId.toString()}</title>
      <style>
        @media print {
          @page {
            margin: 0.5in;
            size: letter portrait;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #84cc16;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        
        .company-info {
          flex: 1;
        }
        
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #1e3a52;
          margin: 0;
        }
        
        .company-tagline {
          font-size: 14px;
          color: #666;
          margin: 5px 0 0 0;
        }
        
        .estimate-info {
          text-align: right;
          font-size: 12px;
          color: #666;
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #1e3a52;
          margin: 20px 0;
        }
        
        .customer-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
        }
        
        .customer-section h3 {
          font-size: 14px;
          font-weight: bold;
          color: #1e3a52;
          margin: 0 0 10px 0;
        }
        
        .customer-section p {
          margin: 5px 0;
          font-size: 12px;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1e3a52;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .line-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 13px;
        }
        
        .line-item.header {
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .materials-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        
        .materials-table th {
          text-align: left;
          padding: 8px;
          background: #f8f9fa;
          font-weight: bold;
          font-size: 12px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .materials-table td {
          padding: 8px;
          font-size: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .materials-table th:last-child,
        .materials-table td:last-child {
          text-align: right;
        }
        
        .subtotal {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-weight: bold;
          font-size: 14px;
        }
        
        .total-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 3px solid #84cc16;
        }
        
        .grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .grand-total .label {
          font-size: 20px;
          font-weight: bold;
          color: #1e3a52;
        }
        
        .grand-total .amount {
          font-size: 24px;
          font-weight: bold;
          color: #84cc16;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #666;
          text-align: center;
        }
        
        .footer p {
          margin: 5px 0;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          background: #1e3a52;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1000;
        }
        
        .print-button:hover {
          background: #2d5273;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">Print / Save as PDF</button>
      
      <div class="header">
        <div class="company-info">
          <h1 class="company-name">Phoenix Shield</h1>
          <p class="company-tagline">Professional Mold Remediation</p>
        </div>
        <div class="estimate-info">
          <div><strong>Date:</strong> ${formatDate(estimate.creationDate)}</div>
          <div><strong>Estimate #:</strong> ${estimate.estimateId.toString()}</div>
        </div>
      </div>
      
      <h2 class="title">ESTIMATE</h2>
      
      ${customer ? `
        <div class="customer-section">
          <h3>CUSTOMER INFORMATION</h3>
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
          <p><strong>Email:</strong> ${customer.emailAddress}</p>
          <p><strong>Address:</strong> ${customer.physicalAddress}</p>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">SQUARE FOOTAGE</div>
        <div class="line-item">
          <span>${estimate.squareFootage.toString()} sq ft × ${formatCurrency(estimate.pricePerSquareFoot)}/sq ft</span>
          <span>${formatCurrency(BigInt(sqftSubtotal))}</span>
        </div>
      </div>
      
      ${estimate.materials.length > 0 ? `
        <div class="section">
          <div class="section-title">MATERIALS</div>
          <table class="materials-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Cost</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${estimate.materials.map(material => {
                const lineTotal = Number(material.quantity) * Number(material.unitCost);
                return `
                  <tr>
                    <td>${material.name}</td>
                    <td style="text-align: center;">${material.quantity.toString()}</td>
                    <td style="text-align: right;">${formatCurrency(material.unitCost)}</td>
                    <td style="text-align: right;">${formatCurrency(BigInt(lineTotal))}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="subtotal">
            <span>Materials Subtotal:</span>
            <span>${formatCurrency(estimate.totalMaterialCost)}</span>
          </div>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">LABOR</div>
        <div class="line-item">
          <span>${estimate.laborHours.toString()} hours × ${formatCurrency(estimate.laborHourlyRate)}/hour</span>
          <span>${formatCurrency(estimate.totalLaborCost)}</span>
        </div>
      </div>
      
      <div class="total-section">
        <div class="grand-total">
          <span class="label">GRAND TOTAL:</span>
          <span class="amount">${formatCurrency(estimate.totalEstimate)}</span>
        </div>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Phoenix Shield for your mold remediation needs.</p>
        <p>This estimate is valid for 30 days from the date above.</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window and trigger print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before triggering print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
      }, 250);
    };
  } else {
    throw new Error('Unable to open print window. Please check your popup blocker settings.');
  }
}

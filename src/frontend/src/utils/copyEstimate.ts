import type { Estimate } from '../backend';

export async function copyEstimateToClipboard(estimate: Estimate): Promise<void> {
  const formatCurrency = (value: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  const squareFootageSubtotal = Number(estimate.squareFootage) * Number(estimate.pricePerSquareFoot);

  let text = '=== ESTIMATE ===\n\n';
  
  // Square Footage Section
  text += 'SQUARE FOOTAGE\n';
  text += `${estimate.squareFootage} sq ft × ${formatCurrency(estimate.pricePerSquareFoot)}/sq ft = ${formatCurrency(BigInt(squareFootageSubtotal))}\n\n`;
  
  // Materials Section
  if (estimate.materials.length > 0) {
    text += 'MATERIALS\n';
    estimate.materials.forEach((material) => {
      const lineTotal = Number(material.quantity) * Number(material.unitCost);
      text += `${material.name}: ${material.quantity} × ${formatCurrency(material.unitCost)} = ${formatCurrency(BigInt(lineTotal))}\n`;
    });
    text += `Materials Total: ${formatCurrency(estimate.totalMaterialCost)}\n\n`;
  }
  
  // Labor Section
  text += 'LABOR\n';
  text += `${estimate.laborHours} hours × ${formatCurrency(estimate.laborHourlyRate)}/hour = ${formatCurrency(estimate.totalLaborCost)}\n\n`;
  
  // Grand Total
  text += '-------------------\n';
  text += `GRAND TOTAL: ${formatCurrency(estimate.totalEstimate)}\n`;
  text += '===================';

  await navigator.clipboard.writeText(text);
}

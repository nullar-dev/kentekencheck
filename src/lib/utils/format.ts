export function normalizePlate(plate: string): string {
  return plate.replace(/-/g, '').toUpperCase();
}

export function isValidPlateFormat(plate: string): boolean {
  return /^[A-Z0-9-]+$/i.test(plate);
}

export function formatRDWDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
  }
  return dateStr;
}

export function formatEuro(value: string | null): string {
  if (!value) return '-';
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return `€ ${num.toLocaleString('nl-NL')}`;
  }
  return value;
}

export function formatMeasurement(value: string | null, unit: string): string {
  if (!value) return '-';
  return `${value} ${unit}`;
}

export function formatKilograms(value: string | null): string {
  return formatMeasurement(value, 'kg');
}

export function formatMillimeters(value: string | null): string {
  return formatMeasurement(value, 'mm');
}

export function formatCC(value: string | null): string {
  return formatMeasurement(value, 'cc');
}

export function formatKwKg(value: string | null): string {
  return formatMeasurement(value, 'kW/kg');
}

export function formatLper100km(value: string | null): string {
  return formatMeasurement(value, 'l/100km');
}

export function formatGperKm(value: string | null): string {
  return formatMeasurement(value, 'g/km');
}

export function formatDb(value: string | null): string {
  return formatMeasurement(value, 'dB');
}

export function formatRpm(value: string | null): string {
  return formatMeasurement(value, 'rpm');
}

export function formatKw(value: string | null): string {
  return formatMeasurement(value, 'kW');
}

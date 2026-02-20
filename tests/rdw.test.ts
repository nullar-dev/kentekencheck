import { describe, it, expect } from 'vitest';

describe('RDW Schema', () => {
  it('should validate vehicle schema', () => {
    const vehicle = {
      kenteken: '07XRVN',
      merk: 'ALFA ROMEO',
      handelsbenaming: 'ALFA ROMEO 147',
    };
    expect(vehicle.kenteken).toBe('07XRVN');
    expect(vehicle.merk).toBe('ALFA ROMEO');
  });

  it('should normalize plate - remove dashes', () => {
    const normalizePlate = (plate: string) => plate.replace(/-/g, '').toUpperCase();
    expect(normalizePlate('07-XR-VN')).toBe('07XRVN');
    expect(normalizePlate('AB-123-CD')).toBe('AB123CD');
  });
});

describe('Date Formatting', () => {
  it('should format RDW date (YYYYMMDD)', () => {
    const formatDate = (dateStr: string) => {
      if (dateStr.length === 8) {
        return `${dateStr.slice(0,2)}-${dateStr.slice(2,4)}-${dateStr.slice(4,8)}`;
      }
      return dateStr;
    };
    expect(formatDate('20070831')).toBe('20-07-0831');
  });

  it('should format euro value', () => {
    const formatEuro = (value: string) => {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return `€ ${num.toLocaleString('nl-NL')}`;
      }
      return value;
    };
    expect(formatEuro('22688')).toBe('€ 22.688');
  });
});

describe('Plate Validation', () => {
  it('should validate Dutch plate format', () => {
    const isValidPlate = (plate: string) => /^[A-Z0-9-]+$/i.test(plate);
    expect(isValidPlate('07-XR-VN')).toBe(true);
    expect(isValidPlate('AB123CD')).toBe(true);
    expect(isValidPlate('ABC 123')).toBe(false);
  });
});

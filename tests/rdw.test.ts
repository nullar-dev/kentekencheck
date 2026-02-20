import { describe, it, expect } from 'vitest';
import { normalizePlate, isValidPlateFormat, formatEuro, formatRDWDate } from '@/lib/utils/format';
import { VehicleSchema } from '@/lib/rdw/schemas';

describe('RDW Schema', () => {
  it('should validate vehicle schema', () => {
    const vehicle = {
      kenteken: '07XRVN',
      merk: 'ALFA ROMEO',
      handelsbenaming: 'ALFA ROMEO 147',
    };
    
    const result = VehicleSchema.safeParse(vehicle);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kenteken).toBe('07XRVN');
      expect(result.data.merk).toBe('ALFA ROMEO');
    }
  });

  it('should normalize plate - remove dashes', () => {
    expect(normalizePlate('07-XR-VN')).toBe('07XRVN');
    expect(normalizePlate('AB-123-CD')).toBe('AB123CD');
  });
});

describe('Date Formatting', () => {
  it('should format RDW date (YYYYMMDD)', () => {
    expect(formatRDWDate('20070831')).toBe('2007-08-31');
  });

  it('should format euro value', () => {
    expect(formatEuro('22688')).toBe('€ 22.688');
  });
});

describe('Plate Validation', () => {
  it('should validate Dutch plate format', () => {
    expect(isValidPlateFormat('07-XR-VN')).toBe(true);
    expect(isValidPlateFormat('AB123CD')).toBe(true);
    expect(isValidPlateFormat('ABC 123')).toBe(false);
  });
});

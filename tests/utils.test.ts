import { describe, it, expect } from 'vitest';
import {
  normalizePlate,
  isValidPlateFormat,
  formatRDWDate,
  formatEuro,
  formatMeasurement,
  formatKilograms,
  formatMillimeters,
  formatCC,
  formatKwKg,
  formatLper100km,
  formatGperKm,
  formatDb,
  formatRpm,
  formatKw,
} from '../src/lib/utils/format';
import {
  validatePlateParams,
  PlateParamsSchema,
  ErrorResponseSchema,
} from '../src/lib/utils/validation';

describe('Plate Utilities', () => {
  describe('normalizePlate', () => {
    it('should remove dashes from plate', () => {
      expect(normalizePlate('07-XR-VN')).toBe('07XRVN');
    });

    it('should convert to uppercase', () => {
      expect(normalizePlate('ab-123-cd')).toBe('AB123CD');
    });

    it('should handle plate without dashes', () => {
      expect(normalizePlate('AB123CD')).toBe('AB123CD');
    });

    it('should handle empty string', () => {
      expect(normalizePlate('')).toBe('');
    });
  });

  describe('isValidPlateFormat', () => {
    it('should return true for valid plates with dashes', () => {
      expect(isValidPlateFormat('07-XR-VN')).toBe(true);
    });

    it('should return true for valid plates without dashes', () => {
      expect(isValidPlateFormat('AB123CD')).toBe(true);
    });

    it('should return false for plates with spaces', () => {
      expect(isValidPlateFormat('AB 123 CD')).toBe(false);
    });

    it('should return false for special characters', () => {
      expect(isValidPlateFormat('AB_123_CD')).toBe(false);
    });
  });
});

describe('Date Formatting', () => {
  describe('formatRDWDate', () => {
    it('should format 8-digit date', () => {
      expect(formatRDWDate('20070831')).toBe('2007-08-31');
    });

    it('should return dash for null', () => {
      expect(formatRDWDate(null)).toBe('-');
    });

    it('should return dash for empty string', () => {
      expect(formatRDWDate('')).toBe('-');
    });

    it('should return original for invalid format', () => {
      expect(formatRDWDate('2023-01-15')).toBe('2023-01-15');
    });
  });
});

describe('Euro Formatting', () => {
  describe('formatEuro', () => {
    it('should format number with euro sign', () => {
      expect(formatEuro('22688')).toBe('€ 22.688');
    });

    it('should return dash for null', () => {
      expect(formatEuro(null)).toBe('-');
    });

    it('should return dash for empty string', () => {
      expect(formatEuro('')).toBe('-');
    });

    it('should return original for non-numeric', () => {
      expect(formatEuro('abc')).toBe('abc');
    });
  });
});

describe('Measurement Formatting', () => {
  describe('formatMeasurement', () => {
    it('should format with unit', () => {
      expect(formatMeasurement('100', 'kg')).toBe('100 kg');
    });

    it('should return dash for null', () => {
      expect(formatMeasurement(null, 'kg')).toBe('-');
    });

    it('should return dash for empty string', () => {
      expect(formatMeasurement('', 'kg')).toBe('-');
    });
  });

  describe('formatKilograms', () => {
    it('should format as kg', () => {
      expect(formatKilograms('1185')).toBe('1185 kg');
    });

    it('should return dash for null', () => {
      expect(formatKilograms(null)).toBe('-');
    });
  });

  describe('formatMillimeters', () => {
    it('should format as mm', () => {
      expect(formatMillimeters('255')).toBe('255 mm');
    });

    it('should return dash for null', () => {
      expect(formatMillimeters(null)).toBe('-');
    });
  });

  describe('formatCC', () => {
    it('should format as cc', () => {
      expect(formatCC('1598')).toBe('1598 cc');
    });

    it('should return dash for null', () => {
      expect(formatCC(null)).toBe('-');
    });
  });

  describe('formatKwKg', () => {
    it('should format as kW/kg', () => {
      expect(formatKwKg('0.06')).toBe('0.06 kW/kg');
    });

    it('should return dash for null', () => {
      expect(formatKwKg(null)).toBe('-');
    });
  });

  describe('formatLper100km', () => {
    it('should format as l/100km', () => {
      expect(formatLper100km('8.20')).toBe('8.20 l/100km');
    });

    it('should return dash for null', () => {
      expect(formatLper100km(null)).toBe('-');
    });
  });

  describe('formatGperKm', () => {
    it('should format as g/km', () => {
      expect(formatGperKm('196')).toBe('196 g/km');
    });

    it('should return dash for null', () => {
      expect(formatGperKm(null)).toBe('-');
    });
  });

  describe('formatDb', () => {
    it('should format as dB', () => {
      expect(formatDb('72')).toBe('72 dB');
    });

    it('should return dash for null', () => {
      expect(formatDb(null)).toBe('-');
    });
  });

  describe('formatRpm', () => {
    it('should format as rpm', () => {
      expect(formatRpm('4200')).toBe('4200 rpm');
    });

    it('should return dash for null', () => {
      expect(formatRpm(null)).toBe('-');
    });
  });

  describe('formatKw', () => {
    it('should format as kW', () => {
      expect(formatKw('77.00')).toBe('77.00 kW');
    });

    it('should return dash for null', () => {
      expect(formatKw(null)).toBe('-');
    });
  });
});

describe('Validation', () => {
  describe('validatePlateParams', () => {
    it('should validate valid plate', () => {
      const result = validatePlateParams({ plate: '07-XR-VN' });
      expect(result.success).toBe(true);
    });

    it('should reject empty plate', () => {
      const result = validatePlateParams({ plate: '' });
      expect(result.success).toBe(false);
    });

    it('should reject too long plate', () => {
      const result = validatePlateParams({ plate: 'ABCDEFGHIJK' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid characters', () => {
      const result = validatePlateParams({ plate: 'AB 123 CD' });
      expect(result.success).toBe(false);
    });
  });

  describe('PlateParamsSchema', () => {
    it('should parse valid input', () => {
      const result = PlateParamsSchema.safeParse({ plate: 'AB-123-CD' });
      expect(result.success).toBe(true);
    });

    it('should provide error for empty input', () => {
      const result = PlateParamsSchema.safeParse({ plate: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Kenteken is verplicht');
      }
    });
  });

  describe('ErrorResponseSchema', () => {
    it('should parse error response', () => {
      const result = ErrorResponseSchema.safeParse({ error: 'Not found' });
      expect(result.success).toBe(true);
    });

    it('should parse error with details', () => {
      const result = ErrorResponseSchema.safeParse({
        error: 'Validation failed',
        details: [{ field: 'plate', message: 'Required' }]
      });
      expect(result.success).toBe(true);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  VehicleSchema,
  FuelSchema,
  AxleSchema,
  APKHistorySchema,
  VehicleResponseSchema,
} from '../src/lib/rdw/schemas';

describe('RDW Schemas', () => {
  describe('VehicleSchema', () => {
    it('should parse valid vehicle data', () => {
      const data = {
        kenteken: '07XRVN',
        merk: 'ALFA ROMEO',
        handelsbenaming: 'ALFA ROMEO 147',
        tellerstandoordeel: 'Logisch',
        voertuigsoort: 'Personenauto',
        eerste_kleur: 'ZWART',
        aantal_cilinders: '4',
        cilinderinhoud: '1598',
        massa_ledig_voertuig: '1185',
      };
      const result = VehicleSchema.parse(data);
      expect(result.kenteken).toBe('07XRVN');
      expect(result.merk).toBe('ALFA ROMEO');
    });

    it('should handle nullable fields', () => {
      const data = {
        kenteken: '07XRVN',
        merk: null,
        handelsbenaming: null,
      };
      const result = VehicleSchema.parse(data);
      expect(result.merk).toBeNull();
    });

    it('should handle optional fields', () => {
      const data = {
        kenteken: '07XRVN',
      };
      const result = VehicleSchema.parse(data);
      expect(result.voertuigsoort).toBeUndefined();
    });
  });

  describe('FuelSchema', () => {
    it('should parse valid fuel data', () => {
      const data = {
        kenteken: '07XRVN',
        brandstof_omschrijving: 'Benzine',
        co2_uitstoot_gecombineerd: '196',
        emissiecode_omschrijving: '4',
      };
      const result = FuelSchema.parse(data);
      expect(result.brandstof_omschrijving).toBe('Benzine');
    });

    it('should handle all fuel fields', () => {
      const data = {
        kenteken: '07XRVN',
        brandstof_volgnummer: '1',
        brandstof_omschrijving: 'Benzine',
        brandstofverbruik_buiten: '6.40',
        brandstofverbruik_gecombineerd: '8.20',
        brandstofverbruik_stad: '11.30',
        co2_uitstoot_gecombineerd: '196',
        geluidsniveau_rijdend: '72',
        geluidsniveau_stationair: '82',
        emissiecode_omschrijving: '4',
        milieuklasse_eg_goedkeuring_licht: '70/220*2003/76B',
        nettomaximumvermogen: '77.00',
        toerental_geluidsniveau: '4200',
        uitlaatemissieniveau: 'EURO 4',
      };
      const result = FuelSchema.parse(data);
      expect(result.co2_uitstoot_gecombineerd).toBe('196');
    });
  });

  describe('AxleSchema', () => {
    it('should parse valid axle data', () => {
      const data = {
        kenteken: '07XRVN',
        as_nummer: '1',
        spoorbreedte: '152',
      };
      const result = AxleSchema.parse(data);
      expect(result.as_nummer).toBe('1');
      expect(result.spoorbreedte).toBe('152');
    });

    it('should handle optional axle fields', () => {
      const data = {
        kenteken: '07XRVN',
        as_nummer: '1',
        spoorbreedte: '152',
        aantal_assen: '2',
        wettelijk_toegestane_maximum_aslast: '980',
        technisch_toegestane_maximum_aslast: '980',
      };
      const result = AxleSchema.parse(data);
      expect(result.aantal_assen).toBe('2');
    });
  });

  describe('APKHistorySchema', () => {
    it('should parse valid APK history', () => {
      const data = {
        inspectionDate: '2024-01-15',
        result: 'Goedgekeurd',
      };
      const result = APKHistorySchema.parse(data);
      expect(result.inspectionDate).toBe('2024-01-15');
      expect(result.result).toBe('Goedgekeurd');
    });

    it('should handle optional fields', () => {
      const data = {
        inspectionDate: '2024-01-15',
        result: 'Afgekeurd',
        afterRepair: true,
        defects: ['Remmen', 'Banden'],
      };
      const result = APKHistorySchema.parse(data);
      expect(result.afterRepair).toBe(true);
      expect(result.defects).toEqual(['Remmen', 'Banden']);
    });
  });

  describe('VehicleResponseSchema', () => {
    it('should parse full vehicle response', () => {
      const data = {
        vehicle: {
          kenteken: '07XRVN',
          merk: 'ALFA ROMEO',
        },
        fuel: {
          kenteken: '07XRVN',
          brandstof_omschrijving: 'Benzine',
        },
        axles: [
          { kenteken: '07XRVN', as_nummer: '1', spoorbreedte: '152' },
        ],
        apkHistory: [],
      };
      const result = VehicleResponseSchema.parse(data);
      expect(result.vehicle?.merk).toBe('ALFA ROMEO');
      expect(result.fuel?.brandstof_omschrijving).toBe('Benzine');
      expect(result.axles).toHaveLength(1);
    });

    it('should handle null vehicle', () => {
      const data = {
        vehicle: null,
        fuel: null,
        axles: [],
      };
      const result = VehicleResponseSchema.parse(data);
      expect(result.vehicle).toBeNull();
    });

    it('should handle missing optional fields', () => {
      const data = {
        vehicle: { kenteken: '07XRVN' },
      };
      const result = VehicleResponseSchema.parse(data);
      expect(result.vehicle?.merk).toBeUndefined();
      expect(result.fuel).toBeUndefined();
    });
  });
});

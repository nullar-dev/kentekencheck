import { z } from 'zod';

export const VehicleSchema = z.object({
  kenteken: z.string(),
  merk: z.string().nullable().optional(),
  handelsbenaming: z.string().nullable().optional(),
  tellerstandoordeel: z.string().nullable().optional(),
  api_geimporteerd: z.string().nullable().optional(),
  voertuigsoort: z.string().nullable().optional(),
  eerste_kleur: z.string().nullable().optional(),
  tweede_kleur: z.string().nullable().optional(),
  aantal_cilinders: z.string().nullable().optional(),
  cilinderinhoud: z.string().nullable().optional(),
  massa_ledig_voertuig: z.string().nullable().optional(),
  toegestane_maximum_massa_voertuig: z.string().nullable().optional(),
  datum_eerste_toelating: z.string().nullable().optional(),
  datum_eerste_tenaamstelling_in_nederland: z.string().nullable().optional(),
  wam_verzekerd: z.string().nullable().optional(),
  aantal_deuren: z.string().nullable().optional(),
  europese_voertuigcategorie: z.string().nullable().optional(),
  taxi_indicator: z.string().nullable().optional(),
  zuinigheidsclassificatie: z.string().nullable().optional(),
  vervaldatum_apk: z.string().nullable().optional(),
  inrichting: z.string().nullable().optional(),
  aantal_zitplaatsen: z.string().nullable().optional(),
  massa_rijklaar: z.string().nullable().optional(),
  maximum_massa_trekken_ongeremd: z.string().nullable().optional(),
  maximum_trekken_massa_geremd: z.string().nullable().optional(),
  catalogusprijs: z.string().nullable().optional(),
  aantal_wielen: z.string().nullable().optional(),
  wielbasis: z.string().nullable().optional(),
  vermogen_massarijklaar: z.string().nullable().optional(),
  typegoedkeuringsnummer: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  uitvoering: z.string().nullable().optional(),
  export_indicator: z.string().nullable().optional(),
  openstaande_terugroepactie_indicator: z.string().nullable().optional(),
  tenaamstellen_mogelijk: z.string().nullable().optional(),
  jaar_laatste_registratie_tellerstand: z.string().nullable().optional(),
});

export type VehicleData = z.infer<typeof VehicleSchema>;

export const FuelSchema = z.object({
  kenteken: z.string().optional(),
  brandstof_volgnummer: z.string().nullable().optional(),
  brandstof_omschrijving: z.string().nullable().optional(),
  brandstofverbruik_buiten: z.string().nullable().optional(),
  brandstofverbruik_gecombineerd: z.string().nullable().optional(),
  brandstofverbruik_stad: z.string().nullable().optional(),
  co2_uitstoot_gecombineerd: z.string().nullable().optional(),
  geluidsniveau_rijdend: z.string().nullable().optional(),
  geluidsniveau_stationair: z.string().nullable().optional(),
  emissiecode_omschrijving: z.string().nullable().optional(),
  milieuklasse_eg_goedkeuring_licht: z.string().nullable().optional(),
  nettomaximumvermogen: z.string().nullable().optional(),
  toerental_geluidsniveau: z.string().nullable().optional(),
  uitlaatemissieniveau: z.string().nullable().optional(),
});

export type FuelData = z.infer<typeof FuelSchema>;

export const AxleSchema = z.object({
  kenteken: z.string().optional(),
  as_nummer: z.string().optional(),
  aantal_assen: z.string().nullable().optional(),
  spoorbreedte: z.string().nullable().optional(),
  wettelijk_toegestane_maximum_aslast: z.string().nullable().optional(),
  technisch_toegestane_maximum_aslast: z.string().nullable().optional(),
});

export type AxleData = z.infer<typeof AxleSchema>;

export const APKHistorySchema = z.object({
  inspectionDate: z.string(),
  result: z.string(),
  afterRepair: z.boolean().optional(),
  defects: z.array(z.string()).optional(),
});

export type APKHistoryData = z.infer<typeof APKHistorySchema>;

export const VehicleResponseSchema = z.object({
  vehicle: VehicleSchema.nullable().optional(),
  fuel: FuelSchema.nullable().optional(),
  axles: z.array(AxleSchema).optional(),
  apkHistory: z.array(APKHistorySchema).optional(),
});

export type VehicleResponse = z.infer<typeof VehicleResponseSchema>;

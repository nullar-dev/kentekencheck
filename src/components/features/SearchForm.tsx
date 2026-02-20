'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/Toast';
import { Loader2, Car, Settings, Gauge, Scale, CreditCard, Info, Calendar, Archive, GaugeCircle, Lock, Shield, ArrowLeft } from 'lucide-react';

const plateSchema = z.object({
  plate: z.string().min(1, 'Kenteken is verplicht').max(10),
});

type PlateFormData = z.infer<typeof plateSchema>;

const DELAY_CLASSES: Record<number, string> = {
  50: 'delay-100',
  100: 'delay-100',
  150: 'delay-200',
  200: 'delay-200',
  250: 'delay-300',
  300: 'delay-300',
  350: 'delay-400',
  400: 'delay-400',
  450: 'delay-500',
  500: 'delay-500',
};

function getDelayClass(delay: number): string {
  return DELAY_CLASSES[delay] || '';
}

interface VehicleData {
  vehicle: Record<string, string | null>;
  fuel: Record<string, string | null>;
  axles: Array<Record<string, string | null>>;
  apkHistory?: Array<{ date: string; result: string; defects?: string[] }>;
}

async function fetchVehicle(plate: string): Promise<VehicleData> {
  const response = await fetch(`/api/kenteken/${encodeURIComponent(plate)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch');
  }
  return response.json();
}

const FIELD_LABELS: Record<string, string> = {
  kenteken: 'Kenteken', voertuigsoort: 'Voertuigsoort', merk: 'Merk', handelsbenaming: 'Model',
  type: 'Type', variant: 'Variant', uitvoering: 'Uitvoering', inrichting: 'Inrichting',
  eerste_kleur: 'Kleur', tweede_kleur: 'Tweede kleur', lengte: 'Lengte', breedte: 'Breedte',
  hoogte_voertuig: 'Hoogte', wielbasis: 'Wielbasis', cilinderinhoud: 'Cilinderinhoud',
  aantal_cilinders: 'Cilinders', nettomaximumvermogen: 'Vermogen', maximale_constructiesnelheid: 'Snelheid',
  massa_ledig_voertuig: 'Massa ledig', massa_rijklaar: 'Massa rijklaar',
  toegestane_maximum_massa_voertuig: 'Max massa', technische_max_massa_voertuig: 'Tech max massa',
  maximum_massa_trekken_ongeremd: 'Max trek ongeremd', maximum_trekken_massa_geremd: 'Max trek geremd',
  maximum_massa_samenstelling: 'Max massa totaal', brandstof_omschrijving: 'Brandstof',
  emissiecode_omschrijving: 'Emissieklasse', co2_uitstoot_gecombineerd: 'CO2 gecombineerd',
  brandstofverbruik_gecombineerd: 'Verbruik gecombineerd',
  geluidsniveau_stationair: 'Geluidsniveau stationair', toerental_geluidsniveau: 'Toerental geluid',
  milieuklasse_eg_goedkeuring_licht: 'Milieuklasse EG', uitlaatemissieniveau: 'Uitlaatemissie',
  vervaldatum_apk: 'APK vervaldatum', datum_eerste_toelating: 'Eerste toelating',
  datum_eerste_tenaamstelling_in_nederland: 'Eerste tenaamstelling NL',
  catalogusprijs: 'Catalogusprijs', europese_voertuigcategorie: 'EU-categorie',
  taxi_indicator: 'Taxi', export_indicator: 'Geëxporteerd', wam_verzekerd: 'WAM verzekerd',
  tenaamstellen_mogelijk: 'Tenaam mogelijk', typegoedkeuringsnummer: 'Typegoedkeuring',
  vermogen_massarijklaar: 'Vermogen/massa', openstaande_terugroepactie_indicator: 'Terugroepactie',
  tellerstandoordeel: 'Tellerstand oordeel', jaar_laatste_registratie_tellerstand: 'Laatste tellerregistratie',
  aantal_deuren: 'Aantal deuren', aantal_zitplaatsen: 'Aantal zitplaatsen', aantal_wielen: 'Aantal wielen',
  brandstof_volgnummer: 'Brandstof volgnummer', geluidsniveau_rijdend: 'Geluidsniveau rijden',
  brandstofverbruik_stad: 'Verbruik stad', brandstofverbruik_buiten: 'Verbruik buiten',
};

const DATA_SECTIONS = [
  { title: 'Voertuig', icon: Car, fields: ['merk', 'handelsbenaming', 'voertuigsoort', 'type', 'variant', 'uitvoering', 'inrichting', 'eerste_kleur', 'tweede_kleur'] },
  { title: 'Registratie', icon: Calendar, fields: ['vervalsdatum_apk', 'datum_eerste_toelating', 'datum_eerste_tenaamstelling_in_nederland', 'typegoedkeuringsnummer'] },
  { title: 'Motor', icon: Settings, fields: ['nettomaximumvermogen', 'cilinderinhoud', 'aantal_cilinders', 'maximale_constructiesnelheid', 'vermogen_massarijklaar'] },
  { title: 'Brandstof & Milieu', icon: GaugeCircle, fields: ['brandstof_omschrijving', 'brandstof_volgnummer', 'emissiecode_omschrijving', 'co2_uitstoot_gecombineerd', 'brandstofverbruik_gecombineerd', 'milieuklasse_eg_goedkeuring_licht', 'uitlaatemissieniveau', 'geluidsniveau_stationair', 'toerental_geluidsniveau'], source: 'fuel' },
  { title: 'Afmetingen', icon: Archive, fields: ['lengte', 'breedte', 'hoogte_voertuig', 'wielbasis', 'aantal_deuren', 'aantal_zitplaatsen', 'aantal_wielen'] },
  { title: 'Gewicht', icon: Scale, fields: ['massa_rijklaar', 'massa_ledig_voertuig', 'toegestane_maximum_massa_voertuig', 'technische_max_massa_voertuig', 'maximum_massa_trekken_ongeremd', 'maximum_trekken_massa_geremd', 'maximum_massa_samenstelling'] },
  { title: 'Kosten', icon: CreditCard, fields: ['catalogusprijs'] },
  { title: 'Status', icon: Info, fields: ['europese_voertuigcategorie', 'taxi_indicator', 'export_indicator', 'wam_verzekerd', 'tenaamstellen_mogelijk', 'openstaande_terugroepactie_indicator', 'tellerstandoordeel', 'jaar_laatste_registratie_tellerstand'] },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    let cleanDate = dateStr;
    const splitIndex = dateStr.indexOf('T');
    if (splitIndex > -1) cleanDate = dateStr.substring(0, splitIndex);
    else if (/^\d{8}$/.test(dateStr)) cleanDate = dateStr.substring(0,4) + '-' + dateStr.substring(4,6) + '-' + dateStr.substring(6,8);
    const d = new Date(cleanDate);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

function formatValue(key: string, value: string | null): string {
  if (value === null || value === undefined || value === '' || value === 'null') return '-';
  
  if (key.includes('datum') || key === 'vervalsdatum_apk' || /^\d{8}$/.test(value)) {
    const f = formatDate(value);
    if (f !== '-') return f;
  }
  
  if (key === 'catalogusprijs') {
    const n = parseInt(value);
    if (!isNaN(n)) return '€' + n.toLocaleString('nl-NL');
  }
  
  const yesNoFields = ['taxi_indicator', 'export_indicator', 'wam_verzekerd', 'tenaamstellen_mogelijk', 'openstaande_terugroepactie_indicator'];
  if (yesNoFields.includes(key)) return value === 'Ja' ? 'Ja' : 'Nee';
  
  if (key === 'nettomaximumvermogen') return value + ' kW';
  if (key === 'maximale_constructiesnelheid') return value + ' km/h';
  if (key === 'cilinderinhoud') return value + ' cc';
  if (key === 'vermogen_massarijklaar') return value + ' kg/kW';
  
  const weightFields = ['massa_ledig_voertuig', 'massa_rijklaar', 'toegestane_maximum_massa_voertuig', 'technische_max_massa_voertuig', 'maximum_massa_trekken_ongeremd', 'maximum_trekken_massa_geremd', 'maximum_massa_samenstelling'];
  if (weightFields.includes(key)) {
    const num = parseInt(value);
    return isNaN(num) ? value : num.toLocaleString('nl-NL') + ' kg';
  }
  
  const dimFields = ['lengte', 'breedte', 'hoogte_voertuig', 'wielbasis'];
  if (dimFields.includes(key)) return value + ' mm';
  
  return value;
}

function DataCard({ title, icon: Icon, data, delay }: { title: string; icon: React.ElementType; data: Record<string, string | null>; delay: number }) {
  const entries = Object.entries(data).filter(([, v]) => v && v !== 'null' && v !== '');
  
  if (entries.length === 0) return null;
  
  return (
    <div className={`glass-card rounded-xl p-3 sm:p-4 card-appear ${getDelayClass(delay)}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-primary text-base sm:text-lg" />
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider truncate">{title}</h3>
      </div>
      <div className="space-y-0">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-border-subtle/30 last:border-0">
            <span className="text-[10px] sm:text-xs text-text-secondary truncate max-w-[45%]">{FIELD_LABELS[key] || key.replace(/_/g, ' ')}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-text-primary text-right break-words max-w-[50%]">{formatValue(key, value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AxlesCard({ axles, delay }: { axles: Array<Record<string, string | null>>; delay: number }) {
  if (!axles || axles.length === 0) return null;
  
  return (
    <div className={`glass-card rounded-xl p-3 sm:p-4 card-appear ${getDelayClass(delay)}`}>
      <div className="flex items-center gap-2 mb-3">
        <Archive className="text-primary text-base sm:text-lg" />
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Assen ({axles.length})</h3>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {axles.map((axle, i) => (
          <div key={axle.as_nummer || `axle-${i}`} className="p-2 bg-background-dark rounded-lg">
            <p className="text-[10px] text-text-secondary mb-1">As {i + 1}</p>
            {axle.spoorbreedte && <p className="text-[10px]"><span className="text-text-secondary">Spoorbreedte:</span> <span className="font-semibold">{axle.spoorbreedte} cm</span></p>}
            {axle.wettelijk_toegestane_maximum_aslast && <p className="text-[10px]"><span className="text-text-secondary">Wettelijk max:</span> <span className="font-semibold">{parseInt(axle.wettelijk_toegestane_maximum_aslast).toLocaleString('nl-NL')} kg</span></p>}
            {axle.technisch_toegestane_maximum_aslast && <p className="text-[10px]"><span className="text-text-secondary">Technisch max:</span> <span className="font-semibold">{parseInt(axle.technisch_toegestane_maximum_aslast).toLocaleString('nl-NL')} kg</span></p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function APKAlert({ vehicle }: { vehicle: Record<string, string | null> }) {
  if (!vehicle.vervalsdatum_apk) return null;
  
  const apkDateStr = vehicle.vervalsdatum_apk.split('T')[0] ?? vehicle.vervalsdatum_apk;
  const apkDate = new Date(apkDateStr);
  const now = new Date();
  const daysUntilExpiry = (apkDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysUntilExpiry < 0) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-xl p-4 flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-error">warning</span>
        </div>
        <div>
          <h3 className="font-bold text-error mb-1">APK Vervallen</h3>
          <p className="text-sm text-text-secondary">Vervallen op {formatDate(vehicle.vervalsdatum_apk)}. Laat het voertuig zo snel mogelijk keuren.</p>
        </div>
      </div>
    );
  }
  
  if (daysUntilExpiry < 30) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-xl p-4 flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-error">warning</span>
        </div>
        <div>
          <h3 className="font-bold text-error mb-1">APK Vervalt Binnenkort</h3>
          <p className="text-sm text-text-secondary">Nog {Math.round(daysUntilExpiry)} dagen ({formatDate(vehicle.vervalsdatum_apk)}).</p>
        </div>
      </div>
    );
  }
  
  if (daysUntilExpiry < 90) {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-warning">schedule</span>
        </div>
        <div>
          <h3 className="font-bold text-warning mb-1">APK Vervalt Binnen 3 Maanden</h3>
          <p className="text-sm text-text-secondary">Op {formatDate(vehicle.vervalsdatum_apk)}.</p>
        </div>
      </div>
    );
  }
  
  return null;
}

export default function SearchForm() {
  const [searchedPlate, setSearchedPlate] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const toastShownRef = useRef({ success: false, notFound: false });
  const { showToast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<PlateFormData>({
    resolver: zodResolver(plateSchema),
  });

  const onSubmit = (data: PlateFormData) => {
    const plate = data.plate.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setSearchedPlate(plate);
    setHasSearched(true);
  };

  const isValidPlate = searchedPlate.length >= 2;

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', searchedPlate],
    queryFn: () => fetchVehicle(searchedPlate),
    enabled: isValidPlate,
    retry: 1,
  });

  useEffect(() => {
    if (hasSearched && data?.vehicle && !toastShownRef.current.success) {
      showToast(`${data.vehicle.merk || 'Voertuig'} gevonden`, 'success', 'Zoeken geslaagd');
      toastShownRef.current.success = true;
    }
  }, [data, hasSearched, showToast]);

  useEffect(() => {
    if (hasSearched && !data && !isLoading && !toastShownRef.current.notFound) {
      showToast(`Kenteken niet gevonden in RDW database`, 'error', 'Niet gevonden');
      toastShownRef.current.notFound = true;
    }
  }, [hasSearched, data, isLoading, showToast]);

  useEffect(() => {
    if (error) {
      showToast(error.message || 'Kon voertuiggegevens niet ophalen', 'error', 'Fout bij zoeken');
    }
  }, [error, showToast]);

  const handleNewSearch = () => {
    setSearchedPlate('');
    setHasSearched(false);
    toastShownRef.current = { success: false, notFound: false };
  };

  if (data?.vehicle) {
    const vehicle = data.vehicle;
    const fuel = data.fuel || {};
    const axles = data.axles || [];
    
    const bouwjaar = vehicle.datum_eerste_toelating ? vehicle.datum_eerste_toelating.substring(0, 4) : '';
    
    return (
      <div className="w-full max-w-5xl animate-fade-in">
        <button onClick={handleNewSearch} className="glass-card rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Nieuw kenteken</span>
        </button>

        <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 relative z-10">
            <div className="license-plate text-2xl sm:text-3xl md:text-4xl shrink-0">
              <div className="license-plate-blue">
                <span className="text-[8px] font-bold">NL</span>
              </div>
              <span>{vehicle.kenteken || searchedPlate}</span>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">{vehicle.merk || 'Onbekend'}</h2>
              <p className="text-primary text-sm sm:text-base">{vehicle.handelsbenaming || ''} {bouwjaar ? `• ${bouwjaar}` : ''}</p>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-primary">{bouwjaar || '-'}</p>
                <p className="text-[10px] sm:text-xs text-text-tertiary uppercase tracking-wider">Bouwjaar</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-primary">{fuel.brandstof_omschrijving || '-'}</p>
                <p className="text-[10px] sm:text-xs text-text-tertiary uppercase tracking-wider">Brandstof</p>
              </div>
            </div>
          </div>
        </div>

        <APKAlert vehicle={vehicle} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {DATA_SECTIONS.map((section, index) => {
            const sectionData = section.source === 'fuel' ? fuel : vehicle;
            return (
              <DataCard
                key={section.title}
                title={section.title}
                icon={section.icon}
                data={Object.fromEntries(
                  section.fields.map(f => [f, sectionData?.[f] || null])
                )}
                delay={50 + (index * 50)}
              />
            );
          })}
          <AxlesCard axles={axles} delay={50 + (DATA_SECTIONS.length * 50)} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl animate-fade-in">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
          Controleer je <span className="text-primary">kenteken</span>
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
          Gratis voertuiginformatie direct van de RDW. 100% accuraat, 100% gratis.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-2 sm:p-3 mb-6">
        {isLoading && (
          <div className="hidden flex-col items-center justify-center py-12">
            <div className="spinner"></div>
            <p className="text-text-secondary mt-4 text-sm">Gegevens ophalen...</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="plate-glow transition-all duration-300 rounded-xl mb-3">
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-xl overflow-hidden flex items-stretch h-14 sm:h-16 md:h-18 border-3 border-black">
              <div className="license-plate-blue shrink-0">
                <span className="text-[8px] font-bold">NL</span>
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <input
                  {...register('plate')}
                  type="text"
                  placeholder="XX-999-XX"
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-center placeholder:text-slate-900/30 tracking-wide"
                  maxLength={10}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {errors.plate && (
            <p className="text-sm text-error mb-2 text-center">{errors.plate.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 sm:py-4 rounded-xl text-base font-bold text-background-dark"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Zoeken...
              </span>
            ) : (
              'KENTEKEN CHECKEN'
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="glass-card rounded-xl p-2 sm:p-3">
          <Gauge className="text-primary text-lg sm:text-xl mx-auto" />
          <p className="text-[10px] sm:text-xs text-text-secondary mt-1">Direct</p>
        </div>
        <div className="glass-card rounded-xl p-2 sm:p-3">
          <Lock className="text-primary text-lg sm:text-xl mx-auto" />
          <p className="text-[10px] sm:text-xs text-text-secondary mt-1">Gratis</p>
        </div>
        <div className="glass-card rounded-xl p-2 sm:p-3">
          <Shield className="text-primary text-lg sm:text-xl mx-auto" />
          <p className="text-[10px] sm:text-xs text-text-secondary mt-1">Officiëel</p>
        </div>
      </div>
    </div>
  );
}

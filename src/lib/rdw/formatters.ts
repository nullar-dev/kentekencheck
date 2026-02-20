export function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === 'null' || value === '') return '-';
  
  const strValue = String(value);
  
  // Date fields
  if (key.includes('datum') || key === 'vervaldatum_apk' || (/^\d{8}$/.test(strValue) && key !== 'jaar_laatste_registratie_tellerstand')) {
    const formatted = formatDate(strValue);
    if (formatted !== '-') return formatted;
  }
  
  // Currency
  if (key === 'catalogusprijs' || key === 'bruto_bpm') {
    const num = parseInt(strValue);
    if (!isNaN(num)) return '€' + num.toLocaleString('nl-NL');
  }
  
  // Yes/No fields
  const yesNoFields = ['taxi_indicator', 'export_indicator', 'wam_verzekerd', 'tenaamstellen_mogelijk', 'openstaande_terugroepactie_indicator', 'aangedreven_as'];
  if (yesNoFields.includes(key)) {
    if (key === 'aangedreven_as') return strValue === 'J' ? 'Ja' : 'Nee';
    return strValue === 'Ja' ? 'Ja' : 'Nee';
  }
  
  if (key === 'import_status') return strValue === 'Ja' ? 'Ja (buitenland)' : 'Nee (Nederlands)';
  
  // Units
  if (key === 'nettomaximumvermogen') return strValue + ' kW';
  if (key === 'maximale_constructiesnelheid') return strValue + ' km/h';
  if (key === 'cilinderinhoud') return strValue + ' cc';
  if (key === 'vermogen_massarijklaar') return strValue + ' kg/kW';
  
  // Weight
  const weightFields = ['massa_ledig_voertuig', 'massa_rijklaar', 'toegestane_maximum_massa_voertuig', 'technische_max_massa_voertuig', 'maximum_massa_trekken_ongeremd', 'maximum_trekken_massa_geremd', 'maximum_massa_samenstelling', 'technisch_toegestane_maximum_aslast', 'wettelijk_toegestane_maximum_aslast'];
  if (weightFields.includes(key)) {
    const num = parseInt(strValue);
    return isNaN(num) ? strValue : num.toLocaleString('nl-NL') + ' kg';
  }
  
  // Dimensions
  const dimFields = ['lengte', 'breedte', 'hoogte_voertuig', 'wielbasis', 'afstand_tot_volgende_as_voertuig'];
  if (dimFields.includes(key)) return strValue + ' mm';
  if (key === 'spoorbreedte') return strValue + ' cm';
  
  // Fuel consumption
  if (key === 'brandstofverbruik_buiten' || key === 'brandstofverbruik_stad' || key === 'brandstofverbruik_gecombineerd' || key === 'brandstof_verbruik_gecombineerd_wltp') {
    return strValue + ' l/100km';
  }
  
  // CO2
  if (key === 'co2_uitstoot_gecombineerd' || key === 'emissie_co2_gecombineerd_wltp') {
    return strValue + ' g/km';
  }
  
  // Sound
  if (key === 'geluidsniveau_rijdend' || key === 'geluidsniveau_stationair') {
    return strValue + ' dB';
  }
  
  if (key === 'toerental_geluidsniveau') return strValue + ' rpm';
  
  return strValue;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    let cleanDate = dateStr;
    if (dateStr.indexOf('T') > -1) cleanDate = dateStr.split('T')[0];
    else if (/^\d{8}$/.test(dateStr)) cleanDate = dateStr.substring(0,4) + '-' + dateStr.substring(4,6) + '-' + dateStr.substring(6,8);
    const d = new Date(cleanDate);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

export function getAPKStatus(apkDateStr: string | null | undefined): { type: 'error' | 'warning' | 'success' | null; message: string } {
  if (!apkDateStr) return { type: null, message: '' };
  
  const apkDate = new Date(apkDateStr.split('T')[0]);
  const now = new Date();
  const daysUntilExpiry = (apkDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysUntilExpiry < 0) {
    return { type: 'error', message: `APK Vervallen op ${formatDate(apkDateStr)}. Laat het voertuig zo snel mogelijk keuren.` };
  } else if (daysUntilExpiry < 30) {
    return { type: 'error', message: `APK Vervalt over ${Math.round(daysUntilExpiry)} dagen (${formatDate(apkDateStr)}).` };
  } else if (daysUntilExpiry < 90) {
    return { type: 'warning', message: `APK Vervalt binnen ${Math.round(daysUntilExpiry)} dagen (${formatDate(apkDateStr)}).` };
  }
  
  return { type: null, message: '' };
}

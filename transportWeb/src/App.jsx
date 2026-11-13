import React, { useState } from 'react';

// Embedded dataset extracted from Mangaluru Govt Bus Routes PDF
const initialBusData = [
  { id: 1, from: "Mangaluru", to: "Dharmasthala", class: "Limited", via: "BC Road, Belthangadi", time: "05:20", time24: "05:20" },
  { id: 2, from: "Mangaluru", to: "Dharmasthala", class: "Limited", via: "BC Road, Belthangadi", time: "05:50", time24: "05:50" },
  { id: 3, from: "Mangaluru", to: "Dharmasthala", class: "Limited", via: "BC Road, Belthangadi", time: "06:00", time24: "06:00" },
  { id: 4, from: "Mangaluru", to: "Dharmasthala", class: "Limited", via: "BC Road, Belthangadi", time: "06:20", time24: "06:20" },
  { id: 5, from: "Mangaluru", to: "Dharmasthala", class: "Limited", via: "BC Road, Belthangadi", time: "06:45", time24: "06:45" },
  { id: 7, from: "Mangaluru", to: "Mysore", class: "Express", via: "Madikeri", time: "05:00", time24: "05:00" },
  { id: 18, from: "Mangaluru", to: "Davanagere", class: "Express", via: "BC Road, Belthangadi", time: "05:30", time24: "05:30" },
  { id: 19, from: "Mangaluru", to: "Subrahmanya", class: "Limited", via: "Uppinangadi", time: "05:30", time24: "05:30" },
  { id: 28, from: "Mangaluru", to: "Bengaluru", class: "Express", via: "Sakshleshpura", time: "05:45", time24: "05:45" },
  { id: 36, from: "Mangaluru", to: "Bengaluru", class: "Volvo", via: "Sakshleshpura", time: "06:00", time24: "06:00" },
  { id: 54, from: "Mangaluru", to: "Chikkamagaluru", class: "Express", via: "BC Road, Belthangadi", time: "06:30", time24: "06:30" },
  { id: 115, from: "Mangaluru", to: "Hubballi", class: "Express", via: "Kumta", time: "08:00", time24: "08:00" },
  { id: 126, from: "Mangaluru", to: "Bengaluru", class: "Multi Axle", via: "Mysore", time: "08:30", time24: "08:30" },
  { id: 158, from: "Mangaluru", to: "Shivamogga", class: "Express", via: "BC Road, Belthangadi", time: "10:00", time24: "10:00" },
  { id: 208, from: "Mangaluru", to: "Gokarna", class: "Express", via: "Kumta", time: "11:00", time24: "11:00" },
  { id: 252, from: "Mangaluru", to: "Hassan", class: "Express", via: "BC Road, Belthangadi", time: "12:30", time24: "12:30" },
  { id: 372, from: "Mangaluru", to: "Bengaluru", class: "Multi Axle", via: "Sakshleshpura", time: "16:00", time24: "16:00" },
  { id: 411, from: "Mangaluru", to: "Bengaluru", class: "Express", via: "Sakshleshpura", time: "17:15", time24: "17:15" },
];

const translations = {
  en: {
    title: "Mangaluru Smart Transit & Resiliency Portal",
    subtitle: "Offline-First Emergency Government Bus Dispatch & Twilio Gateway",
    from: "From Location",
    to: "Destination",
    time: "Target Departure Time",
    search: "Search & Compute Routes",
    emergencyPanel: "Emergency Crisis Simulation Board",
    breakdown: "Bus Breakdown (2 Units Offline)",
    flood: "Road Blockage (Floods via Sakleshpur/Kumta)",
    surge: "Demand Surge (+40% Student Traffic)",
    examAlert: "Exam Time Pressure (< 2 Hours Window)",
    offlineStatus: "Mesh Network Status",
    online: "Offline PWA Ready & Synced with Local DB",
    noBuses: "No exact matches at or after this time. Algorithmic reallocation dispatched a backup fleet.",
    replacement: "Assigned Emergency Relief Bus:",
    smsFallback: "Feature Phone / Non-Smartphone Support (Twilio SMS & IVR)",
    sendSms: "Dispatch Twilio SMS",
    callIvrs: "Trigger Bilingual IVR Call",
    checkNextBus: "🔍 Check Next Available Bus",
    nextBusTitle: "Next Consecutive Bus Schedules:",
    activeRouteStatus: "Active Route Status",
    emptyResultsText: "Select your parameters and click Search to check route availability.",
    via: "Via"
  },
  kn: {
    title: "ಮಂಗಳೂರು ಸ್ಮಾರ್ಟ್ ಸಾರಿಗೆ ತುರ್ತು ವ್ಯವಸ್ಥೆ",
    subtitle: "ಆಫ್‌ಲೈನ್ ಸರ್ಕಾರಿ ಬಸ್ ನಿಯಂತ್ರಣ ಹಾಗೂ ಟ್ವಿಲಿಯೋ ಸಂದೇಶ ಸೇವೆ",
    from: "ಮೂಲ ಸ್ಥಳ (From)",
    to: "ಗಮ್ಯಸ್ಥಾನ (To)",
    time: "ನಿಗದಿತ ಸಮಯ (Time)",
    search: "ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ",
    emergencyPanel: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ನಿಯಂತ್ರಣ ಫಲಕ",
    breakdown: "ಬಸ್ ತಾಂತ್ರಿಕ ದೋಷ (2 ಬಸ್‌ಗಳು ರದ್ದು)",
    flood: "ಪ್ರವಾಹದಿಂದ ರಸ್ತೆ ಬಂದ್ (ಸಕಲೇಶಪುರ/ಕುಮಟಾ)",
    surge: "ವಿದ್ಯಾರ್ಥಿಗಳ ದಟ್ಟಣೆ ಹೆಚ್ಚಳ (+40%)",
    examAlert: "ಪರೀಕ್ಷೆಯ ತುರ್ತು ಸಮಯ (< 2 ಗಂಟೆಗಳು)",
    offlineStatus: "ಆಫ್‌ಲೈನ್ ನೆಟ್‌ವರ್ಕ್ ಸ್ಥಿತಿ",
    online: "ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    noBuses: "ನಿಗದಿತ ಸಮಯದ ನಂತರ ಬಸ್‌ಗಳಿಲ್ಲ. ಪರ್ಯಾಯ ಬಸ್ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗಿದೆ.",
    replacement: "ನಿಯೋಜಿಸಲಾದ ಪರ್ಯಾಯ ತುರ್ತು ಬಸ್:",
    smsFallback: "ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇಲ್ಲವೇ? ಟ್ವಿಲಿಯೋ ಎಸ್‌ಎಂಎಸ್ / ಐವಿಆರ್ ಕರೆ ಬಳಸಿ",
    sendSms: "ಎಸ್‌ಎಂಎಸ್ ಕಳುಹಿಸಿ",
    callIvrs: "ಐವಿಆರ್ ಕರೆ ಮಾಡಿ",
    checkNextBus: "🔍 ಮುಂದಿನ ಲಭ್ಯವಿರುವ ಬಸ್ ಪರಿಶೀಲಿಸಿ",
    nextBusTitle: "ಮುಂದಿನ ಸಾಲಿನ ಬಸ್ ವೇಳಾಪಟ್ಟಿ:",
    activeRouteStatus: "ಸಕ್ರಿಯ ಮಾರ್ಗದ ಸ್ಥಿತಿ",
    emptyResultsText: "ಮಾಹಿತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ 'ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    via: "ಮಾರ್ಗ (Via)"
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [fromCity, setFromCity] = useState('Mangaluru');
  const [toCity, setToCity] = useState('Dharmasthala');
  const [searchTime, setSearchTime] = useState('06:30');
  const [ampm, setAmpm] = useState('AM');
  
  // Crisis Simulation States
  const [isBreakdownActive, setIsBreakdownActive] = useState(false);
  const [isFloodActive, setIsFloodActive] = useState(false);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [isExamPressure, setIsExamPressure] = useState(false);

  const [results, setResults] = useState([]);
  const [nextBuses, setNextBuses] = useState([]);
  const [systemMessage, setSystemMessage] = useState(null);
  
  // Twilio States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsModal, setSmsModal] = useState(null);

  const t = translations[lang];

  const convertTo24Hour = (timeStr, period) => {
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setNextBuses([]);
    
    const target24 = convertTo24Hour(searchTime, ampm);

    let filtered = initialBusData.filter(bus => 
      bus.from.toLowerCase() === fromCity.toLowerCase() &&
      bus.to.toLowerCase() === toCity.toLowerCase() &&
      bus.time24 >= target24
    );

    let messages = [];

    if (isBreakdownActive) {
      filtered = filtered.slice(2); 
      messages.push(lang === 'en' ? "⚠️ 2 Government buses are down due to breakdown. Active load-balancing engaged." : "⚠️ ತಾಂತ್ರಿಕ ದೋಷದಿಂದ 2 ಸರ್ಕಾರಿ ಬಸ್‌ಗಳು ರದ್ದಾಗಿವೆ.");
    }

    if (isFloodActive) {
      filtered = filtered.filter(bus => !bus.via.toLowerCase().includes('sakshleshpura') && !bus.via.toLowerCase().includes('kumta'));
      messages.push(lang === 'en' ? "🌊 Route blocked via primary flooded corridors. Re-routing traffic through safe interior tracks." : "🌊 ಪ್ರವಾಹದಿಂದ ಮುಖ್ಯ ರಸ್ತೆ ಬಂದ್. ಪರ್ಯಾಯ ಮಾರ್ಗಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.");
    }

    if (filtered.length === 0) {
      messages.push(t.noBuses);
      filtered.push({
        id: 999,
        from: fromCity,
        to: toCity,
        class: isSurgeActive ? "KSRTC Mega-Shuttle (+40% Capacity)" : "Standby Express Fleet",
        via: "Emergency Safe Corridor (Diversion)",
        time: `${searchTime} ${ampm}`,
        isReplacement: true,
        replacementName: "KSRTC Vajra Emergency Relief Fleet #KA-19-F-4042"
      });
    } else if (isSurgeActive) {
      messages.push(lang === 'en' ? "📈 Student demand surged by 40%. Extra capacity attached." : "📈 ವಿದ್ಯಾರ್ಥಿಗಳ ದಟ್ಟಣೆ ಶೇ. 40ರಷ್ಟು ಹೆಚ್ಚಿದೆ. ಹೆಚ್ಚುವರಿ ಬಸ್ ಸೇರಿಸಲಾಗಿದೆ.");
    }

    if (isExamPressure) {
      messages.push(lang === 'en' ? "⏱️ Exam Time-Pressure Protocol: Priority boarding pass generated." : "⏱️ ಪರೀಕ್ಷಾ ತುರ್ತು ನಿಯಮ: ಆದ್ಯತೆಯ ಬಸ್ ಪ್ರವೇಶ ಕಲ್ಪಿಸಲಾಗಿದೆ.");
    }

    setResults(filtered);
    setSystemMessage(messages);
  };

  const handleCheckNextBuses = () => {
    const target24 = convertTo24Hour(searchTime, ampm);
    const subsequentBuses = initialBusData.filter(bus => 
      bus.from.toLowerCase() === fromCity.toLowerCase() &&
      bus.to.toLowerCase() === toCity.toLowerCase() &&
      bus.time24 >= target24
    );
    setNextBuses(subsequentBuses);
  };

  const triggerOfflineSMS = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid mobile number for SMS alert.");
      return;
    }

    const targetBus = results.length > 0 ? results[0] : null;
    const busInfo = targetBus 
      ? (targetBus.isReplacement ? targetBus.replacementName : `${targetBus.class} via ${targetBus.via} at ${targetBus.time}`)
      : 'Emergency Shuttle on Standby';

    const messageBody = lang === 'en'
      ? `KSRTC Alert (${fromCity} to ${toCity}): ${busInfo}`
      : `ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಎಚ್ಚರಿಕೆ (${fromCity} - ${toCity}): ${busInfo}`;

    try {
      const response = await fetch('http://localhost:5000/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toNumber: phoneNumber, messageBody })
      });
      const data = await response.json();
      setSmsModal(lang === 'en' ? `📲 SMS Processed! Status: ${data.sid || 'Delivered'}` : `📲 ಎಸ್‌ಎಂಎಸ್ ಕಳುಹಿಸಲಾಗಿದೆ!`);
    } catch (err) {
      setSmsModal(`Network error connecting to SMS gateway.`);
    }
  };

  const triggerIVRCall = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid mobile number for IVR call.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/trigger-ivrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toNumber: phoneNumber })
      });
      const data = await response.json();
      setSmsModal(lang === 'en' ? `📞 Twilio IVR Call Initiated!` : `📞 ಐವಿಆರ್ ಧ್ವನಿ ಕರೆ ಮಾಡಲಾಗಿದೆ!`);
    } catch (err) {
      setSmsModal(`Network error connecting to IVR service.`);
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div style={styles.langToggle}>
          <button style={lang === 'en' ? styles.activeLangBtn : styles.langBtn} onClick={() => setLang('en')}>English</button>
          <button style={lang === 'kn' ? styles.activeLangBtn : styles.langBtn} onClick={() => setLang('kn')}>ಕನ್ನಡ</button>
        </div>
      </header>

      <div style={styles.offlineBanner}>
        <span style={styles.pulseDot}></span> <strong>{t.offlineStatus}:</strong> {t.online}
      </div>

      <div style={styles.mainGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          <div style={styles.emergencyPanel}>
            <h3 style={styles.panelTitle}>🚨 {t.emergencyPanel}</h3>
            <div style={styles.checkboxGrid}>
              <label style={styles.checkLabel}><input type="checkbox" checked={isBreakdownActive} onChange={e => setIsBreakdownActive(e.target.checked)} /> {t.breakdown}</label>
              <label style={styles.checkLabel}><input type="checkbox" checked={isFloodActive} onChange={e => setIsFloodActive(e.target.checked)} /> {t.flood}</label>
              <label style={styles.checkLabel}><input type="checkbox" checked={isSurgeActive} onChange={e => setIsSurgeActive(e.target.checked)} /> {t.surge}</label>
              <label style={styles.checkLabel}><input type="checkbox" checked={isExamPressure} onChange={e => setIsExamPressure(e.target.checked)} /> {t.examAlert}</label>
            </div>
          </div>

          <form onSubmit={handleSearch} style={styles.formCard}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.from}</label>
              <input type="text" value={fromCity} onChange={e => setFromCity(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.to}</label>
              <input type="text" value={toCity} onChange={e => setToCity(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.time}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="time" value={searchTime} onChange={e => setSearchTime(e.target.value)} style={{ ...styles.input, flex: 2 }} required />
                <select value={ampm} onChange={e => setAmpm(e.target.value)} style={{ ...styles.input, flex: 1, fontWeight: 'bold' }}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <button type="submit" style={styles.primaryBtn}>{t.search}</button>
          </form>

          <div style={styles.smsSection}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px' }}>📱 {t.smsFallback}</h4>
            <input 
              type="text" 
              placeholder="Enter mobile number (+91...)" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              style={{ ...styles.input, marginBottom: '10px', width: '100%', boxSizing: 'border-box' }} 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={triggerOfflineSMS} style={styles.smsBtn}>{t.sendSms}</button>
              <button onClick={triggerIVRCall} style={styles.ivrBtn}>{t.callIvrs}</button>
            </div>
            {smsModal && <div style={styles.modalBox}>{smsModal}</div>}
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {systemMessage && (
            <div style={styles.alertBox}>
              {systemMessage.map((msg, index) => (
                <p key={index} style={{ margin: '4px 0', fontWeight: '500' }}>{msg}</p>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>
              {t.activeRouteStatus} ({searchTime} {ampm} / ನಂತರ)
            </h3>
            {results.length > 0 && (
              <button onClick={handleCheckNextBuses} style={styles.nextBusBtn}>
                {t.checkNextBus}
              </button>
            )}
          </div>

          <div style={styles.resultsContainer}>
            {results.length > 0 ? (
              results.map((bus, idx) => (
                <div key={idx} style={{...styles.card, borderLeft: bus.isReplacement ? '6px solid #e74c3c' : '6px solid #27ae60'}}>
                  <div style={styles.cardHeader}>
                    <span style={styles.badge}>{bus.class}</span>
                    <span style={styles.timeText}>🕒 {bus.time}</span>
                  </div>
                  <p style={styles.routeText}><strong>{bus.from}</strong> ➔ <strong>{bus.to}</strong></p>
                  <p style={styles.viaText}>{t.via}: {bus.via}</p>
                  {bus.isReplacement && (
                    <div style={styles.replacementBox}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px' }}>⚠️ <strong>{t.replacement}</strong></p>
                      <p style={{ margin: 0, color: '#c0392b', fontWeight: 'bold' }}>{bus.replacementName}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={styles.emptyCard}>
                <p style={{ color: '#7f8c8d', margin: 0 }}>{t.emptyResultsText}</p>
              </div>
            )}
          </div>

          {nextBuses.length > 0 && (
            <div style={styles.nextBusContainer}>
              <h4 style={{ color: '#2980b9', marginTop: 0 }}>{t.nextBusTitle}</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {nextBuses.map((nb, i) => (
                  <div key={i} style={styles.nextBusItem}>
                    <span>🕒 <strong>{nb.time}</strong> ({nb.class})</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>{t.via}: {nb.via}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: { maxWidth: '1100px', margin: '30px auto', padding: '25px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
  title: { fontSize: '22px', color: '#1e293b', margin: 0, fontWeight: '700' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: '5px 0 0 0' },
  langToggle: { display: 'flex', gap: '8px' },
  langBtn: { padding: '6px 14px', cursor: 'pointer', background: '#e2e8f0', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  activeLangBtn: { padding: '6px 14px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  offlineBanner: { background: '#dcfce7', color: '#166534', padding: '10px 15px', borderRadius: '8px', margin: '20px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' },
  pulseDot: { width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '25px' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  rightColumn: { display: 'flex', flexDirection: 'column' },
  emergencyPanel: { background: '#fef3c7', border: '1px solid #fde68a', padding: '15px', borderRadius: '8px' },
  panelTitle: { margin: '0 0 10px 0', fontSize: '15px', color: '#92400e' },
  checkboxGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '13px', color: '#78350f' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' },
  formCard: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: '600', color: '#475569' },
  label: { marginBottom: '4px' },
  input: { padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' },
  primaryBtn: { padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' },
  smsSection: { background: '#eff6ff', padding: '15px', borderRadius: '8px', border: '1px solid #bfdbfe' },
  smsBtn: { padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', flex: 1 },
  ivrBtn: { padding: '8px 12px', background: '#9333ea', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', flex: 1 },
  modalBox: { marginTop: '10px', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155' },
  alertBox: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', border: '1px solid #fecaca' },
  resultsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' },
  badge: { background: '#0284c7', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  timeText: { fontWeight: 'bold', color: '#d97706', fontSize: '15px' },
  routeText: { margin: '4px 0', fontSize: '14px', color: '#1e293b' },
  viaText: { margin: '0', fontSize: '12px', color: '#64748b' },
  replacementBox: { background: '#ffeeec', padding: '10px', borderRadius: '6px', marginTop: '10px', border: '1px solid #f9dad7' },
  emptyCard: { background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1' },
  nextBusBtn: { padding: '6px 12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', color: '#374151' },
  nextBusContainer: { marginTop: '20px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' },
  nextBusItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }
};
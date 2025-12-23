import React, { useState } from 'react';
import './FutureYearForm.css';
import TaxRates from '../../utils/TaxRates';
import { ISTISNA } from '../../utils/calculateSalary';

const FutureYearForm = ({ onSubmit, onClose, initialValues = null, savedYears = {} }) => {
    const lastYear = TaxRates.getLastYear();

    // Eğer initialValues varsa onları kullan, yoksa default değerler (son yıl üzerinden)
    const [year, setYear] = useState(initialValues?.year || lastYear);
    const [inflation, setInflation] = useState(initialValues?.inflation || '');
    const [baseYear, setBaseYear] = useState(''); // Hangi yılı baz alacağız

    // Son yılın verilerini al
    const ratesLastYear = TaxRates.getRates(lastYear);

    // En yüksek yıl olan 2025'in ISTISNA değerlerini al
    const latestYear = Math.max(...Object.keys(ISTISNA).map(Number));
    const exemptions2025 = ISTISNA[latestYear];

    const [taxRates, setTaxRates] = useState(
        initialValues?.taxRates || {
            sgk: 0.14,
            issizlik: 0.01,
            damga: 0.00759,
            gelir: [
                { min: 0, max: 158000, oran: 0.15 },
                { min: 158000, max: 330000, oran: 0.20 },
                { min: 330000, max: 1200000, oran: 0.27 },
                { min: 1200000, max: 4300000, oran: 0.35 },
                { min: 4300000, max: 999999999, oran: 0.40 }
            ]
        }
    );

    const [exemptions, setExemptions] = useState(
        initialValues?.exemptions || {
            gelir: exemptions2025.gelir,
            damga: exemptions2025.damga
        }
    );

    // Baz yıl seçildiğinde o yılın verilerini yükle
    const handleBaseYearChange = (selectedYear) => {
        setBaseYear(selectedYear);

        if (selectedYear && savedYears[selectedYear]) {
            const baseData = savedYears[selectedYear];
            setTaxRates(baseData.taxRates);
            setExemptions(baseData.exemptions);
            setInflation(''); // Enflasyon alanını boş bırak, kullanıcı yeni değer girecek
        } else if (selectedYear === lastYear.toString()) {
            // Default değerleri yükle
            setTaxRates({
                sgk: 0.14,
                issizlik: 0.01,
                damga: 0.00759,
                gelir: ratesLastYear.gelir
            });
            setExemptions({
                gelir: exemptions2025.gelir,
                damga: exemptions2025.damga
            });
            setInflation('');
        }
    };

    // Enflasyon oranına göre otomatik doldur
    const handleInflationChange = (value) => {
        setInflation(value);

        if (value && !isNaN(value)) {
            const inflationRate = parseFloat(value) / 100;

            // Hangi yılı baz alıyoruz?
            let baseRates, baseExemptions;

            if (baseYear && savedYears[baseYear]) {
                baseRates = savedYears[baseYear].taxRates;
                baseExemptions = savedYears[baseYear].exemptions;
            } else {
                // Default değerleri
                baseRates = ratesLastYear;
                baseExemptions = exemptions2025;
            }

            // Vergi dilimlerini enflasyon oranına göre güncelle
            const updatedGelir = baseRates.gelir.map(dilim => ({
                ...dilim,
                min: Math.round(dilim.min * (1 + inflationRate)),
                max: dilim.max === Infinity ? 999999999 : Math.round(dilim.max * (1 + inflationRate))
            }));

            setTaxRates({
                ...baseRates,
                gelir: updatedGelir
            });

            // İstisnaları enflasyon oranına göre güncelle
            setExemptions({
                gelir: baseExemptions.gelir.map(val => Math.round(val * (1 + inflationRate) * 100) / 100),
                damga: baseExemptions.damga.map(val => Math.round(val * (1 + inflationRate) * 100) / 100)
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            year,
            taxRates,
            exemptions,
            inflation
        });
        onClose();
    };

    const updateGelirDilim = (index, field, value) => {
        const updatedGelir = [...taxRates.gelir];
        updatedGelir[index] = {
            ...updatedGelir[index],
            [field]: field === 'oran' ? parseFloat(value) / 100 : parseInt(value)
        };
        setTaxRates({
            ...taxRates,
            gelir: updatedGelir
        });
    };

    const updateExemption = (type, index, value) => {
        setExemptions({
            ...exemptions,
            [type]: exemptions[type].map((val, i) => i === index ? parseFloat(value) : val)
        });
    };

    return (
        <div className="future-year-form-overlay">
            <div className="future-year-form">
                <div className="form-header">
                    <h2>{initialValues ? 'Vergi Oranlarını Düzenle' : 'Gelecek Yıl Hesaplama Ayarları'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <label>
                            Hesaplama Yılı:
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                min="2025"
                                max="2050"
                            />
                        </label>
                    </div>

                    {/* Baz yıl seçme - sadece yeni yıl eklerken görün */}
                    {!initialValues && Object.keys(savedYears).length > 0 && (
                        <div className="form-section">
                            <label>
                                Hangi yılın verilerini baz almak istiyorsunuz?
                                <select
                                    value={baseYear}
                                    onChange={(e) => handleBaseYearChange(e.target.value)}
                                >
                                    <option value="">{lastYear} (Varsayılan değerler)</option>
                                    {Object.keys(savedYears).sort().map(year => (
                                        <option key={year} value={year}>
                                            {year} ({savedYears[year].inflation ? `%${savedYears[year].inflation} enflasyon` : 'Özel değerler'})
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <small>Seçilen yılın vergi oranları ve istisnaları başlangıç noktası olacak</small>
                        </div>
                    )}

                    <div className="form-section">
                        <label>
                            Enflasyon Oranı (%) - İsteğe Bağlı:
                            <input
                                type="number"
                                value={inflation}
                                onChange={(e) => handleInflationChange(e.target.value)}
                                placeholder="Örn: 30"
                                step="0.1"
                            />
                        </label>
                        <small>{baseYear ? `${baseYear} yılının değerlerini bu oranda arttırır` : `${lastYear} değerlerini otomatik olarak bu oranda arttırır`}</small>
                    </div>

                    <div className="form-section">
                        <h3>Gelir Vergisi Dilimleri</h3>
                        {taxRates.gelir.map((dilim, index) => (
                            <div key={index} className="dilim-row">
                                <input
                                    type="number"
                                    value={dilim.min}
                                    onChange={(e) => updateGelirDilim(index, 'min', e.target.value)}
                                    placeholder="Min"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={dilim.max === 999999999 ? '' : dilim.max}
                                    onChange={(e) => updateGelirDilim(index, 'max', e.target.value || 999999999)}
                                    placeholder="Max (boş = sınırsız)"
                                />
                                <input
                                    type="number"
                                    value={dilim.oran * 100}
                                    onChange={(e) => updateGelirDilim(index, 'oran', e.target.value)}
                                    placeholder="Oran %"
                                    step="0.1"
                                />
                                <span>%</span>
                            </div>
                        ))}
                    </div>

                    <div className="form-section">
                        <h3>{latestYear} Aylık Gelir Vergisi İstisnaları</h3>
                        <div className="exemption-grid">
                            {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
                                    <div key={index} className="exemption-item">
                                        <label>{month}:</label>
                                        <input
                                            type="number"
                                            value={exemptions.gelir[index]}
                                            onChange={(e) => updateExemption('gelir', index, e.target.value)}
                                            step="0.01"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>{latestYear} Aylık Damga Vergisi İstisnaları</h3>
                        <div className="exemption-grid">
                            {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
                                    <div key={index} className="exemption-item">
                                        <label>{month}:</label>
                                        <input
                                            type="number"
                                            value={exemptions.damga[index]}
                                            onChange={(e) => updateExemption('damga', index, e.target.value)}
                                            step="0.01"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose}>İptal</button>
                        <button type="submit">
                            {initialValues ? 'Güncellemeleri Uygula' : 'Hesaplamayı Başlat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FutureYearForm; 
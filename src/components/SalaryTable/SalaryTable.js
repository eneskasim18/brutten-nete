import React, { useState } from 'react';
import './SalaryTable.css';
import { calculateSalary } from '../../utils/calculateSalary';
import TaxRates from '../../utils/TaxRates';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import FutureYearForm from '../FutureYearForm/FutureYearForm';
import * as XLSX from 'xlsx';

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DEFAULT_YEAR = TaxRates.getLastYear();
const DEFAULT_ASGARI_UCRET = 33030;

const SalaryTable = () => {
    const [grossSalaries, setGrossSalaries] = useState(Array(12).fill(''));
    const [showFutureYearForm, setShowFutureYearForm] = useState(false);
    const [currentYear, setCurrentYear] = useState(DEFAULT_YEAR);
    const [savedYears, setSavedYears] = useState({}); // Birden fazla yılı sakla
    const [editMode, setEditMode] = useState(false);
    const [editingYear, setEditingYear] = useState(null); // Hangi yılı düzenliyoruz

    // Sayı formatla: 10000 -> 10.000
    const formatNumber = (value) => {
        if (!value) return '';
        // Sadece rakam ve virgül kalmasına izin ver
        let clean = value.replace(/[^0-9,]/g, '');

        // Virgülden sonrasını ayır
        const parts = clean.split(',');
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? ',' + parts[1] : '';

        // Binlik basamaklara nokta koy
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return integerPart + decimalPart;
    };

    const handleGrossChange = (idx, value) => {
        const formatted = formatNumber(value);
        const newSalaries = [...grossSalaries];
        for (let i = idx; i < newSalaries.length; i++) {
            newSalaries[i] = formatted;
        }
        setGrossSalaries(newSalaries);
    };

    const handleFutureYearSubmit = ({ year, taxRates, exemptions, inflation }) => {
        // Yeni yılı kaydet
        setSavedYears(prev => ({
            ...prev,
            [year]: { taxRates, exemptions, inflation }
        }));
        setCurrentYear(year);
        setShowFutureYearForm(false);
        setEditMode(false);
        setEditingYear(null);
    };

    const resetToDefault = () => {
        setCurrentYear(DEFAULT_YEAR);
        setSavedYears({});
        setEditMode(false);
        setEditingYear(null);
    };

    const handleEditRates = (year) => {
        setEditingYear(year);
        setEditMode(true);
        setShowFutureYearForm(true);
    };

    const handleNewYear = () => {
        setEditMode(false);
        setEditingYear(null);
        setShowFutureYearForm(true);
    };

    const switchToYear = (year) => {
        setCurrentYear(year);
    };

    // Mevcut yılın verilerini al
    const getCurrentYearData = () => {
        if (currentYear === DEFAULT_YEAR) {
            return { customRates: null, customExemptions: null };
        }
        const yearData = savedYears[currentYear];
        return {
            customRates: yearData?.taxRates || null,
            customExemptions: yearData?.exemptions || null
        };
    };

    const { customRates, customExemptions } = getCurrentYearData();

    // Hesaplamaları al
    const results = calculateSalary({
        year: currentYear,
        grossSalaries,
        asgariUcret: DEFAULT_ASGARI_UCRET,
        customRates,
        customExemptions
    });

    // Toplam ve ortalama hesapla
    const sum = (key) => results.reduce((acc, cur) => acc + (cur[key] || 0), 0);
    const avg = (key) => results.length ? sum(key) / results.length : 0;

    // Yüzde oranları (brüt ve nete göre)
    const percent = (val, base) => base ? (val / base * 100).toFixed(1) : '0';

    // Excel export fonksiyonu
    const exportToExcel = () => {
        // Excel için veri hazırla
        const excelData = [];

        // Başlık satırı
        excelData.push([
            `${currentYear} YILI MAAŞ HESAPLAMALARI`,
            '', '', '', '', '', '', ''
        ]);

        // Boş satır
        excelData.push(['', '', '', '', '', '', '', '']);

        // Tablo başlıkları
        excelData.push([
            'AY',
            'BRÜT ÜCRET (₺)',
            'ÇALIŞAN SGK PRİMİ (₺)',
            'ÇALIŞAN İŞSİZLİK SİGORTASI (₺)',
            'DAMGA VERGİSİ (₺)',
            'GELİR VERGİSİ DİLİMİ',
            'GELİR VERGİSİ (₺)',
            'NET ÜCRET (₺)'
        ]);

        // Aylık veriler
        months.forEach((month, idx) => {
            const result = results[idx] || {};
            excelData.push([
                month,
                result.A || 0,
                result.B || 0,
                result.C || 0,
                result.F || 0,
                result.dilim || '-',
                result.E || 0,
                result.H || 0
            ]);
        });

        // Boş satır
        excelData.push(['', '', '', '', '', '', '', '']);

        // Toplam satırı
        excelData.push([
            'TOPLAM',
            sum('A'),
            sum('B'),
            sum('C'),
            sum('F'),
            '-',
            sum('E'),
            sum('H')
        ]);

        // Ortalama satırı
        excelData.push([
            'ORTALAMA',
            avg('A'),
            avg('B'),
            avg('C'),
            avg('F'),
            '-',
            avg('E'),
            avg('H')
        ]);

        // Boş satır
        excelData.push(['', '', '', '', '', '', '', '']);

        // Yüzde oranları
        excelData.push([
            'BRÜT\'E ORANI (%)',
            '100',
            percent(sum('B'), sum('A')),
            percent(sum('C'), sum('A')),
            percent(sum('F'), sum('A')),
            '-',
            percent(sum('E'), sum('A')),
            percent(sum('H'), sum('A'))
        ]);

        excelData.push([
            'NET\'E ORANI (%)',
            percent(sum('A'), sum('H')),
            percent(sum('B'), sum('H')),
            percent(sum('C'), sum('H')),
            percent(sum('F'), sum('H')),
            '-',
            percent(sum('E'), sum('H')),
            '100'
        ]);

        // Workbook oluştur
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);

        // Sütun genişlikleri ayarla
        ws['!cols'] = [
            { width: 12 }, // Ay
            { width: 18 }, // Brüt Ücret
            { width: 20 }, // SGK Primi
            { width: 25 }, // İşsizlik Sigortası
            { width: 18 }, // Damga Vergisi
            { width: 18 }, // Gelir Vergisi Dilimi
            { width: 18 }, // Gelir Vergisi
            { width: 18 }  // Net Ücret
        ];

        // Türk Lirası formatı: #,##0.00" ₺"
        const currencyFormat = '#,##0.00" ₺"';
        const percentFormat = '0.0"%"';

        // Sayısal hücrelere format uygula
        const range = XLSX.utils.decode_range(ws['!ref']);

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellRef]) continue;

                // Para birimi sütunları (B, C, D, E, G, H - yani 1,2,3,4,6,7)
                if ((C >= 1 && C <= 4) || (C >= 6 && C <= 7)) {
                    // Başlık satırları hariç (R >= 3 ve sayısal değerler)
                    if (R >= 3 && typeof ws[cellRef].v === 'number') {
                        if (!ws[cellRef].s) ws[cellRef].s = {};
                        ws[cellRef].s.numFmt = currencyFormat;
                    }
                }

                // Yüzde sütunları (son 2 satır için)
                if (R >= range.e.r - 1) {
                    if ((C >= 1 && C <= 4) || (C >= 6 && C <= 7)) {
                        if (typeof ws[cellRef].v === 'string' && ws[cellRef].v.includes('.')) {
                            // String yüzde değerlerini sayıya çevir
                            const numValue = parseFloat(ws[cellRef].v);
                            if (!isNaN(numValue)) {
                                ws[cellRef].v = numValue;
                                ws[cellRef].t = 'n';
                                if (!ws[cellRef].s) ws[cellRef].s = {};
                                ws[cellRef].s.numFmt = percentFormat;
                            }
                        }
                    }
                }
            }
        }

        // Worksheet'i workbook'a ekle
        XLSX.utils.book_append_sheet(wb, ws, `${currentYear} Maaş Hesabı`);

        // Dosyayı indir
        const fileName = `${currentYear}_maas_hesaplama_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="salary-table-wrapper">
            <HamburgerMenu onFutureYearClick={handleNewYear} />

            {showFutureYearForm && (
                <FutureYearForm
                    onSubmit={handleFutureYearSubmit}
                    onClose={() => {
                        setShowFutureYearForm(false);
                        setEditMode(false);
                    }}
                    savedYears={savedYears}
                    initialValues={editMode && editingYear && savedYears[editingYear] ? {
                        year: editingYear,
                        taxRates: savedYears[editingYear].taxRates,
                        exemptions: savedYears[editingYear].exemptions,
                        inflation: savedYears[editingYear].inflation
                    } : null}
                />
            )}

            <div className="year-info">
                <h2>{currentYear} Yılı Hesaplaması</h2>
                <div className="year-buttons">
                    {/* Yıl seçici dropdown */}
                    {Object.keys(savedYears).length > 0 && (
                        <select
                            className="year-selector"
                            value={currentYear}
                            onChange={(e) => switchToYear(parseInt(e.target.value))}
                        >
                            <option value={DEFAULT_YEAR}>{DEFAULT_YEAR} (Varsayılan)</option>
                            {Object.keys(savedYears).sort().map(year => (
                                <option key={year} value={year}>
                                    {year} (Özel)
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Export butonu */}
                    <button className="export-btn" onClick={exportToExcel}>
                        📊 Excel İndir
                    </button>

                    {currentYear !== DEFAULT_YEAR && (
                        <button className="reset-btn" onClick={resetToDefault}>
                            {DEFAULT_YEAR}'e Dön
                        </button>
                    )}
                    {customRates && (
                        <button className="edit-rates-btn" onClick={() => handleEditRates(currentYear)}>
                            {currentYear} Vergi Oranlarını Düzenle
                        </button>
                    )}
                </div>
            </div>

            <table className="salary-table">
                <thead>
                    <tr>
                        <th rowSpan="4" className="blue">{currentYear}</th>
                        <th rowSpan="4">Brüt Ücret ₺</th>
                        <th colSpan="5" className="red">Yasal Kesintiler ₺</th>
                        <th rowSpan="4">Net Ücret ₺</th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="orange">SGK + İşsizlik</th>
                        <th colSpan="3" className="red">Vergi</th>
                    </tr>
                    <tr>
                        <th rowSpan="2" className="orange">Çalışan SGK Primi</th>
                        <th rowSpan="2" className="orange">Çalışan İşsizlik Sigortası</th>
                        <th rowSpan="2" className="red">Damga Vergisi</th>
                        <th colSpan="2" className="red">Gelir</th>
                    </tr>
                    <tr>
                        <th className="red">Dilim</th>
                        <th className="red">Gelir Vergisi</th>
                    </tr>
                </thead>
                <tbody>
                    {months.map((month, idx) => (
                        <tr key={month}>
                            <td>{month}</td>
                            <td>
                                <input
                                    className="salary-input"
                                    type="text"
                                    placeholder="33.030,00"
                                    value={grossSalaries[idx]}
                                    onChange={e => handleGrossChange(idx, e.target.value)}
                                />
                            </td>
                            <td>{results[idx]?.B?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                            <td>{results[idx]?.C?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                            <td>{results[idx]?.F?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                            <td>{results[idx]?.dilim || '-'}</td>
                            <td>{results[idx]?.E?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                            <td>{results[idx]?.H?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                        </tr>
                    ))}

                    <tr className="total-row">
                        <td>Toplam</td>
                        <td>{sum('A').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{sum('B').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{sum('C').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{sum('F').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>-</td>
                        <td>{sum('E').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{sum('H').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="average-row">
                        <td>Ortalama</td>
                        <td>{avg('A').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{avg('B').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{avg('C').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{avg('F').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>-</td>
                        <td>{avg('E').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{avg('H').toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>

                    <tr className="percent-row">
                        <td>Brüt'e Oranı</td>
                        <td>%100</td>
                        <td>{percent(sum('B'), sum('A'))}%</td>
                        <td>{percent(sum('C'), sum('A'))}%</td>
                        <td>{percent(sum('F'), sum('A'))}%</td>
                        <td>-</td>
                        <td>{percent(sum('E'), sum('A'))}%</td>
                        <td>{percent(sum('H'), sum('A'))}%</td>
                    </tr>
                    <tr className="percent-row">
                        <td>Net'e Oranı</td>
                        <td>{percent(sum('A'), sum('H'))}%</td>
                        <td>{percent(sum('B'), sum('H'))}%</td>
                        <td>{percent(sum('C'), sum('H'))}%</td>
                        <td>{percent(sum('F'), sum('H'))}%</td>
                        <td>-</td>
                        <td>{percent(sum('E'), sum('H'))}%</td>
                        <td>%100</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SalaryTable; 
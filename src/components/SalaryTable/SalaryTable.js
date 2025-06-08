import React, { useState } from 'react';
import './SalaryTable.css';
import { calculateSalary } from '../../utils/calculateSalary';

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DEFAULT_YEAR = 2025;
const DEFAULT_ASGARI_UCRET = 26005.5;

const SalaryTable = () => {
    const [grossSalaries, setGrossSalaries] = useState(Array(12).fill(''));

    const handleGrossChange = (idx, value) => {
        const newSalaries = [...grossSalaries];
        for (let i = idx; i < newSalaries.length; i++) {
            newSalaries[i] = value;
        }
        setGrossSalaries(newSalaries);
    };

    // Hesaplamaları al
    const results = calculateSalary({
        year: DEFAULT_YEAR,
        grossSalaries,
        asgariUcret: DEFAULT_ASGARI_UCRET
    });

    // Toplam ve ortalama hesapla
    const sum = (key) => results.reduce((acc, cur) => acc + (cur[key] || 0), 0);
    const avg = (key) => results.length ? sum(key) / results.length : 0;

    // Yüzde oranları (brüt ve nete göre)
    const percent = (val, base) => base ? (val / base * 100).toFixed(1) : '0';

    return (
        <div className="salary-table-wrapper">
            <table className="salary-table">
                <thead>
                    <tr>
                        <th rowSpan="4" className="blue">2025</th>
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
                                    placeholder="26.005,50"
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
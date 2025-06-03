import React, { useState } from 'react';
import './SalaryTable.css';

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const SalaryTable = () => {
    const [grossSalaries, setGrossSalaries] = useState(Array(12).fill(''));

    const handleGrossChange = (idx, value) => {
        const newSalaries = [...grossSalaries];
        for (let i = idx; i < newSalaries.length; i++) {
            newSalaries[i] = value;
        }
        setGrossSalaries(newSalaries);
    };

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
                            <td>0,00</td>
                            <td>0,00</td>
                            <td>0,00</td>
                            <td>0,00</td>
                            <td>0,00</td>
                            <td>0,00</td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td>Toplam</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                    </tr>
                    <tr className="average-row">
                        <td>Ortalama</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                        <td>0,00</td>
                    </tr>
                    <tr className="percent-row">
                        <td>Brüt'e Oranı</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                    </tr>
                    <tr className="percent-row">
                        <td>Maaş'a Oranı</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                        <td>%0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SalaryTable; 
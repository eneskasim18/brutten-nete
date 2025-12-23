import TaxRates from './TaxRates';

// SGK tavanı: asgari ücret * 7.5 (genellikle)
function getSgkTavan(year, asgariUcret) {
    // İleride yıl bazlı değişiklik olursa buradan güncellenebilir
    return asgariUcret * 7.5;
}

// Yıllara göre devletin açıkladığı aylık gelir ve damga vergisi istisnaları
export const ISTISNA = {
    2023: {
        gelir: [1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00, 1919.00],
        damga: [137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34, 137.34]
    },
    2024: {
        gelir: [2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53, 2336.53],
        damga: [167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03, 167.03]
    },
    2025: {
        gelir: [3315.70, 3315.70, 3315.70, 3315.70, 3315.70, 3315.70, 3315.70, 4257.57, 4420.93, 4420.93, 4420.93, 4420.93],
        damga: [197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38, 197.38]
    },
    2026: {
        gelir: [4160.87, 4160.87, 4160.87, 4160.87, 4160.87, 4160.87, 4160.87, 5342.82, 5547.83, 5547.83, 5547.83, 5547.83],
        damga: [247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69, 247.69]
    }
};

// Asgari ücret istisnası 2022 ve sonrası için geçerli
export function calculateSalary({ year, grossSalaries, asgariUcret, customRates = null, customExemptions = null }) {
    const rates = customRates || TaxRates.getRates(year);
    const exemptions = customExemptions || ISTISNA[year];
    const results = [];
    let cumulativeMatrah = 0;
    const sgkTavan = getSgkTavan(year, asgariUcret);

    // Yardımcı fonksiyon: Gelir vergisi hesapla
    const calculateIncomeTax = (matrah, cumulativeMatrah, taxRates) => {
        let tax = 0;
        let kalanMatrah = matrah;
        let kalanKumulatif = cumulativeMatrah;
        const usedDilims = [];

        for (const dilim of taxRates) {
            const dilimBas = Math.max(dilim.min, kalanKumulatif);
            const dilimSon = Math.min(dilim.max, kalanKumulatif + kalanMatrah);

            if (dilimSon > dilimBas) {
                usedDilims.push(dilim);
                const tutar = dilimSon - dilimBas;
                tax += tutar * dilim.oran;
                kalanMatrah -= tutar;
                kalanKumulatif += tutar;
            }
            if (kalanMatrah <= 0) break;
        }
        return { tax, usedDilims };
    };

    let cumulativeAsgariMatrah = 0;

    for (let i = 0; i < grossSalaries.length; i++) {
        // Parse input
        const rawInput = grossSalaries[i]?.toString() || '0';
        const cleanInput = rawInput.replace(/\./g, '').replace(',', '.');
        const A = parseFloat(cleanInput) || 0;

        // SGK ve işsizlik tavanı
        const sgkMatrah = Math.min(A, sgkTavan);
        const B = Math.round(sgkMatrah * rates.sgk * 100) / 100;
        const C = Math.round(sgkMatrah * rates.issizlik * 100) / 100;
        const D = Math.round((A - (B + C)) * 100) / 100; // Gelir Vergisi Matrahı

        // Çalışanın Gelir Vergisi (İstisnasız)
        const { tax: rawTax, usedDilims } = calculateIncomeTax(D, cumulativeMatrah, rates.gelir);

        let istisnaGelir = 0;
        let istisnaDamga = 0;

        if (exemptions) {
            istisnaGelir = exemptions.gelir[i];
            istisnaDamga = exemptions.damga[i];
        } else if (year >= 2022) {
            // Dinamik İstisna Hesabı
            const asgariBrut = asgariUcret;
            const asgariSgkMatrah = asgariBrut; // Tavanı aşamaz
            const asgariB = asgariSgkMatrah * rates.sgk;
            const asgariC = asgariSgkMatrah * rates.issizlik;
            const asgariMatrah = asgariBrut - (asgariB + asgariC);

            // Asgari ücretin kümülatif vergisini hesapla
            const { tax: asgariTax } = calculateIncomeTax(asgariMatrah, cumulativeAsgariMatrah, rates.gelir);
            istisnaGelir = asgariTax;

            cumulativeAsgariMatrah += asgariMatrah;

            // Damga İstisnası
            istisnaDamga = Math.round(asgariBrut * rates.damga * 100) / 100;
        }

        // Net Gelir Vergisi (Eksiye düşemez)
        let E = Math.max(0, rawTax - istisnaGelir);
        E = Math.round(E * 100) / 100;

        // Damga Vergisi
        const totalDamga = Math.round(A * rates.damga * 100) / 100;
        let F = Math.max(0, totalDamga - istisnaDamga);
        // Yuvarlama farkları için son kontrol
        F = Math.round(F * 100) / 100;

        // Net maaş
        const H = Math.round((A - (B + C + E + F)) * 100) / 100;

        let I = 0; // Agi yok
        let J = Math.round((H + I) * 100) / 100;

        // Asgari ücret desteği (sadece 33030 TL brüt için)
        if (Math.abs(A - 33030) < 0.1) {
            J += 1270;
        }

        // Kümülatif Güncelle
        cumulativeMatrah += D;

        // Dilim Stringi
        let dilimStr = '-';
        if (usedDilims.length > 0) {
            const minDilim = Math.min(...usedDilims.map(d => d.oran));
            const maxDilim = Math.max(...usedDilims.map(d => d.oran));
            if (minDilim === maxDilim) {
                dilimStr = `%${Math.round(minDilim * 100)}`;
            } else {
                dilimStr = `%${Math.round(minDilim * 100)}-%${Math.round(maxDilim * 100)}`;
            }
        }

        results.push({
            A, B, C, D, E, F, G: cumulativeMatrah, H, I, J, dilim: dilimStr
        });
    }
    return results;
} 
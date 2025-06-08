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
    }
};

// Asgari ücret istisnası 2022 ve sonrası için geçerli
export function calculateSalary({ year, grossSalaries, asgariUcret, customRates = null, customExemptions = null }) {
    const rates = customRates || TaxRates.getRates(year);
    const exemptions = customExemptions || ISTISNA[year];
    const results = [];
    let cumulativeMatrah = 0;
    const sgkTavan = getSgkTavan(year, asgariUcret);

    for (let i = 0; i < grossSalaries.length; i++) {
        const A = parseFloat(grossSalaries[i]?.toString().replace(',', '.')) || 0;
        // SGK ve işsizlik için tavan uygula
        const sgkMatrah = Math.min(A, sgkTavan);
        const B = Math.round(sgkMatrah * rates.sgk * 100) / 100;
        const C = Math.round(sgkMatrah * rates.issizlik * 100) / 100;
        const D = Math.round((A - (B + C)) * 100) / 100;

        // İlgili yıl için devletin açıkladığı istisna tutarlarını kullan
        let gelirVergisiMatrah = D; // İstisna matrahtan değil, vergiden düşülecek
        let I = 0; // Asgari Geçim İndirimi (2022+ yok)

        if (exemptions) {
            // İstisna vergiden düşülecek, matrahtan değil
        } else if (year >= 2022) {
            // Eski mantık: asgari ücretin matrahı kadar istisna
            const asgariMatrah = asgariUcret - (asgariUcret * (rates.sgk + rates.issizlik));
            gelirVergisiMatrah = Math.max(0, D - asgariMatrah);
        }

        // Kümülatif matrah (önceki aylar dahil)
        const G = cumulativeMatrah + D;

        // Gelir vergisi hesaplama (kademeli)
        let kalanMatrah = gelirVergisiMatrah;
        let E = 0;
        let kalanKumulatif = G - gelirVergisiMatrah;
        let usedDilims = [];
        for (const dilim of rates.gelir) {
            const dilimBas = Math.max(dilim.min, kalanKumulatif);
            const dilimSon = Math.min(dilim.max, kalanKumulatif + kalanMatrah);
            if (dilimSon > dilimBas) {
                usedDilims.push(dilim);
                const tutar = dilimSon - dilimBas;
                E += tutar * dilim.oran;
                kalanMatrah -= tutar;
                kalanKumulatif += tutar;
            }
            if (kalanMatrah <= 0) break;
        }
        E = Math.round(E * 100) / 100;

        // Damga vergisi
        let F;
        if (exemptions) {
            F = Math.max(0, Math.round((A * rates.damga - exemptions.damga[i]) * 100) / 100);
        } else {
            F = Math.round(A * rates.damga * 100) / 100;
        }

        // İstisnalar hesaplanan vergi tutarından düşülmeli
        if (exemptions) {
            E = Math.max(0, E - exemptions.gelir[i]);
        }

        // Net maaş
        const H = Math.round((A - (B + C + E + F)) * 100) / 100;
        // Toplam ele geçen
        const J = Math.round((H + I) * 100) / 100;

        // Hangi dilim(ler)de?
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
            A, B, C, D, E, F, G, H, I, J, dilim: dilimStr
        });
        cumulativeMatrah += D;
    }
    return results;
} 
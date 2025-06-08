class TaxRates {
    static rates = {
        2016: {
            sgk: 0.14, // Çalışan SGK Primi
            issizlik: 0.01, // Çalışan İşsizlik Sigortası (%1)
            damga: 0.00759, // Damga Vergisi
            gelir: [
                { min: 0, max: 12600, oran: 0.15 },
                { min: 12600, max: 30000, oran: 0.20 },
                { min: 30000, max: 110000, oran: 0.27 },
                { min: 110000, max: 500000, oran: 0.35 },
                { min: 500000, max: Infinity, oran: 0.40 }
            ]
        },
        2017: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 13000, oran: 0.15 },
                { min: 13000, max: 30000, oran: 0.20 },
                { min: 30000, max: 110000, oran: 0.27 },
                { min: 110000, max: 500000, oran: 0.35 },
                { min: 500000, max: Infinity, oran: 0.40 }
            ]
        },
        2018: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 18800, oran: 0.15 },
                { min: 18800, max: 34000, oran: 0.20 },
                { min: 34000, max: 120000, oran: 0.27 },
                { min: 120000, max: 500000, oran: 0.35 },
                { min: 500000, max: Infinity, oran: 0.40 }
            ]
        },
        2019: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 19000, oran: 0.15 },
                { min: 19000, max: 40000, oran: 0.20 },
                { min: 40000, max: 98000, oran: 0.27 },
                { min: 98000, max: 500000, oran: 0.35 },
                { min: 500000, max: Infinity, oran: 0.40 }
            ]
        },
        2020: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 22000, oran: 0.15 },
                { min: 22000, max: 49000, oran: 0.20 },
                { min: 49000, max: 180000, oran: 0.27 },
                { min: 180000, max: 600000, oran: 0.35 },
                { min: 600000, max: Infinity, oran: 0.40 }
            ]
        },
        2021: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 24000, oran: 0.15 },
                { min: 24000, max: 53000, oran: 0.20 },
                { min: 53000, max: 190000, oran: 0.27 },
                { min: 190000, max: 650000, oran: 0.35 },
                { min: 650000, max: Infinity, oran: 0.40 }
            ]
        },
        2022: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 32000, oran: 0.15 },
                { min: 32000, max: 70000, oran: 0.20 },
                { min: 70000, max: 250000, oran: 0.27 },
                { min: 250000, max: 880000, oran: 0.35 },
                { min: 880000, max: Infinity, oran: 0.40 }
            ]
        },
        2023: {
            sgk: 0.14,
            issizlik: 0.01,
            damga: 0.00759,
            gelir: [
                { min: 0, max: 70000, oran: 0.15 },
                { min: 70000, max: 150000, oran: 0.20 },
                { min: 150000, max: 550000, oran: 0.27 },
                { min: 550000, max: 1900000, oran: 0.35 },
                { min: 1900000, max: Infinity, oran: 0.40 }
            ]
        },
        2024: {
            sgk: 0.14,
            issizlik: 0.01,
            damga: 0.00759,
            gelir: [
                { min: 0, max: 110000, oran: 0.15 },
                { min: 110000, max: 230000, oran: 0.20 },
                { min: 230000, max: 870000, oran: 0.27 },
                { min: 870000, max: 3000000, oran: 0.35 },
                { min: 3000000, max: Infinity, oran: 0.40 }
            ]
        },
        2025: {
            sgk: 0.14,
            issizlik: 0.01, // %1
            damga: 0.00759,
            gelir: [
                { min: 0, max: 158000, oran: 0.15 },
                { min: 158000, max: 330000, oran: 0.20 },
                { min: 330000, max: 1200000, oran: 0.27 },
                { min: 1200000, max: 4300000, oran: 0.35 },
                { min: 4300000, max: Infinity, oran: 0.40 }
            ]
        }
    };

    static getRates(year) {
        return this.rates[year];
    }
}

export default TaxRates; 
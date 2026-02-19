export interface PropertyRecord {
  pin: string;
  address: string;
  township: string;
  neighborhood_code: string;
  mailed_tot: number | null;
  certified_tot: number | null;
  board_tot: number | null;
  equalization_factor: number;
  tax_rate_year: number;
  tax_rate_value: number;
}

export const MOCK_PROPERTIES: Record<string, PropertyRecord> = {
  "12345678901234": {
    pin: "12345678901234",
    address: "123 Main St, Chicago, IL 60614",
    township: "Lake View",
    neighborhood_code: "12345",
    mailed_tot: 100000,
    certified_tot: 110000,
    board_tot: 120000,
    equalization_factor: 3.0,
    tax_rate_year: 2024,
    tax_rate_value: 7.25,
  },
  "98765432109876": {
    pin: "98765432109876",
    address: "456 Oak Avenue, Evanston, IL 60201",
    township: "Evanston",
    neighborhood_code: "98765",
    mailed_tot: 250000,
    certified_tot: 260000,
    board_tot: null,
    equalization_factor: 3.0,
    tax_rate_year: 2024,
    tax_rate_value: 8.10,
  },
  "11223344556677": {
    pin: "11223344556677",
    address: "789 Elm Boulevard, Skokie, IL 60077",
    township: "Niles",
    neighborhood_code: "55432",
    mailed_tot: 185000,
    certified_tot: null,
    board_tot: null,
    equalization_factor: 2.9163,
    tax_rate_year: 2024,
    tax_rate_value: 9.50,
  },
  "55667788990011": {
    pin: "55667788990011",
    address: "321 Maple Court, Oak Park, IL 60301",
    township: "Oak Park",
    neighborhood_code: "33211",
    mailed_tot: 320000,
    certified_tot: 335000,
    board_tot: 310000,
    equalization_factor: 3.0,
    tax_rate_year: 2023,
    tax_rate_value: 10.25,
  },
  "44332211009988": {
    pin: "44332211009988",
    address: "654 Pine Street, Cicero, IL 60804",
    township: "Cicero",
    neighborhood_code: "77654",
    mailed_tot: 95000,
    certified_tot: 98000,
    board_tot: 92000,
    equalization_factor: 2.9163,
    tax_rate_year: 2024,
    tax_rate_value: 11.75,
  },
  "22334455667788": {
    pin: "22334455667788",
    address: "987 Willow Way, Berwyn, IL 60402",
    township: "Berwyn",
    neighborhood_code: "22876",
    mailed_tot: null,
    certified_tot: null,
    board_tot: null,
    equalization_factor: 3.0,
    tax_rate_year: 2024,
    tax_rate_value: 8.75,
  },
};

import type { Client, AuthState, Payment } from "./types";
import { TOTAL_SUBSCRIPTION_AMOUNT } from "./types";

const AUTH_KEY = "romapix_auth";
const CLIENTS_KEY = "romapix_clients";

// Auth storage
export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) {
    return { isAuthenticated: false, user: null };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

export function setAuthState(state: AuthState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

// Client storage
export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CLIENTS_KEY);
  if (!stored) {
    // Initialize with data from PDF
    const initialClients = getInitialClients();
    setClients(initialClients);
    return initialClients;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function setClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function addClient(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  setClients(clients);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Omit<Client, "id" | "createdAt">>): Client | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;
  clients[index] = {
    ...clients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  setClients(clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;
  setClients(filtered);
  return true;
}

export function getClientById(id: string): Client | null {
  const clients = getClients();
  return clients.find((c) => c.id === id) || null;
}

// Add a payment to a client
export function addPayment(clientId: string, payment: Omit<Payment, "id">): Client | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;
  
  const newPayment: Payment = {
    ...payment,
    id: crypto.randomUUID(),
  };
  
  clients[index].payments.push(newPayment);
  clients[index].updatedAt = new Date().toISOString();
  setClients(clients);
  return clients[index];
}

// Delete a payment from a client
export function deletePayment(clientId: string, paymentId: string): Client | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;
  
  clients[index].payments = clients[index].payments.filter((p) => p.id !== paymentId);
  clients[index].updatedAt = new Date().toISOString();
  setClients(clients);
  return clients[index];
}

// Helper to create a client with payments from PDF data
function createClientFromPDF(
  id: string,
  name: string,
  phone: string,
  standNumber: string,
  paymentsData: { description: string; amount: number }[]
): Client {
  const now = new Date().toISOString();
  const payments: Payment[] = paymentsData
    .filter(p => p.amount > 0)
    .map((p, idx) => ({
      id: `${id}-payment-${idx}`,
      description: p.description,
      amount: p.amount,
      date: "2024-01-01", // Historical payments
    }));

  return {
    id,
    name,
    standNumber,
    phone: phone || "N/A",
    email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@client.com`,
    subscriptionDate: "2024-01-01",
    totalAmount: TOTAL_SUBSCRIPTION_AMOUNT,
    payments,
    createdAt: now,
    updatedAt: now,
  };
}

// All 105 clients from the PDF
function getInitialClients(): Client[] {
  return [
    createClientFromPDF("1", "Chitumba W.", "0774915087", "11378", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 195 },
    ]),
    createClientFromPDF("2", "Tigowa V.", "0775480647", "11379", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
    ]),
    createClientFromPDF("3", "Kandoto Mike", "0772563830", "11380", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 135 },
    ]),
    createClientFromPDF("4", "Mutambirwa N.S.", "", "11381", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 35 },
    ]),
    createClientFromPDF("5", "Savieri K.", "0773060191", "11382", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
    ]),
    createClientFromPDF("6", "Dingilesi E.", "0772384382", "11383", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "$5 Contrib. Nov20-March24", amount: 60 },
    ]),
    createClientFromPDF("7", "Changamire", "0772657653", "11384", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("8", "Mutumbami B.", "0772383618", "511414", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 145 },
    ]),
    createClientFromPDF("9", "Fungura S.", "0774058155", "11415", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 80 },
    ]),
    createClientFromPDF("10", "Gutsa Lin", "0713766495", "11417", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 50 },
    ]),
    createClientFromPDF("11", "Mahangate Z.", "0775249923", "11424", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 93 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 147 },
    ]),
    createClientFromPDF("12", "Mugebe P.", "0772621521", "11425", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 100 },
    ]),
    createClientFromPDF("13", "Katere J.", "", "11427", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
    ]),
    createClientFromPDF("14", "Tsvito Simbarashe", "0772522489", "11428", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 45 },
    ]),
    createClientFromPDF("15", "Nyanyiwa G.", "", "11429", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("16", "Chinyani R.", "0779661870", "11431", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 205 },
    ]),
    createClientFromPDF("17", "Danga Susan", "0775647195", "11432", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 80 },
    ]),
    createClientFromPDF("18", "Chinobva F.", "0772436363", "11433", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 50 },
    ]),
    createClientFromPDF("19", "Ncube B.", "0777604610", "11434", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 135 },
    ]),
    createClientFromPDF("20", "Mverechena S.", "0773011229", "11435", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 60 },
    ]),
    createClientFromPDF("21", "Nyahema B.", "0774337649", "11436", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 20 },
      { description: "5th Contribution - Diagrams", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 40 },
    ]),
    createClientFromPDF("22", "Murevi Lilian", "0772704070", "11437", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 180 },
    ]),
    createClientFromPDF("23", "Gomonda Plaxcedes", "0772320552", "11438", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "November 25 Payment", amount: 33 },
    ]),
    createClientFromPDF("24", "Tinotenda Sango", "7196163211", "11439", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 20 },
    ]),
    createClientFromPDF("25", "Matumbura S.", "0773198989", "11442", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 180 },
    ]),
    createClientFromPDF("26", "Katiyo M.", "0772607136", "11443", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 185 },
    ]),
    createClientFromPDF("27", "Karuru Aaron", "0773491057", "11448", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 63 },
    ]),
    createClientFromPDF("28", "Mbawa W", "0773235537", "11449", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 160 },
    ]),
    createClientFromPDF("29", "Musapira Chipo L.", "0771832590", "11450", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("30", "Ruziwa Edward", "0772364323", "11451", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 97 },
    ]),
    createClientFromPDF("31", "Chatindo A.", "0774758060", "11452", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 20 },
    ]),
    createClientFromPDF("32", "Chifadza T.", "0773733242", "11457", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 122 },
    ]),
    createClientFromPDF("33", "Kanhema T.", "0776052425", "11458", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 10 },
      { description: "5th Contribution - Diagrams", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("34", "Mapurisa C", "7721163731", "11469", []),
    createClientFromPDF("35", "Chiweshe T.", "0773387873", "11472", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "$5 Contrib. Nov20-March24", amount: 115 },
      { description: "November 25 Payment", amount: 98 },
    ]),
    createClientFromPDF("36", "Nyachega N.", "0774384299", "11473", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 180 },
    ]),
    createClientFromPDF("37", "Madzime P.", "0772406311", "11475", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 180 },
    ]),
    createClientFromPDF("38", "Mutipforo", "0772851114", "11478", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 40 },
    ]),
    createClientFromPDF("39", "Musungwa A.", "0772819443", "11479", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("40", "Chipunza Bridget Mavis", "0784265631", "11486", [
      { description: "1st Contribution - Fence", amount: 53 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 152 },
      { description: "November 25 Payment", amount: 193 },
    ]),
    createClientFromPDF("41", "Fombe Chinazi", "0714518198", "11487", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 25 },
    ]),
    createClientFromPDF("42", "Mpofu P.", "0772644082", "11488", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 202 },
    ]),
    createClientFromPDF("43", "Muzanarwo A.", "0773046628", "11489", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("44", "Mukwaira N.", "0775509838", "11492", [
      { description: "1st Contribution - Fence", amount: 25 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 63 },
    ]),
    createClientFromPDF("45", "Nyamutanga P.", "0714518198", "11494", [
      { description: "1st Contribution - Fence", amount: 25 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("46", "Majonga C.", "0773810442", "11496", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 125 },
    ]),
    createClientFromPDF("47", "Marko G.", "0773387873", "11497", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
    ]),
    createClientFromPDF("48", "Matambanadzo Merc", "0777456900", "11501", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 50 },
    ]),
    createClientFromPDF("49", "Chikanda I.", "0772655808", "11502", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 85 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 160 },
    ]),
    createClientFromPDF("50", "Gambiza M.", "0772388270", "11503", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (100)", amount: 100 },
      { description: "$5 Contrib. Nov20-March24", amount: 110 },
    ]),
    createClientFromPDF("51", "Bonzo Chipo", "0772727440", "11504", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (65)", amount: 65 },
      { description: "$5 Contrib. Nov20-March24", amount: 70 },
    ]),
    createClientFromPDF("52", "Chifamba L.", "0773 863 509", "11505", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (27)", amount: 27 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("53", "Nyika U.", "0775421533", "11506", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 60 },
      { description: "November 25 Payment", amount: 33 },
    ]),
    createClientFromPDF("54", "Mudzingwa L.", "0712 093 716", "11507", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
    ]),
    createClientFromPDF("55", "Ngoroma E.", "0713512899", "11512", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 20 },
    ]),
    createClientFromPDF("56", "Kamuzunguze S", "0779 208137", "11513", []),
    createClientFromPDF("57", "Sherekete R.", "0772222470", "11516", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 47 },
    ]),
    createClientFromPDF("58", "Chigwedere K.", "0773040531", "11517", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 25 },
      { description: "November 25 Payment", amount: 49 },
    ]),
    createClientFromPDF("59", "Mutsambiwa Adiel", "", "11518", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 55 },
    ]),
    createClientFromPDF("60", "Mubaiwa Sarah", "0772276770", "11524", [
      { description: "1st Contribution - Fence", amount: 58 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 15 },
    ]),
    createClientFromPDF("61", "Kelosi E.", "0772448644", "11525", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (20)", amount: 20 },
      { description: "$5 Contrib. Nov20-March24", amount: 125 },
    ]),
    createClientFromPDF("62", "Mubangwa", "0773429980", "11529", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 160 },
    ]),
    createClientFromPDF("63", "Chizemo P.", "0772858254", "11532", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("64", "Shumbambiri G.", "0773020098", "11533", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 110 },
    ]),
    createClientFromPDF("65", "Dangazela Thamsanga", "0782716140", "11534", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 20 },
      { description: "November 25 Payment", amount: 60 },
    ]),
    createClientFromPDF("66", "Gift Siziva", "0788319721", "11536", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("67", "Mufuka Paida", "0772560216", "11542", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 5 },
      { description: "5th Contribution - Diagrams", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 190 },
    ]),
    createClientFromPDF("68", "Bere S. F.", "0772894541", "11543", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 202 },
    ]),
    createClientFromPDF("69", "Jawa Artwell", "0772646644", "11544", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 60 },
    ]),
    createClientFromPDF("70", "Kudezera V.", "0712 599 037", "11545", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 145 },
    ]),
    createClientFromPDF("71", "Njodzi Nellia", "0773801955", "11546", [
      { description: "1st Contribution - Fence", amount: 58 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 197 },
    ]),
    createClientFromPDF("72", "Urayayi Elizabeth", "0775017213", "11552", [
      { description: "1st Contribution - Fence", amount: 53 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 117 },
    ]),
    createClientFromPDF("73", "Perukai Justice", "0773645257", "11553", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 195 },
    ]),
    createClientFromPDF("74", "Mutsambi Adelaide C.", "0774130306", "11556", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 55 },
    ]),
    createClientFromPDF("75", "Njanike Event", "0774 330 017", "11557", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (120)", amount: 120 },
      { description: "November 25 Payment", amount: 30 },
    ]),
    createClientFromPDF("76", "Mukungunurwa Ene.", "0773156234", "11558", [
      { description: "1st Contribution - Fence", amount: 53 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 130 },
    ]),
    createClientFromPDF("77", "Dhliwayo Tatenda", "0771861893", "11561", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 5 },
      { description: "$5 Contrib. Nov20-March24", amount: 205 },
    ]),
    createClientFromPDF("78", "Chiba M.", "0772768695", "11562", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 190 },
    ]),
    createClientFromPDF("79", "Makoni G.", "0773416873", "11563", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 20 },
    ]),
    createClientFromPDF("80", "Chiweshe B.", "0772192425", "11564", [
      { description: "1st Contribution - Fence", amount: 25 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("81", "Muvuti R.", "0775097468", "11565", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 50 },
    ]),
    createClientFromPDF("82", "Mahovo T.", "", "11566", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (50)", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("83", "Majaya P.", "0772100498", "11567", [
      { description: "1st Contribution - Fence", amount: 25 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (70)", amount: 70 },
    ]),
    createClientFromPDF("84", "Zimbeva P.", "0775274581", "11568", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 155 },
    ]),
    createClientFromPDF("85", "Gwese M.", "0777131180", "11569", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "$5 Contrib. Nov20-March24", amount: 5 },
    ]),
    createClientFromPDF("86", "Jamali Gracious", "0777850426", "11570", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("87", "Mutukudzi Melody", "0772549627", "11571", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 55 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 155 },
    ]),
    createClientFromPDF("88", "Mafume R.", "0772441514", "11572", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
    ]),
    createClientFromPDF("89", "Sandengu N.", "0719778888", "11573", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
    ]),
    createClientFromPDF("90", "Chiwanza Kudzai", "0772529817", "11580", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
    ]),
    createClientFromPDF("91", "Musarurwa / Makina M.", "0773255360", "11581", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "4th Contribution - EMA", amount: 63 },
      { description: "$5 Contrib. Nov20-March24", amount: 7 },
    ]),
    createClientFromPDF("92", "Mudarikwa E", "0774 000 201", "11586", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (80)", amount: 80 },
      { description: "$5 Contrib. Nov20-March24", amount: 20 },
    ]),
    createClientFromPDF("93", "Bote M.", "0784008846", "11587", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 187 },
    ]),
    createClientFromPDF("94", "Chamanga David", "0772932060", "11594", [
      { description: "1st Contribution - Fence", amount: 53 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 170 },
    ]),
    createClientFromPDF("95", "Mlambo P.", "", "11627", [
      { description: "3rd Contribution - ROADS", amount: 40 },
    ]),
    createClientFromPDF("96", "Haukozi A.", "0773559 563", "11703", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams (103)", amount: 103 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 205 },
    ]),
    createClientFromPDF("97", "Chikwanda", "0772564967", "11704", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "$5 Contrib. Nov20-March24", amount: 10 },
    ]),
    createClientFromPDF("98", "Guwu S.", "0773269508", "11705", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 30 },
    ]),
    createClientFromPDF("99", "Mwaita Mushipe", "0775480647", "11389", []),
    createClientFromPDF("100", "Danda", "0713997243", "11385", []),
    createClientFromPDF("101", "Musora", "0772723230", "11388", []),
    createClientFromPDF("102", "Mugwagwa A", "7750834731", "11464", []),
    createClientFromPDF("103", "Mugura C", "0716784322", "11589", []),
    createClientFromPDF("104", "Nyanyiwa G. (2)", "0772703763", "11593", []),
    createClientFromPDF("105", "HOUSE OF PRAYER", "0712227665", "CHURCH-1", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 180 },
    ]),
    createClientFromPDF("106", "Zaoga Church", "0773526507", "CHURCH-2", [
      { description: "1st Contribution - Fence", amount: 50 },
      { description: "2nd Contribution - PEGS", amount: 40 },
      { description: "3rd Contribution - ROADS", amount: 50 },
      { description: "4th Contribution - EMA", amount: 40 },
      { description: "5th Contribution - Diagrams", amount: 40 },
      { description: "Survey (130)", amount: 130 },
      { description: "$5 Contrib. Nov20-March24", amount: 120 },
      { description: "November 25 Payment", amount: 400 },
    ]),
  ];
}

import { api } from "./api";

export async function getExchangeRate() {
  return (await api.get("/exchange")).data;
}
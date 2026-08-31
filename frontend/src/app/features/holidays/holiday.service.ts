import { api } from "../../lib/api";

export async function getHolidaysByYear(year: number) {
  try {
    const res = await api.get(`/api/holidays/${year}`);
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 503) {
      return {
        data: [],
        message: "Não foi possível carregar os feriados.",
        error: error.response?.data?.error ?? "BrasilAPI indisponível",
      };
    }

    if (error?.response?.status === 400) {
      return {
        data: [],
        message: "Ano inválido",
        error: "Ano inválido",
      };
    }

    return {
      data: [],
      message: "Não foi possível carregar os feriados.",
      error: "Falha ao consultar feriados",
    };
  }
}

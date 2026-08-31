export type Holiday = {
  date: string;
  name: string;
  type: string;
};

const BRAZILAPI_BASE_URL = "https://brasilapi.com.br/api/feriados/v1";

export async function getHolidaysByYear(year: number): Promise<Holiday[]> {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Ano inválido");
  }

  try {
    const response = await fetch(`${BRAZILAPI_BASE_URL}/${year}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`BrasilAPI respondeu com status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((holiday: any) => ({
      date: String(holiday?.date ?? ""),
      name: String(holiday?.name ?? "Feriado"),
      type: String(holiday?.type ?? "national"),
    }));
  } catch (error: any) {
    if (error instanceof Error && error.name === "TypeError") {
      throw new Error("BrasilAPI indisponível no momento");
    }

    if (error instanceof Error) {
      throw new Error(error.message || "Não foi possível carregar os feriados.");
    }

    throw new Error("Não foi possível carregar os feriados.");
  }
}

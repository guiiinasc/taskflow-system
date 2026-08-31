import { Request, Response } from "express";
import { getHolidaysByYear } from "./holidays.service";

export async function listByYear(req: Request, res: Response) {
  const rawYear = req.params.year;
  const year = Number(rawYear);

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return res.status(400).json({
      data: [],
      message: "Ano inválido",
      error: "Ano inválido",
    });
  }

  try {
    const holidays = await getHolidaysByYear(year);

    return res.json({
      data: holidays,
      message: holidays.length
        ? "Feriados carregados com sucesso"
        : "Nenhum feriado encontrado para o ano informado",
      error: null,
    });
  } catch (error: any) {
    return res.status(503).json({
      data: [],
      message: "Não foi possível carregar os feriados.",
      error: error.message || "BrasilAPI indisponível",
    });
  }
}

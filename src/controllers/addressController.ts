import { Request, Response } from "express";
import { getAddressByCep } from "../services/cepService";

export const getAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cep } = req.params;

    console.log(`Consultando CEP: ${cep}`);

    if (!cep) {
      res.status(400).json({ message: "CEP é obrigatório" });
      return;
    }

    const addressData = await getAddressByCep(cep);
    console.log(`CEP ${cep} encontrado:`, addressData);
    res.status(200).json(addressData);
  } catch (error) {
    console.error(`Erro ao consultar CEP ${req.params.cep}:`, error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao buscar endereço" });
    }
  }
};

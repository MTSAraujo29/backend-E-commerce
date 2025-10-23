import axios from "axios";

interface AddressInfo {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const getAddressByCep = async (cep: string): Promise<AddressInfo> => {
  try {
    console.log(`Iniciando consulta para CEP: ${cep}`);

    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, "");
    console.log(`CEP limpo: ${cleanCep}`);

    // Verifica se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new Error("CEP inválido. O CEP deve conter 8 dígitos.");
    }

    // Configuração do axios com timeout
    const axiosConfig = {
      timeout: 10000, // 10 segundos
      headers: {
        "User-Agent": "Mini-Ecommerce-API/1.0",
      },
    };

    console.log(
      `Fazendo requisição para ViaCEP: https://viacep.com.br/ws/${cleanCep}/json/`
    );

    // Faz a requisição para a API ViaCEP
    const response = await axios.get(
      `https://viacep.com.br/ws/${cleanCep}/json/`,
      axiosConfig
    );

    console.log(`Resposta da ViaCEP:`, response.data);

    // Verifica se a resposta contém erro
    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    // Verifica se todos os campos obrigatórios estão presentes
    if (!response.data.cep || !response.data.localidade) {
      throw new Error("Dados do CEP incompletos");
    }

    return response.data;
  } catch (error) {
    console.error(`Erro detalhado ao consultar CEP ${cep}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Timeout ao consultar CEP. Tente novamente.");
      }
      if (error.response?.status === 404) {
        throw new Error("CEP não encontrado");
      }
      throw new Error(`Erro ao consultar CEP: ${error.message}`);
    }
    throw error;
  }
};

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

    // Configuração do axios com timeout e retry
    const axiosConfig = {
      timeout: 15000, // 15 segundos
      headers: {
        "User-Agent": "Mini-Ecommerce-API/1.0",
        "Accept": "application/json",
      },
      // Configurações para contornar problemas de rede
      maxRedirects: 5,
      validateStatus: (status: number) => status < 500,
    };

    // Tentar múltiplas APIs de CEP
    const apis = [
      `https://viacep.com.br/ws/${cleanCep}/json/`,
      `https://cep.awesomeapi.com.br/json/${cleanCep}`,
      `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
    ];

    let lastError: any;

    for (const apiUrl of apis) {
      try {
        console.log(`Tentando API: ${apiUrl}`);
        
        const response = await axios.get(apiUrl, axiosConfig);
        
        console.log(`Resposta da API:`, response.data);

        // Verificar se a resposta é válida
        if (response.data && !response.data.erro) {
          // Normalizar dados para formato padrão
          const normalizedData = normalizeAddressData(response.data, apiUrl);
          
          if (normalizedData.cep && normalizedData.localidade) {
            console.log(`CEP ${cleanCep} encontrado via ${apiUrl}`);
            return normalizedData;
          }
        }
      } catch (error) {
        console.log(`Erro na API ${apiUrl}:`, error.message);
        lastError = error;
        continue; // Tentar próxima API
      }
    }

    // Se todas as APIs falharam
    throw new Error(`Não foi possível consultar o CEP ${cleanCep}. Todas as APIs estão indisponíveis.`);
    
  } catch (error) {
    console.error(`Erro detalhado ao consultar CEP ${cep}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Timeout ao consultar CEP. Tente novamente.");
      }
      if (error.code === "EHOSTUNREACH") {
        throw new Error("Erro de conectividade. Serviço de CEP temporariamente indisponível.");
      }
      if (error.response?.status === 404) {
        throw new Error("CEP não encontrado");
      }
      throw new Error(`Erro ao consultar CEP: ${error.message}`);
    }
    throw error;
  }
};

// Função para normalizar dados de diferentes APIs
function normalizeAddressData(data: any, apiUrl: string): AddressInfo {
  if (apiUrl.includes('viacep.com.br')) {
    return {
      cep: data.cep,
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      ibge: data.ibge || '',
      gia: data.gia || '',
      ddd: data.ddd || '',
      siafi: data.siafi || '',
    };
  }
  
  if (apiUrl.includes('awesomeapi.com.br')) {
    return {
      cep: data.cep,
      logradouro: data.address || '',
      complemento: '',
      bairro: data.district || '',
      localidade: data.city || '',
      uf: data.state || '',
      ibge: '',
      gia: '',
      ddd: '',
      siafi: '',
    };
  }
  
  if (apiUrl.includes('brasilapi.com.br')) {
    return {
      cep: data.cep,
      logradouro: data.street || '',
      complemento: '',
      bairro: data.neighborhood || '',
      localidade: data.city || '',
      uf: data.state || '',
      ibge: '',
      gia: '',
      ddd: '',
      siafi: '',
    };
  }
  
  // Fallback para dados genéricos
  return {
    cep: data.cep || '',
    logradouro: data.logradouro || data.street || data.address || '',
    complemento: data.complemento || '',
    bairro: data.bairro || data.district || data.neighborhood || '',
    localidade: data.localidade || data.city || '',
    uf: data.uf || data.state || '',
    ibge: data.ibge || '',
    gia: data.gia || '',
    ddd: data.ddd || '',
    siafi: data.siafi || '',
  };
}

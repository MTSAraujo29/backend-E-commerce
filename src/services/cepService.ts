import axios from 'axios';

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
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
    }
    
    // Faz a requisição para a API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    // Verifica se a resposta contém erro
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao consultar CEP: ${error.message}`);
    }
    throw error;
  }
};
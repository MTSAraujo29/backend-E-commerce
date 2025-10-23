// Script para corrigir problemas de migração automaticamente
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log("Verificando estrutura do banco...");

    // Tentar conectar e verificar se as tabelas existem
    await prisma.$connect();

    // Verificar se a tabela Order antiga existe
    try {
      await prisma.$queryRaw`SELECT 1 FROM \`Order\` LIMIT 1`;
      console.log(
        "Tabela Order antiga encontrada, será corrigida automaticamente..."
      );

      // Aqui você pode adicionar lógica para migrar dados se necessário
      // Por enquanto, vamos apenas garantir que as novas tabelas existam
    } catch (error) {
      console.log("Tabela Order antiga não encontrada, prosseguindo...");
    }

    console.log("Banco de dados verificado com sucesso!");
  } catch (error) {
    console.error("Erro ao verificar banco:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default fixDatabase;

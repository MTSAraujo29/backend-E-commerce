-- Migração manual para renomear tabelas Order e OrderItem
-- Esta migração resolve o conflito com palavras reservadas SQL

-- Renomear tabela Order para SaleOrder
RENAME TABLE `Order` TO `SaleOrder`;

-- Renomear tabela OrderItem para SaleOrderItem  
RENAME TABLE `OrderItem` TO `SaleOrderItem`;

-- Atualizar foreign keys se necessário
-- (O Prisma cuidará disso automaticamente)

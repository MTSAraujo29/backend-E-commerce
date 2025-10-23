-- Migração manual para renomear tabelas Order e OrderItem

-- Renomear tabela Order para SaleOrder
RENAME TABLE `Order` TO `SaleOrder`;

-- Renomear tabela OrderItem para SaleOrderItem  
RENAME TABLE `OrderItem` TO `SaleOrderItem`;


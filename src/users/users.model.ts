export enum Role {
  ADMIN = 'admin', // all crud and create users
  EDITOR = 'editor', // all crate crud but not users
  READER = 'lector', // Only read,
  SUSPENDED = 'suspended', // Esperando para ser aprobado
}

export enum Order {
  DESC = 'DESC',
  ASC = 'ASC',
}

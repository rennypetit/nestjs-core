export enum Role {
  ADMIN = 'admin', // all crud and create users
  EDITOR = 'editor', // all crate crud but not users
  COLLABORATOR = 'collaborator', // created crud in publish false
  READER = 'lector', // Only read
}

export enum Order {
  DESC = 'DESC',
  ASC = 'ASC',
}

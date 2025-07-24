import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    role: {
      type: 'varchar',
      length: 20,
      nullable: false,
      enum: ['superadmin', 'admin']
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    cart: {
      target: 'Cart',
      type: 'one-to-one',
      inverseSide: 'user'
    }
  }
});

export default User;
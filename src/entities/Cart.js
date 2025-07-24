import { EntitySchema } from 'typeorm';

const Cart = new EntitySchema({
  name: 'Cart',
  tableName: 'carts',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    user_id: {
      type: 'int',
      nullable: false
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
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    cartItems: {
      target: 'CartItem',
      type: 'one-to-many',
      inverseSide: 'cart'
    }
  }
});

export default Cart;
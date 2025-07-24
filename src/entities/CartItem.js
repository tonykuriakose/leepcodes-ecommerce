import { EntitySchema } from 'typeorm';

const CartItem = new EntitySchema({
  name: 'CartItem',
  tableName: 'cart_items',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    cart_id: {
      type: 'int',
      nullable: false
    },
    product_id: {
      type: 'int',
      nullable: false
    },
    quantity: {
      type: 'int',
      nullable: false,
      default: 1
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
      type: 'many-to-one',
      joinColumn: {
        name: 'cart_id'
      },
      onDelete: 'CASCADE'
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: {
        name: 'product_id'
      },
      onDelete: 'CASCADE'
    }
  },
  uniques: [
    {
      name: 'unique_cart_product',
      columns: ['cart_id', 'product_id']
    }
  ]
});

export default CartItem;
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import  User from '../../user/entities/user.entity';
  import {
    TransactionStatus,
    TransactionType,
  } from '../constants/transactions.enum';
  
  @Entity('Transactions')
  export class Transactions extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.id, {
      onDelete: 'CASCADE',
      eager: true,
    })
    @JoinColumn()
    user: User;
  
    @Column({ default: 0 })
    amount: number;
  
    @Column('enum', TransactionType)
    type: string;
  
    @Column('enum', TransactionStatus)
    status: string;
  
    @Column()
    reference: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    // this updates the date
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
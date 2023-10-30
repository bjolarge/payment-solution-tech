import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import Role from '../enum/role.enum';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @Column()
  //@Exclude()
  public password: string;

  //uncomment line 20 and 21
//   @Column()
//  public refreshToken:string; 
  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column({ default: false })
  public isEmailConfirmed: boolean;
  //the role mgt 
  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User]
  })
  public roles: Role[]
}
 
export default User;
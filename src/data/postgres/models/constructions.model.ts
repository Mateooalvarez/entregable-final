import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Player } from './player.model';

@Entity()
export class Construction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column("varchar", {
    length: 255,
    nullable: false,
    unique: true,
    
  })
  name: string;
  
  @Column("varchar", {
    length: 255,
    nullable: false,
  })
  type: string;
  
  @Column("int", {
    nullable: false,
    default: 1,
  })
  level: number;
  
  @Column("varchar", {
    length: 255,
    nullable: false,
  })
  location: string;
  
  @ManyToOne(() => Player, (player) => player.constructions)
  player: Player;
  
  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;
}
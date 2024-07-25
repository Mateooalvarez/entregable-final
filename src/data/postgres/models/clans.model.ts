


import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClanMember } from './clanMember.model';

@Entity()
export class Clan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(() => ClanMember, (clanMember) => clanMember.clan)
  clanMembers: ClanMember[];

  @Column("varchar", {
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 255,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
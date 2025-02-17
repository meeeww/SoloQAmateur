import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export enum PlayerRole {
  TOP = 'Toplaner',
  JUNGLE = 'Jungler',
  MID = 'Midlaner',
  ADC = 'ADC',
  SUPP = 'Support',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 16 })
  username!: string;

  @Column({ type: 'varchar', length: 16 })
  leagueName!: string;

  @Column({ type: 'varchar', length: 5 })
  leagueTag!: string;

  @Column({ type: 'varchar', length: 5 })
  twitter!: string;

  @Column({ type: 'varchar', length: 5 })
  twitch!: string;

  @Column({ type: 'varchar', length: 5 })
  discord!: string;

  @Column({ type: 'varchar', length: 5 })
  elo!: string;

  @Column({ type: 'varchar', length: 5 })
  partidas!: string;

  @Column({ type: 'varchar', length: 5 })
  victorias!: string;

  @Column({ type: 'varchar', length: 5 })
  derrotas!: string;

  @Column({ type: 'varchar', length: 5 })
  winRate!: string;

  @Column({ type: 'varchar', length: 5 })
  opgg!: string;

  @Column({ type: 'bigint' })
  createdAt!: number;

  @Column({ type: 'bigint' })
  lastUpdate!: number;

  @Column({
    type: 'enum',
    enum: PlayerRole,
  })
  rol!: PlayerRole;

  @BeforeInsert()
  setCreatedAt() {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    this.createdAt = currentUnixTime;
    this.lastUpdate = currentUnixTime;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.lastUpdate = Math.floor(Date.now() / 1000);
  }
}

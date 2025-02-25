import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';

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

  @Column({ default: 0 })
  positionTable!: number;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar' })
  leagueName!: string;

  @Column({ type: 'varchar' })
  leagueTag!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  leaguePuuid!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  leagueId!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  twitter!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  twitch!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  discord!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  icon!: string;

  @Column({ type: 'varchar', default: 'IRON' })
  tier!: string;

  @Column({ type: 'varchar', default: 'IV' })
  rank!: string;

  @Column({ default: 0 })
  leaguePoints!: number;

  @Column({ default: 0 })
  elo!: number;

  @Column({ default: 0 })
  partidas!: number;

  @Column({ default: 0 })
  victorias!: number;

  @Column({ default: 0 })
  derrotas!: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  winRate!: number;

  @Column({ type: 'varchar', default: '' })
  opgg!: string;

  @Column({ type: 'varchar', default: '' })
  teamName!: string;

  @Column({ type: 'varchar', default: 'IRON IV' })
  completeRank!: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: PlayerRole,
    default: null,
  })
  rol!: PlayerRole;

  @Column('bigint', { default: 0 })
  updated!: number;

  @BeforeUpdate()
  updateEpoch() {
    this.updated = Math.floor(Date.now() / 1000);
  }
}

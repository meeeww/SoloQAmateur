import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column({ default: 0 })
  positionTable!: number;

  @Column({ type: 'varchar', length: 16 })
  username!: string;

  @Column({ type: 'varchar', length: 16 })
  leagueName!: string;

  @Column({ type: 'varchar', length: 5 })
  leagueTag!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  leaguePuuid!: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  leagueId!: string;

  @Column({ type: 'varchar', length: 24, default: null, nullable: true })
  twitter!: string;

  @Column({ type: 'varchar', length: 24, default: null, nullable: true })
  twitch!: string;

  @Column({ type: 'varchar', length: 24, default: null, nullable: true })
  discord!: string;

  @Column({ type: 'varchar', length: 64, default: null, nullable: true })
  icon!: string;

  @Column({ type: 'varchar', length: 12, default: 'IRON' })
  tier!: string;

  @Column({ type: 'varchar', length: 4, default: 'IV' })
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

  @Column({
    nullable: true,
    type: 'enum',
    enum: PlayerRole,
    default: null,
  })
  rol!: PlayerRole;
}

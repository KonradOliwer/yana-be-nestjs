import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('note_name_unique', ['name'])
@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false})
  name: string;

  @Column({ nullable: false })
  content: string;
}
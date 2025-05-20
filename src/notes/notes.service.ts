import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  create(noteData: Partial<Note>) {
    const note = this.notesRepository.create(noteData);
    return this.notesRepository.save(note);
  }

  findAll() {
    return this.notesRepository.find();
  }

  findById(id: number) {
    return this.notesRepository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<Note>) {
    return this.notesRepository.update(id, data);
  }

  delete(id: number) {
    return this.notesRepository.delete(id);
  }
}
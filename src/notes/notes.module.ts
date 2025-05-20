import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './note.entity';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UsersModule, CaslModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}

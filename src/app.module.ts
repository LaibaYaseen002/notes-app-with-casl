import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { CaslModule } from './casl/casl.module';
import { User } from './users/user.entity';
import { Note } from './notes/note.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgresql',
      database: 'notes-app',
      entities: [User, Note],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    NotesModule,
    CaslModule,
  ],
})
export class AppModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  ForbiddenException,
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CaslAbilityFactory, Action } from '../casl/casl-ability.factory';
import { Note } from './note.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
  throw new NotFoundException('User not found');
}
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Create, Note)) {
      throw new ForbiddenException('Not allowed to create notes');
    }

    return this.notesService.create({ ...body, author: user });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: any,) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
    throw new NotFoundException('User not found');
  }
    const note = await this.notesService.findById(id);
  if (!note) {
    throw new NotFoundException('Note not found');
  }

    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, note)) {
      throw new ForbiddenException('You do not have permission to update this note');
    }

    return this.notesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    const user = await this.usersService.findById(req.user.userId);
     if (!user) {
    throw new NotFoundException('User not found');
  }
    const note = await this.notesService.findById(id);
if (!note) {
    throw new NotFoundException('Note not found');
  }
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Delete, note)) {
      throw new ForbiddenException('You do not have permission to delete this note');
    }

    return this.notesService.delete(id);
  }
}

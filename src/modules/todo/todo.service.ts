import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { DocumentService } from '../search/documents/document.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './repo/todo.repository';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) public readonly todoRepository: TodoRepository,
    private userService: UserService,
    private documentService: DocumentService,
  ) {}

  private readonly logger = new Logger(TodoService.name);

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.creation_date = new Date().toLocaleString();
    todo.dueDate = createTodoDto.dueDate.toLocaleString();
    todo.status = 'pending';
    todo.user = await this.userService.findUserById(userId);

    this.todoRepository.save(todo);

    this.saveTodoDocument(todo.title, todo.user.id);

    return "Successfully Added"
  }

  // save data in the userList Index of Meiliesearch
  async saveTodoDocument(name: string , userId: number){
    const todo = await this.todoRepository.findOne({
      relations: ['user'],
      where: {
        user: { id: userId },
        title: name,
      },
    });
    console.log(todo);
    const { id, title, creation_date , status, dueDate, user } = todo
    this.documentService.addTodoDocument('TodoList', {id, title, creation_date , status, dueDate, user })
  }

  async findPendingTodos(){
    return await this.todoRepository.find({
      relations: ['user'],
      where: {
        status: 'pending',
      },
    });
  }

  findAllTodos() {
    return this.todoRepository.find();
  }

  findAllTodosByUserNotCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: {
        user: { id: userId },
        status: 'pending',
      },
    });
  }

  findAllTodosByUserCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: {
        user: { id: userId },
        status: 'done',
      },
    });
  }

  update(todoId: number) {
    return this.todoRepository.update(todoId, {status : 'done'});
  }

  overDue(todoId: number) {
    return this.todoRepository.update(todoId, {status : 'overDue'});
  }

  remove(todoId: number) {
    return this.todoRepository.delete(todoId);
  }
}

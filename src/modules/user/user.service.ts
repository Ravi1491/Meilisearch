import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repo/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { DocumentService } from '../search/documents/document.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository : UserRepository,  
    private eventEmitter : EventEmitter2,
    private mailService: MailerService,
    private documentService: DocumentService,
  ){}

  private readonly logger = new Logger(UserService.name);

  create(createUserDto: CreateUserDto) : string {
    let user: User = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = createUserDto.password;
    user.role = Constants.ROLES.NORMAL_ROLE;

    this.userRepository.save(user);

    this.eventEmitter.emit('msg.sent', new UserCreatedEvent(user.firstName,user.email))
    
    this.saveDocument(user.email);

    return "SuccessFully Signup"
  }
  
  @OnEvent('msg.sent')
  sendEmail(payload : UserCreatedEvent ){
    this.mailService.sendMail({
      from: 'todo@gmail.com',
      to: payload.email,
      subject: "Todo Application",
      text: `${payload.firstName} - Succesfully Signup`
    });
  }
  
  // save data in the userList Index of Meiliesearch
  async saveDocument(emails : string){
    const user = await this.userRepository.findOne({where: { email: emails}})
    const { id, firstName, lastName, email, role } = user
    this.documentService.addDocument('userList', {id, firstName, lastName, email, role })
  }

  findAll() : Promise<User[]> {
    return this.userRepository.find();
  }
  
  findOne(id: number) {
    return this.userRepository.findOneOrFail({where: { id: id }});
  }

  findUserById(id: number) {
    return this.userRepository.findOneOrFail({where: { id: id }});
  }

  findUserByEmail(email:string){
    return this.userRepository.findOne({where: { email: email}})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    let user: User = new User();
    user.email = updateUserDto.email;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.password = updateUserDto.password;
    user.role = Constants.ROLES.NORMAL_ROLE;
    user.id = id;
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}

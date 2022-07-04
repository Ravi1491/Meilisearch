import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TodoService } from '../todo/todo.service';

@Injectable()
export class RemainderService {
  
  constructor(
    private todoService: TodoService,
    private mailService: MailerService,
  ) {}

  // @Cron('*/10 * * * * *')
  @Cron(CronExpression.EVERY_HOUR)   // At minute 0 past every hour
  async sendTodoRemainder(){
    let todo = this.todoService;
    let TodosNotCompleted = await todo.findPendingTodos();
    let TodosData = TodosNotCompleted.map(item => ({ email: item.user.email, id:item.id, title: item.title , dueDate: item.dueDate }))

    let TodosSendMail = TodosData.filter(function(item){
      let currentDateTime = new Date()
      let EndDateTime = new Date(item.dueDate)
      
      let TimeLeft = ((EndDateTime.getTime()) - (currentDateTime.getTime()))/(1000 * 60 * 60); 
      TimeLeft = (Math.floor(TimeLeft))

      if(TimeLeft < 0){
        todo.overDue(item.id);
      }

      if(TimeLeft == 24){
        return item.email;
      }

    })
    
    if(TodosSendMail.length !== 0){
      TodosSendMail.map(item => ({
        this: this.mailService.sendMail({
          from: 'todo@gmail.com',
          to: item.email,
          subject: "Todo Application",
          text: `${item.title} - Pending`
        })
      }))
    }
  }

}

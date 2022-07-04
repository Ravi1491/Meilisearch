import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';
import { RemainderModule } from './modules/remainder/remainder.module';
import { SearchModule } from './modules/search/search.module';
import { IndexModule } from './modules/search/indexes/index.module';
import { DocumentModule } from './modules/search/documents/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.local.env'] }),
    DatabaseModule,
    forwardRef(() => UserModule),
    TodoModule,
    RemainderModule,
    IndexModule,
    DocumentModule,
    forwardRef(() => SearchModule)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

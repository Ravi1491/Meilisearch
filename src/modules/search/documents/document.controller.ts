import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TodoService } from '../../todo/todo.service';
import { DocumentService } from './document.service';
import { DocumentIndexDto } from './dto/document.dto';

@Controller('indexes/:index_uid/documents')
export class DocumentController {
  constructor(
    private documentService: DocumentService,
  ) {}

  @Get(':document_id')
  public async getDocuments(@Param('index_uid') index_uid: string, @Param('document_id') document_id: number){
    return this.documentService.getDocuments(index_uid, document_id); 
  }

  @Get()
  public async getAllDocuments(@Param('index_uid') index_uid: string){
    return this.documentService.getAllDocuments(index_uid);
  }

  @Post()
  public async addDocument(@Param('index_uid') index_uid: string, @Body() documentIndexDto: DocumentIndexDto){
    return this.documentService.addDocument(index_uid, documentIndexDto);
  }

  @Put()
  public async updateDocument(@Param('index_uid') index_uid: string, @Body() documentIndexDto: DocumentIndexDto){
    return this.documentService.updateDocument(index_uid, documentIndexDto);
  }

  @Delete(':document_id')
  public async deleteOneDocument(@Param('index_uid') index_uid: string,@Param('document_id') document_id: number){
    return this.documentService.deleteOneDocument(index_uid, document_id);
  }

  @Delete()
  public async deleteAllDocument(@Param('index_uid') index_uid: string){
    return this.documentService.deleteAllDocument(index_uid);
  }
  
}
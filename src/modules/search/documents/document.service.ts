import { Injectable } from '@nestjs/common';
import MeiliSearch, { Index, SearchParams } from 'meilisearch';
import { DocumentIndexDto, TodoDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentService {
  private _client: MeiliSearch;

  constructor() {
    this._client = new MeiliSearch({
      host: 'http://localhost:7700/',
    });
  }
  
  public getIndex(index_uid: string): Index {
    return this._client.index(index_uid);
  }

  public async getDocuments(index_uid: string, document_id: number){
    const index = this.getIndex(index_uid);
    return await index.getDocument(document_id);
  }

  public async getAllDocuments(index_uid: string){
    const index = this.getIndex(index_uid);
    return await index.getDocuments();
  }

  public async addDocument(index_uid: string, DocumentIndexDto: DocumentIndexDto){
    const index = this.getIndex(index_uid);
    return await index.addDocuments([DocumentIndexDto]);  
  }



  public async addTodoDocument(index_uid: string, todoDocumentDto: TodoDocumentDto){
    const index = this.getIndex(index_uid);
    return await index.addDocuments([todoDocumentDto]);  
  }


  
  public async updateDocument(index_uid: string, DocumentIndexDto: DocumentIndexDto){
    const index = this.getIndex(index_uid);
    return await index.updateDocuments([DocumentIndexDto]);  
  }

  public async deleteOneDocument(index_uid: string, document_id: number){
    const index = this.getIndex(index_uid);
    return await index.deleteDocument(document_id);  
  }
  
  public async deleteAllDocument(index_uid: string){
    const index = this.getIndex(index_uid);
    return await index.deleteAllDocuments();  
  }
  
}
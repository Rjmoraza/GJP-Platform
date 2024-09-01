import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  providers: [BsModalService]
})
export class MessagesComponent {
  title: string = '';
  message: string = '';
  acceptAction?: Function | null = null;
  cancelAction?: Function | null = null;

  @ViewChild('modalMessage', {static: true}) modalMessage? : TemplateRef<any>;
  messageRef?: BsModalRef;

  @ViewChild('modalDialog', {static: true}) modalDialog? : TemplateRef<any>;
  dialogRef?: BsModalRef;

  @ViewChild('modalQuestion', {static: true}) modalQuestion? : TemplateRef<any>;
  questionRef?: BsModalRef;

  answer: string = '';

  constructor(private modalService: BsModalService){}

  ngOnInit(): void {}

  showMessage(title: string, message: string, acceptAction: Function | null = null)
  {
    if(this.modalMessage)
    {
      this.title = title;
      this.message = message;
      this.messageRef = this.modalService.show(this.modalMessage);
      this.acceptAction = acceptAction;
    }
  }

  closeMessage()
  {
    this.messageRef?.hide();
    if(this.acceptAction)
    {
      this.acceptAction();
      this.acceptAction = null;
    }
  }

  showDialog(title: string, message: string, accept?: Function, cancel?: Function)
  {
    if(this.modalDialog)
    {
      this.title = title;
      this.message = message;
      this.dialogRef = this.modalService.show(this.modalDialog);
      this.acceptAction = accept;
      this.cancelAction = cancel;
    }
  }

  closeDialog(accept: boolean)
  {
    if(accept && this.acceptAction)
    {
      this.acceptAction();
    }
    else if(!accept && this.cancelAction)
    {
      this.cancelAction();
    }
    this.dialogRef?.hide();
    this.acceptAction = null;
    this.cancelAction = null;
  }

  showQuestion(title: string, message: string, accept?: Function, cancel?: Function)
  {
    console.log("Trying to show question... ");
    if(this.modalQuestion)
    {
      this.title = title;
      this.message = message;
      this.questionRef = this.modalService.show(this.modalQuestion);
      this.acceptAction = accept;
      this.cancelAction = cancel;
    }
  }

  closeQuestion(accept: boolean)
  {
    if(accept && this.acceptAction)
    {
      this.acceptAction(this.answer);
    }
    else if(!accept && this.cancelAction)
    {
      this.cancelAction();
    }
    this.answer = '';
    this.questionRef?.hide();
    this.acceptAction = null;
    this.cancelAction = null;
  }
}

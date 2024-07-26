import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  providers: [BsModalService]
})
export class MessagesComponent {
  title: string = '';
  message: string = '';
  acceptAction?: Function;
  cancelAction?: Function;
  @ViewChild('modalMessage', {static: true}) modalMessage? : TemplateRef<any>;
  messageRef?: BsModalRef;

  @ViewChild('modalDialog', {static: true}) modalDialog? : TemplateRef<any>;
  dialogRef?: BsModalRef;

  constructor(private modalService: BsModalService){}

  ngOnInit(): void {}

  showMessage(title: string, message: string)
  {
    if(this.modalMessage)
    {
      this.title = title;
      this.message = message;
      this.messageRef = this.modalService.show(this.modalMessage);
    }
  }

  closeMessage()
  {
    this.messageRef?.hide();
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
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.prod';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './upload-csv.component.html',
  styleUrl : './upload-csv.component.css'
})
export class UploadCsvComponent {
  @Output() updateJammers = new EventEmitter();

  file: File | null = null;
  fileRecords: any[] = [];
  correctRecords: number = 0;
  faultyRecords: number = 0;
  registrationResults: string[] = [];
  errorLog: string[] = [];

  constructor(private http: HttpClient, private UserService: UserService) {}

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile)
    {
      console.error("No file was selected or the file is invalid");
      return;
    }

    console.log(selectedFile);
    const fileNameParts = selectedFile.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    if (fileExtension !== 'csv') {
      console.error('File format is incorrect');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = reader.result as string;
      let lines = content.split('\n');
      this.correctRecords = 0;
      this.faultyRecords = 0;
      for(let i = 0; i < lines.length; ++i)
      {
        this.processRecord(lines[i]);
      }
      console.log(this.fileRecords);
    };
    reader.readAsText(selectedFile);
    this.file = selectedFile;
  }

  processRecord(record: string)
  {
    let values: string[] = record.split(',');
    if(values.length == 4)
    {
      this.correctRecords++;
      let userRecord = {
        name: values[0],
        email: values[1],
        discord: values[2],
        team: values[3]
      };
      this.fileRecords.push(userRecord);
    }
    else
    {
      this.faultyRecords++;
    }
  }

  uploadFile(): void {
    if (this.file) {
      /*
      this.UserService.uploadUsersFromCSV(this.fileRecords).subscribe(
        (response) => {
          if (response.success) {
            this.registrationResults = response.registrationResults;
            this.errorLog = response.errorLog;
            this.updateJammers.emit("");
          } else {
            console.error('Error:', response.error);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
      */
    }
  }
}

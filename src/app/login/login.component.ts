import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../messages/messages.component';
import { environment } from '../../environments/environment.prod';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MessagesComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  successMessage: string = '';
  errorMessage: string = '';

  @ViewChild(MessagesComponent) message!: MessagesComponent;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['error']) {
        console.log(params['error']);
        this.message.showMessage(
          "Error", 
          "Login link has expired, please login again",
          () => {
            this.router.navigate(['/login']);
          }
        );
      }
    });
  }

  //Esta función es para evitar que se recargue la página al hacer el submit
  handleSubmit(event: Event): void {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recargar la página)
    const emailInput = (event.target as HTMLFormElement).querySelector('#emailInput') as HTMLInputElement;
    const email = emailInput.value;
    this.sendEmail(email);
  }

  sendEmail(email: string): void {
    const url = `http://${environment.apiUrl}:3000/api/user/login-user`;
    this.userService.loginUser(url, email).subscribe({
      next: (data) =>{
        this.message.showMessage(
          "Success",
          `Login link sent to: ${data.email}`,
          () => {}
        );
      },
      error: (error) => {
        console.log(error);
        this.message.showMessage(
          "Error",
          "An error has ocurred processing your request"
        );
      }
    });
  }

  closePopup(): void {
    this.successMessage = '';
  }

  openErrorModal()
  {

  }
}

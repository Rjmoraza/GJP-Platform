import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.prod';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['error']) {
        console.log(params['error']);
        this.errorMessage = "Login link has expired, please login again";
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
    this.userService.loginUser(url, email).subscribe(
      response => {
        this.successMessage = `Link de inicio de sesión enviado a: ${response.email}`;
        this.errorMessage = "";
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }

  closePopup(): void {
    this.successMessage = '';
  }

  openErrorModal()
  {

  }
}

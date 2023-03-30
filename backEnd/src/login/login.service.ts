import { Injectable } from '@nestjs/common';
//TODO password encription



@Injectable()
export class LoginService {
  

  /**
   * Cheack against the DB if we have a registered user
   * @username and @password
   * @return if the user name has a match and if a password has a match
   */
  loginAction(username: string, password: string): boolean {
   //TODO this function
   return true
  }
}

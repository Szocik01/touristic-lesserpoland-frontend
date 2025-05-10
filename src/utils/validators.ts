class Validators {
  static validateEmail(email: string) {
    if (email.trim().length === 0) {
      return "Proszę podać email.";
    }
    if (!email.includes("@") || !email.includes(".")) {
      return "Proszę podać poprawny format maila.";
    }
    return "";
  }

  static validatePassword(password: string) {
    if (password.trim().length < 8) {
      return "Hasło powinno zawierać przynajmniej 8 znaków.";
    }
    return "";
  }

  static validateUserName(userName: string) {
    if (userName.trim().length === 0) {
      return "Proszę podać nazwę użytkownika.";
    }
    if (userName.length < 3) {
      return "Nazwa użytkownika powinna mieć przynajmniej 3 znaki.";
    }
    if (userName.length > 20) {
      return "Nazwa użytkownika powinna mieć maksymalnie 20 znaków.";
    }
    return "";
  }

  static validateConfirmPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      return "Hasła nie są takie same.";
    }
    return "";
  }

  static validateTripTitle(title: string) {
    if (title.trim().length === 0) {
      return "Tytuł nie może być pusty.";
    }
    if(title.length > 100){
      return "Tytuł nie może być dłuższy niż 100 znaków.";
    }
    return "";
  }
  
}

export default Validators;

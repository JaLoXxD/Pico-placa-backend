class Utils {
  //generateRandomPlate function considering that a car plate has 3 letters and 3 or 4 numbers
  generateRandomPlate(){
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let plate = '';
    for(let i = 0; i < 3; i++){
      plate += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    plate += '-';
    for(let i = 0; i < 3; i++){
      plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return plate;
  }

  generateRandomHexColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
      color += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return color;
  }

  getRandomCarBrand(){
    const brands = ['Toyota', 'Honda', 'Mazda', 'Nissan', 'Ford', 'Chevrolet', 'Mercedes Benz', 'BMW', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Suzuki', 'Mitsubishi', 'Peugeot', 'Renault', 'Fiat', 'Chrysler', 'Jeep', 'Dodge', 'Tesla', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche', 'Subaru', 'Lexus', 'Acura', 'Infiniti', 'Lincoln', 'Buick', 'Cadillac', 'GMC', 'Ram', 'Mini', 'Maserati', 'Alfa Romeo', 'Bentley', 'Ferrari', 'Lamborghini', 'Lotus', 'McLaren', 'Rolls Royce'];
    return brands[Math.floor(Math.random() * brands.length)];
  }

  //generate random year function between 2005 and current year
  generateRandomYear(){
    const currentYear = new Date().getFullYear();
    return Math.floor(Math.random() * (currentYear - 2005 + 1)) + 2005;
  }

  generateRandomPhoneNumber(){
    const numbers = '0123456789';
    let phoneNumber = '';
    for(let i = 0; i < 10; i++){
      phoneNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return phoneNumber;
  }
}

module.exports = Utils;
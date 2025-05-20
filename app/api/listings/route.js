export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const query = searchParams.get("query");
  const brand = searchParams.get("brand");
  const manufacturer = searchParams.get("manufacturer");
  const year = searchParams.get("year");

  const newCars = [
    {
      id: "1",
      title: "Toyota Prius 2020",
      image: "/images/prius60white.avif",
      km: 0,
      fuel: "Хибрид",
      type: "Седан",
      price: "125,000,000₮",
      location: "Улаанбаатар",
      year : 2020,
      manufacturer: "Toyota",
    },
    {
      id: "2",
      title: "Land Cruiser 300",
      image: "/images/land300.avif",
      km: 5000,
      fuel: "Дизель",
      type: "SUV",
      price: "345,000,000₮",  
      location: "Дархан",
      year : 2025,
      manufacturer: "Toyota",
    },
    {
      id: "3",
      title: "Toyota Camry 2022",
      image: "/images/camry.jpg",
      km: 10000,
      fuel: "Хибрид",
      type: "Седан",
      price: "135,000,000₮",
      location: "Архангай",
      year : 2021,
      manufacturer: "Toyota",
    },
    {
      id: "4",
      title: "Nissan GTR35",
      image: "/images/gtrR35.png",
      km: 0,
      fuel: "Хибрид",
      type: "Седан",
      price: "125,000,000₮",
      location: "Улаанбаатар",
      year : 2023,
      manufacturer: "Nissan",
    },
    {
      id: "5",
      title: "Nissan Patrol Y62",
      image: "/images/patrolY62.png",
      km: 5000,
      fuel: "Дизель",
      type: "SUV",
      price: "345,000,000₮",  
      location: "Улаанбаатар",
      year : 2024,
      manufacturer: "Nissan",
    },
    {
      id: "6",
      title: "Crown Crossover 2024",
      image: "/images/crownCrossover.avif",
      km: 10000,
      fuel: "Хибрид",
      type: "Седан",
      price: "135,000,000₮",
      location: "Улаанбаатар",
      year : 2020,
      manufacturer: "Toyota",
    },
  ];

  const electricCars = [
    {
      id: "101",
      title: "Tesla Model 3",
      image: "/images/teslaY.jpg",
      km: 0,
      fuel: "Цахилгаан",
      type: "Седан",
      price: "150,000,000₮",
      location: "Улаанбаатар",
      year : 2022,
      manufacturer: "Tesla",
    },
    {
      id: "102",
      title: "Nissan Leaf 2022",
      image: "/images/BYDsealU.avif",
      km: 2000,
      fuel: "Цахилгаан",
      type: "Седан",
      price: "60,000,000₮",
      location: "Улаанбаатар",
      year : 2023,
      manufacturer: "Nissan",
    },
    {
      id: "103",
      title: "CyberTruck",
      image: "/images/cybertruck.avif",
      km: 10,
      fuel: "Цахилгаан",
      type: "Pick-up",
      price: "450,000,000₮",
      location: "Да хүрээ",
      year : 2021,
      manufacturer: "Tesla",
    },
    {
      id: "104",
      title: "Toyota Prius 2025",
      image: "/images/prius60white.avif",
      km: 10,
      fuel: "Цахилгаан",
      type: "Sedan",
      price: "110,000,000₮",
      location: "22 авто худалдаа",
      year : 2025,
      manufacturer: "Toyota",
    },
    {
      id: "105",
      title: "BMW i8 2020",
      image: "/images/bmwi8.jpg",
      km: 10,
      fuel: "Цахилгаан",
      type: "Roadster",
      price: "240,000,000₮",
      location: "Зайсан",
      year : 2020,
      manufacturer: "BMW",
    },
  ];
 const filterCars = (cars) => {
    return cars.filter((car) => {
      const matchLocation = location ? car.location.trim() === location.trim() : true;
      const matchQuery = query ? car.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchBrand = brand ? car.title.toLowerCase().includes(brand.toLowerCase()) : true;
      const matchManufacturer = manufacturer ? car.title.toLowerCase().includes(manufacturer.toLowerCase()) : true;
      const matchYear = year ? car.title.includes(year) : true;

      return (
        matchLocation &&
        matchQuery &&
        matchBrand &&
        matchManufacturer &&
        matchYear
      );
    });
  };

  const filteredNewCars = filterCars(newCars);
  const filteredElectricCars = filterCars(electricCars);

  return Response.json({
    newCars: filteredNewCars,
    electricCars: filteredElectricCars,
  });
}
// app/api/listings/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locationQuery = searchParams.get("location");

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
    },
  ];

  const filteredNewCars = locationQuery
    ? newCars.filter((car) => car.location.trim() === locationQuery.trim())
    : newCars;

  const filteredElectricCars = locationQuery
    ? electricCars.filter((car) => car.location.trim() === locationQuery.trim())
    : electricCars;

  return Response.json({
    newCars: filteredNewCars,
    electricCars: filteredElectricCars,
  });
}
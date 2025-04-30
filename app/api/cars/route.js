// app/api/cars/route.js
export async function GET() {
    const cars = [
      {
        id: 1,
        name: "Toyota Prius 2020",
        price: "125,000,000₮",
        type: "hybrid",
        location: "Улаанбаатар"
      },
      {
        id: 2,
        name: "Tesla Model 3",
        price: "180,000,000₮",
        type: "electric",
        location: "Дархан"
      }
    ];
  
    return Response.json(cars);
  }
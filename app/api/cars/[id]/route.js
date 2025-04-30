// app/api/cars/[id]/route.js
const cars = [
    { id: 1, name: "Toyota Prius 2020", price: "125,000,000₮" },
    { id: 2, name: "Tesla Model 3", price: "180,000,000₮" }
  ];
  
  export async function GET(_, { params }) {
    const carId = Number(params.id);
    const car = cars.find((c) => c.id === carId);
    
    if (!car) {
      return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
    }
  
    return Response.json(car);
  }

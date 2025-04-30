export async function GET() {
    const profile = {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      favourites: [1, 2]
    };
    return Response.json(profile);
  }

e
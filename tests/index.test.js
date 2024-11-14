const axios = require("axios");

function sum(a, b) {
  return a + b;
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is Able to sign up only once", async () => {
    const username = "Shiruvati" + Math.random();
    const password = "428349384";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(updatedResponse.statusCode).toBe(400);
  });

  test("Signup request fails if the Usename is empty", async () => {
    const username = `shiruvati-${Math.random()}`;
    const password = "428349384";

    const response = await axios.post(`${BACKEND_URL}/api/v1/sigup`, {
      password,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Signin suceeds if the username and password are correct", async () => {
    const username = `Shiruvati-${Math.random()}`;
    const password = "428349384";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("Signin fails if the username and password are incorrect", async () => {
    const username = `Shiruvati-${Math.random()}`;
    const password = "428349384";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User metadata endpoint", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `Shiruvati-${Math.random()}`;
    const password = "428349384";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    const avatarResponse = await axios.get(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?qq=tbn:ANd9GcQm3RFDZM21teuCMFYx_AzUwDBROFww&s",

        name: "Timmy",
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("User cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "1234567890",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with a right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });
  test("User is not able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let avatarId;
  let token;
  let userId;
  beforeAll(async () => {
    const username = `Shiruvati-${Math.random()}`;
    const password = "428349384";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    userId = signupResponse.data.userId;

    token = response.data.token;
    const avatarResponse = await axios.get(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?qq=tbn:ANd9GcQm3RFDZM21teuCMFYx_AzUwDBROFww&s",

        name: "Timmy",
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get Back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/medata/bulk?ids=[${userId}]`
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars list the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/admin/avatars`);
    expect(response.data.avatars.length).toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);

    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let token;
  let userId;

  beforeAll(async () => {
    const username = `Shiruvati-${Math.random()}`;
    const password = "428349384";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
  });
});

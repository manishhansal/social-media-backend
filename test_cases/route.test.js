import { it, expect, describe, beforeEach, afterEach } from "vitest";
const request = require("supertest");
const app = require("../routes/user");
const assert = require("assert");
const mongoose = require("mongoose");
require("dotenv").config();

let token;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mgnrv.mongodb.net/social_backend?retryWrites=true&w=majority`
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /", () => {
  it("home route", () => {
    request(app).get("/").expect(200);
  });
});

// Test suite for the authenticate endpoint
describe("Authenticate Endpoint Test Suite", () => {
  // Test case 1: User can authenticate with valid credentials
  it("User can authenticate with valid credentials", async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({ email: "manish@gmail.com", password: "manish123" })
      .set("Accept", "application/json")
      .expect(200);
    
    assert(res.body.status === 200);
    token = res.body.token;
  });

  // Test case 2: User cannot authenticate with invalid email
    it('User cannot authenticate with invalid email', async () => {
      const res = await request(app)
        .post('/api/authenticate')
        .send({email: 'invalidUser', password: 'testPassword'})
        .set('Accept', 'application/json')
        .expect(404);
      assert(!res.body.success);
      assert(res.body.message === 'no user found');
    });

  // Test case 3: User cannot authenticate with invalid password
    it('User cannot authenticate with invalid password', async () => {
      const res = await request(app)
        .post('/api/authenticate')
        .send({username: 'manish@gmail.com', password: 'invalidPassword'})
        .set('Accept', 'application/json')
        .expect(401);
      assert(!res.body.success);
      assert(res.body.message === 'wrong password');
    });

  // Test case 4: User cannot authenticate with empty input fields
    it('User cannot authenticate with empty input fields', async () => {
      const res = await request(app)
        .post('/api/authenticate')
        .send({email: '', password: ''})
        .set('Accept', 'application/json')
        .expect(400);
      assert(!res.body.success);
    });
});


// Test suite for the getAllPosts endpoint
describe("Get All Posts Endpoint Test Suite", () => {
  // Test case 1: User can get all posts
  it("User can get all posts", async () => {
    const res = await request(app)
      .get("/api/all_posts")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot get all posts without authentication
  it("User cannot get all posts without authentication", async () => {
    const res = await request(app)
      .get("/api/all_posts")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the getSinglePost endpoint
describe("Get Single Post Endpoint Test Suite", () => {
  // Test case 1: User can get a single post
  it("User can get a single post", async () => {
    const res = await request(app)
      .get("/api/posts/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot get a single post without authentication
  it("User cannot get a single post without authentication", async () => {
    const res = await request(app)
      .get("/api/posts/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the createPost endpoint
describe("Create Post Endpoint Test Suite", () => {
  // Test case 1: User can create a post
  it("User can create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({
        title: "Test Post",
        desc: "This is a test post.",
      })
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot create a post without authentication
  it("User cannot create a post without authentication", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({
        title: "Test Post",
        desc: "This is a test post.",
      })
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the createComment endpoint
describe("Create Comment Endpoint Test Suite", () => {
  // Test case 1: User can create a comment
  it("User can create a comment", async () => {
    const res = await request(app)
      .post("/api/comment/6437924ad37a1ce7bfeab78e")
      .send({
        comment: "This is a test comment.",
      })
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot create a comment without authentication
  it("User cannot create a comment without authentication", async () => {
    const res = await request(app)
      .post("/api/comment/6437924ad37a1ce7bfeab78e")
      .send({
        comment: "This is a test comment.",
      })
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the likePost endpoint
describe("Like Post Endpoint Test Suite", () => {
  // Test case 1: User can like a post
  it("User can like a post", async () => {
    const res = await request(app)
      .put("/api/like/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot like a post without authentication
  it("User cannot like a post without authentication", async () => {
    const res = await request(app)
      .put("/api/like/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the unlikePost endpoint
describe("Unlike Post Endpoint Test Suite", () => {
  // Test case 1: User can unlike a post
  it("User can unlike a post", async () => {
    const res = await request(app)
      .put("/api/unlike/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot unlike a post without authentication
  it("User cannot unlike a post without authentication", async () => {
    const res = await request(app)
      .put("/api/unlike/6437924ad37a1ce7bfeab78e")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the deletePost endpoint
describe("Delete Post Endpoint Test Suite", () => {
  // Test case 1: User can delete a post
  it("User can delete a post", async () => {
    const res = await request(app)
      .delete("/api/posts/6437b0046ee1a4ae45360d15")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot delete a post without authentication
  it("User cannot delete a post without authentication", async () => {
    const res = await request(app)
      .delete("/api/posts/6437b0046ee1a4ae45360d15")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the followUser endpoint
describe("Follow User Endpoint Test Suite", () => {
  // Test case 1: User can follow another user
  it("User can follow another user", async () => {
    const res = await request(app)
      .put("/api/follow/abhis")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot follow another user without authentication
  it("User cannot follow another user without authentication", async () => {
    const res = await request(app)
      .put("/api/follow/abhis")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the unfollowUser endpoint
describe("Unfollow User Endpoint Test Suite", () => {
  // Test case 1: User can unfollow another user
  it("User can unfollow another user", async () => {
    const res = await request(app)
      .put("/api/unfollow/abhis")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot unfollow another user without authentication
  it("User cannot unfollow another user without authentication", async () => {
    const res = await request(app)
      .put("/api/unfollow/abhis")
      .set("Accept", "application/json")
      .expect(401);
    assert(res.body.status === 401);
  });
});

// Test suite for the getUser endpoint
describe("Get User Endpoint Test Suite", () => {
  // Test case 1: User can get a user
  it("User can get a user", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Accept", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert(res.body.status === 200);
  });

  // Test case 2: User cannot get a user without authentication
  it("User cannot get a user without authentication", async () => {
    const res = await request(app)
      .get("/api/user")
      .expect(401);
    assert(res.body.status === 401);
  });
});

    

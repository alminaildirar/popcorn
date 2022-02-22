## POPCORN APP 🍿

In this project, basically, users can add films or actors, see the publicly shared posts by other users, can like/re-like these posts and comment on these posts. Users can use their google or facebook facebook accounts to enter popcorn, or user can register locally and log in.

## 🌏 Check out [ demo](https://popcorn-final.herokuapp.com/)

---

### 🔎 Technologies

- Node.js
- Typescript
- Express.js
- TypeORM
- MySQL
- Passport.js
- HTML
- CSS
- Template Engine (Ejs)

---

## ✨ Main Features

- Users can log in to the application with their google or facebook accounts. If these accounts use the same email, the user will see the same content.
- When the login process is verified, the user is directed to the dashboard screen where the most liked film and actor are shown.
- The user can see all the movies and actors that are shared as public from the "All Films"/"All Actors" section.
- Users can like/re-like these films or actors.
- The user can see the comments on these single pages of these posts, make comments, and delete their own comments.
- Users can add their own films/actors to the app. Later, users can update their own posts. Users can make their posts public/private by setting visibility and delete their own posts.

---

## ⚙️****Installation****

1. Clone this repo, install dependencies.

```makefile
gh repo clone Kodluyoruz-NodeJs-Bootcamp/final-project-alminaildirar
cd final-project-alminaildirar
npm install
```

2- Create .env file like;

```makefile
PORT = <port number>
GOOGLE_CLIENT_ID = <google client id>
GOOGLE_CLIENT_SECRET = <google client secret>
FACEBOOK_APP_ID = <facebook app id>
FACEBOOK_APP_SECRET = <facebook app secret>
TOKEN_SECRET = <token secret for jwt>
```

❗MySQL must installed in your local. After these steps; setup database settings inside ‘ormconfig.json’ file.

3- Build and run project;

```makefile
npm run build
npm start
```

## 📸 Demo Video


https://user-images.githubusercontent.com/55828986/153796141-61e4f68b-70eb-45dc-b0ad-678a557139b1.mp4

### 📩 Contact

Almina ILDIRAR
[Linkedin](https://tr.linkedin.com/in/alminaildirar/en?trk=people-guest_people_search-card)
[Github](https://github.com/alminaildirar)

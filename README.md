# Tetris Duels

[Website, try it out!](https://tetrisduels.hop.sh/)

[Video Demo](https://www.youtube.com/watch?v=y8wPmVJEqlc)

## Inspiration

I recently watched a video about a competitive tetris came and was intrigued by it. Thus I decided to see if I would be able to create a similar version.

## What it does

Tetris Duels lets you play Tetris alone or with family and friends. Compete to see who can get the highest score!

## How I built it

The front end was built using react and the backend was build using expressjs.
Both were deployed using hop.io ignite.

Hop.io Channels were used to maintain a state between the client, server, and different users.

## Challenges I ran into

The biggest challenge was not knowing any react, expressjs, and hop.io prior to this hackathon and doing it solo.

## Accomplishments that I'm proud of

Was able to successfully make a front end and backend and deploy it on hop.io
Managed to finish 2/3 of planned features.

I used search params in the versus mode to allow for links to be shared between friends and family to allow them to join and spectate the match. This wouldn't have been possible without some really complicated objects in both hop and the server.

Was able to successfully make a backend server for the first time. Since this is the first time ever making a server, I was particularly excited when it worked the first time.

## What I learned

Learned a great deal about react and expressjs. For example, I learned how to utilize both useState and useRef hooks in react to get state even with outdated references. Also learned how to use react router.

I also learned how to handle http requests from client to server and http response from server to client.

## What's next for Tetris Duels

In the future, I plan on making the UI much better.

I also plan on adding more modes not just limited to the co-op mode. For example, a timed versus mode where the objective is to score as many points as possible in a timeframe. Mode will have more controls as well. For example, resetting a game, or leaving a position.

Furthermore, due to this being the first time I’ve used ExpressJs, the communication between my server and client is simple http requests. In the future, I plan on using websockets to further reduce latency. Moreover, I’ve only touched the tip of the iceberg in regards to Hop’s services. In the future, I plan on fully utilizing Hop’s features such as chat rooms, private channels, custom games, etc.

We hope that this project would be fun for students and the general public.

## To run the program in an IDE

First, ensure you have Node Program Manager installed

Next, run `npm install` to install the modules

Then, run `npm start` to start the app

Finally, navigate to `http://localhost:3000` in a browser to view the local version of the app
